from src.schema.database import IpDst, IpSrc, PortSrc, PortDst, Protocol, Table, Chain, Rule, session
import src.service.decompose as decompose
import numpy as np


def query_rule(rule_id):
    rule = session.query(Rule).join(IpSrc).join(IpDst).join(PortSrc).join(PortDst).join(Protocol).join(
        Chain).join(Table, Table.id == Chain.table_id).filter(Rule.id == rule_id).first()
    if not rule:
        return None
    ip_src = []
    ip_dst = []
    port_src = []
    port_dst = []
    prots = []
    for ip in rule.ip_src_list:
        ip_src.append(ip.host)
    for ip in rule.ip_dst_list:
        ip_dst.append(ip.host)
    for port in rule.port_src_list:
        port_src.append(port.port)
    for port in rule.port_dst_list:
        port_dst.append(port.port)
    for prot in rule.protocols:
        prots.append(prot.protocol)
    return {
        "ip_src": ip_src,
        "ip_dst": ip_dst,
        "port_src": port_src,
        "port_dst": port_dst,
        "protocol": prots,
        "policy": rule.policy,
        "handle": rule.handle,
        "family": rule.chain.table.family,
        "table": rule.chain.table.name,
        "chain": rule.chain.name,
        "hook": rule.chain.hook
    }


# rule_a is handled before rule_b in firewall os
# X: range A > B
# Y: range A ∩ B
# Z: range A < B
# S: skip
# 1: same policy
# 0: diff policy


def normalize_anomaly(anomaly, fields):
    anomaly['norm'] = {}
    for field in fields:
        rule_a = anomaly['rule_a']
        rule_b = anomaly['rule_b']
        if rule_a['policy'] == rule_b['policy']:
            anomaly['norm']['policy'] = 1
            return anomaly
        anomaly['norm']['policy'] = 0
        if np.array_equal(rule_a[field], rule_b[field]):
            anomaly['norm'][field] = 'S'
        elif '*' in rule_a[field]:
            anomaly['norm'][field] = 'X'
        elif '*' in rule_b[field]:
            anomaly['norm'][field] = 'Z'
        elif (rule_a[field][0] in rule_b[field] and
                rule_a[field][-1] in rule_b[field]):
            anomaly['norm'][field] = 'Z'
        elif (rule_b[field][0] in rule_a[field] and
              rule_b[field][-1] in rule_a[field]):
            anomaly['norm'][field] = 'X'
        else:
            anomaly['norm'][field] = 'Y'

    return True


def classify_anomaly(norm, fields):
    shadow = 0
    general = 0
    if norm['policy'] == 1:
        return 'redundancy'
    for field in fields:
        if norm[field] == 'X':
            shadow += 1
        elif norm[field] == 'Z':
            general += 1
        elif norm[field] == 'S':
            shadow += 1
            general += 1
    if shadow == len(fields):
        return 'shadowing'
    if general == len(fields):
        return 'generalization'
    return 'correlation'


def parse_anomaly(row):
    fields = ['ip_src', 'ip_dst', 'port_src', 'port_dst', 'protocol']
    rule_1 = query_rule(row.rule_id_1)
    rule_2 = query_rule(row.rule_id_2)
    if rule_1['handle'] > rule_2['handle']:
        rule_1, rule_2 = rule_2, rule_1
    anomaly = {
        'id':  '-'.join(str(x) for x in [rule_1['handle'], rule_2['handle']]),
        'rule_a': rule_1,
        'rule_b': rule_2
    }

    normalize_anomaly(anomaly, fields)
    anomaly['anomaly_type'] = classify_anomaly(
        norm=anomaly['norm'], fields=fields)
    # it works good
    # decompose.recompose(
    #     [anomaly['rule_a'], anomaly['rule_b']], fields)
    return anomaly


def analytics(anomalies):
    result = {
        "shadowing": 0,
        "generalization": 0,
        "correlation": 0,
        "redundancy": 0,
    }
    for anomaly in anomalies:
        type = anomaly['anomaly_type']
        if result.get(type) == None:
            continue
        result[type] += 1
    return result


def sql_detect_anomaly(ruleset):
    for rule in ruleset:
        decompose.insert_db(rule)

    with open("detection/my_script1.sql", encoding='utf-8') as f:
        anomaly_sql = f.read()
    query = list(session.execute(anomaly_sql))
    classify = list(map(parse_anomaly, query))

    tmp = []

    def remove_dup(anomaly):
        if anomaly['id'] not in tmp:
            tmp.append(anomaly['id'])
            return True
        return False
    anomalies = list(filter(remove_dup, classify))

    return {
        "anomalies": anomalies,
        "analytics": analytics(anomalies)
    }


# raw detection

def format_anomaly(anomaly):
    fields = ['ip_src', 'ip_dst', 'port_src', 'port_dst', 'protocol']

    normalize_anomaly(anomaly, fields)
    anomaly['anomaly_type'] = classify_anomaly(
        norm=anomaly['norm'], fields=fields)
    # this comment is bugggg unknown why????
    # decompose.recompose(
    #     [anomaly['rule_a'], anomaly['rule_b']], fields)
    return anomaly


def test(anomaly):
    fields = ['ip_src', 'ip_dst', 'port_src', 'port_dst', 'protocol']
    decompose.recompose(
        [anomaly['rule_a'], anomaly['rule_b']], fields)


def raw_detect_anomaly(ruleset):
    decompose.decompose(ruleset)
    pair_list = algorithm_detection(ruleset)
    anomalies = list(map(format_anomaly, pair_list))
    return {
        "anomalies":  anomalies,
        "analytics": analytics(anomalies)
    }


def algorithm_detection(ruleset):
    pair_list = []
    len_ruleset = len(ruleset)
    for i in range(len_ruleset - 1):
        for j in range(i + 1, len_ruleset):
            if compare_rule(ruleset[i], ruleset[j]):
                pair_list.append({
                    'id':  '-'.join(str(x) for x in [ruleset[i]['handle'], ruleset[j]['handle']]),
                    'rule_a': ruleset[i],
                    'rule_b': ruleset[j]
                })
    return pair_list


def compare_rule(rule_1, rule_2):
    fields = ['family', 'table', 'chain', 'hook', 'ip_src',
              'ip_dst', 'port_src', 'port_dst', 'protocol']

    for field in fields:
        if not match_property(rule_1[field], rule_2[field]):
            return False

    return True


def match_property(prop_1, prop_2):
    if type(prop_1) == str:
        if prop_1 == prop_2:
            return True
        else:
            return False

    if '*' in [*prop_1, *prop_2]:
        return True
    for p in prop_1:
        if p in prop_2:
            return True

    return False
