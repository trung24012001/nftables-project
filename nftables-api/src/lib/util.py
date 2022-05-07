import json
from src.schema.database import AlchemyEncoder


def parse_query(data):
    return json.loads(json.dumps(data, cls=AlchemyEncoder))


def nft_handle_parser(data, handle):
    return {"nftables": [{handle: data}]}


def nft_expr_parser(data):
    if not isinstance(data["value"], list):
        return {
            "match": {
                "op": "==",
                "left": {"payload": data["payload"]},
                "right":  data['value']
            }
        }
    list_data = []
    for value in data["value"]:
        if value.find('-') >= 0:
            list_data.append({
                'range': value.split('-')
            })
            continue
        list_data.append(value)
    return {
        "match": {
            "op": "==",
            "left": {"payload": data["payload"]},
            "right": {
                "set": list_data
            },
        }
    }


def get_expr_value(expr, keys):
    if not expr:
        return None
    result = {}
    for object in expr:
        match = object.get("match")
        if not match:
            continue
        m_key = match.get("left").get("payload").get("field")
        if m_key in keys:
            right = match.get("right")
            if not isinstance(right, dict):
                result[m_key] = [right]
                continue
            set = right.get("set")
            if not set:
                continue
            data = []
            for value in set:
                if not isinstance(value, dict):
                    data.append(value)
                    continue
                data.append('-'.join(str(x)
                            for x in value.get("range")))

            result[m_key] = data
    return result


def get_expr_prot(expr):
    if not expr:
        return None

    prots = None

    for object in expr:
        match = object.get("match")
        if not match:
            continue
        left = object.get("match").get("left")
        right = object.get("match").get("right")
        m_key = left.get("payload").get("field")
        if m_key == "sport" or m_key == "dport":
            return [left.get("payload").get("protocol")]
        if m_key == "protocol":
            if isinstance(right, dict):
                prots = right.get("set")
            else:
                prots = [right]
    return prots


def get_expr_policy(expr, actions):
    if not expr:
        return None
    for object in expr:
        for type in actions:
            if type in object:
                return type
    return None


def get_expr_nat(expr):
    for object in expr:
        policy = object.get('dnat') or object.get('snat')
        if policy:
            result = ''
            if policy.get('addr'):
                addr = policy['addr']
                if isinstance(addr, dict):
                    result += '-'.join(addr.get('range'))
                else:
                    result += addr
            if policy.get('port'):
                result += ':'
                port = policy.get('port')
                if isinstance(port, dict):
                    result += '-'.join(str(p) for p in port.get('range'))
                else:
                    result += str(port)
            return result
        policy = object.get('redirect')
        if policy:
            return policy.get("port")

    return None


def nft_rule_formatter(rule):
    family = rule["chain"].get("family")
    rule_formatter = {
        "rule": {
            "family": family,
            "table": rule["chain"].get("table"),
            "chain": rule["chain"].get("name"),
        }
    }
    expr = []
    if rule.get("ip_src"):
        ip_src_match = {
            "payload": {"protocol": family, "field": "saddr"},
            "value": rule["ip_src"],
        }
        expr.append(
            nft_expr_parser(ip_src_match))
    if rule.get("ip_dst"):
        ip_dst_match = {
            "payload": {"protocol": family, "field": "daddr"},
            "value": rule["ip_dst"],
        }
        expr.append(
            nft_expr_parser(ip_dst_match))
    if rule.get("protocol") or rule.get("port_prot"):
        value = None
        if rule.get('port_prot'):
            value = rule["port_prot"]
        else:
            value = rule["protocol"]
        print('aaaaaaaaa', value)
        protocol_match = {
            "payload": {"protocol": family, "field": "protocol"},
            "value": value,
        }
        expr.append(
            nft_expr_parser(protocol_match))
    if rule.get("port_src"):
        port_src_match = {
            "payload": {"protocol": rule['port_prot'], "field": "sport"},
            "value": rule["port_src"],
        }
        expr.append(
            nft_expr_parser(port_src_match))
    if rule.get("port_dst"):
        port_dst_match = {
            "payload": {"protocol": rule['port_prot'], "field": "dport"},
            "value": rule["port_dst"],
        }
        expr.append(
            nft_expr_parser(port_dst_match))

    rule_formatter["rule"]["expr"] = expr

    return rule_formatter


def filter_rule_formatter(rule):
    rule_formatter = nft_rule_formatter(rule)
    rule_formatter["rule"]["expr"].append({
        rule["policy"]: None
    })
    return rule_formatter


def nat_rule_formatter(rule):
    rule_formatter = nft_rule_formatter(rule)
    ip_and_port = rule['to'].split(':')
    result = {}
    if ip_and_port[0]:
        ip = ip_and_port[0]
        if ip.find('-') >= 0:
            ip = dict(range=ip.split('-'))
        if ip.find('/') >= 0:
            ip = ip.split('/')[0]
        result['addr'] = ip
    if len(ip_and_port) == 2:
        port = ip_and_port[1]
        if port.find('-') >= 0:
            port = dict(range=port.split('-'))
        else:
            port = int(port)
        result['port'] = port
    rule_formatter["rule"]["expr"].append({
        rule["policy"]: result or None
    })
    return rule_formatter


def decompose_ip(ips):
    arr = []
    for item in ips:
        range = item.split('-')
        for item in range:
            arr.append(item)
    return arr


def decompose_port(ports):
    arr = []
    for item in ports:
        range = item.split('-')
        for item in range:
            arr.append(item)
    return arr
