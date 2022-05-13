import json
from ipaddress import ip_network, IPv4Address as ipv4
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
        if value.find('/') >= 0:
            net = ip_network(value, strict=False)
            list_data.append({
                'prefix': {
                    'addr': str(net.network_address),
                    'len': net.prefixlen
                }
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
            result[m_key] = parse_expr_value(right)

    return result


def parse_expr_value(value):
    result = []
    if not isinstance(value, dict):
        return [value]
    if value.get('range'):
        return ['-'.join(str(x) for x in value["range"])]
    if value.get('prefix'):
        prefix = value['prefix']
        net = prefix.get('addr') + '/' + str(prefix.get('len'))
        return [net]
    if value.get("set"):
        for item in value["set"]:
            for i in parse_expr_value(item):
                result.append(i)

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
        to_net = object.get('dnat') or object.get(
            'snat') or object.get('redirect')
        if not to_net:
            continue
        result = ''
        if to_net.get('addr'):
            addr = to_net['addr']
            if isinstance(addr, dict):
                result += '-'.join(addr.get('range'))
            else:
                result += addr
        if to_net.get('port'):
            result += ':'
            port = to_net['port']
            if isinstance(port, dict):
                result += '-'.join(str(p) for p in port.get('range'))
            else:
                result += str(port)
        return result

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
            net = ip_network(ip, strict=False)
            ip = dict(prefix={
                'addr': str(net.network_address),
                'len': net.prefixlen
            })
        result['addr'] = ip
    if len(ip_and_port) == 2:
        port = str(ip_and_port[1])
        if port.find('-') >= 0:
            port = dict(range=port.split('-'))
        else:
            port = int(port)
        result['port'] = port
    rule_formatter["rule"]["expr"].append({
        rule["policy"]: result or None
    })
    return rule_formatter


def decompose_data(data, type=None):
    arr = []
    for item in data:
        item = str(item)
        if item.find('/') >= 0:
            net = ip_network(item)
            for ip in net:
                arr.append(ip)
            continue
        if item.find('-') >= 0 and type:
            range = item.split('-')
            cur, end = 1, 0
            if type == 'ip':
                cur = ipv4(range[0])
                end = ipv4(range[1])
            elif type == 'port':
                cur = int(range[0])
                end = int(range[1])
            while (cur <= end):
                arr.append(str(cur))
                cur += 1
            continue
        arr.append(item)
    return arr
