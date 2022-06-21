def algorithm_detection(ruleset):
    anomalies = []
    len_ruleset = len(ruleset)
    for i in range(len_ruleset - 1):
        for j in range(i + 1, len_ruleset):
            if compare_rule(ruleset[i], ruleset[j]):
                anomalies.append({
                    'id':  '-'.join(str(x) for x in [ruleset[i]['handle'], ruleset[j]['handle']]),
                    'rule_a': ruleset[i],
                    'rule_b': ruleset[j]
                })
    return anomalies


def compare_rule(rule_1, rule_2):
    fields = ['family', 'table', 'chain', 'ip_src',
              'ip_dst', 'port_src', 'port_dst', 'protocol']

    for field in fields:
        if not match_property(rule_1[field], rule_2[field]):
            return False

    return True


def match_property(prop_1, prop_2):
    if type(prop_1) == str and prop_1 == prop_2:
        return True

    if '*' in [*prop_1, *prop_2]:
        return True
    for p in prop_1:
        if p in prop_2:
            return True

    return False


print(algorithm_detection([{
    "ip_src": ['1.2.3.4', '1.5.6.7'],
    "ip_dst": ['1.2.3.10'],
    "port_src": ['*'],
    "port_dst": ['*'],
    "protocol": ['tcp'],
    "policy": 'accept',
    "handle": 12,
    "family": 'ip',
    "table": 'filter',
    "chain": 'output',
    "hook": 'output'
}, {
    "ip_src": ['1.2.3.4'],
    "ip_dst": ['1.2.3.11'],
    "port_src": ['*'],
    "port_dst": ['*'],
    "protocol": ['tcp'],
    "policy": 'accept',
    "handle": 12,
    "family": 'ip',
    "table": 'filter',
    "chain": 'output',
    "hook": 'output'
}, ]))
