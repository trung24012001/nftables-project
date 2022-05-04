import json
from src.schema.database import AlchemyEncoder


def parse_query(data):
    return json.loads(json.dumps(data, cls=AlchemyEncoder))


def nft_handle_parser(data, handle):
    return {"nftables": [{handle: data}]}


def nft_expr_parser(data):
    if data["value"] is None:
        return ""
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


def get_expr_value(expr, key):
    for object in expr:
        match = object.get("match")
        if not match:
            continue
        m_key = match.get("left").get("payload").get("field")
        if m_key == key:
            right = match.get("right")
            if not isinstance(right, dict):
                return [right]
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

            return data
    return None


def get_expr_prot(expr):
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
                return right.get("set")
            return [right]
    return None


def get_expr_action(expr, actions):
    for object in expr:
        for type in actions:
            if type in object:
                return type
    return ""


def nft_rule_formater(rule):
    print(rule)
    port_prot = rule.get('port_prot')
    family = rule["chain"].get("family")
    rule_formater = {
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
    if rule.get("protocol"):
        protocol_match = {
            "payload": {"protocol": family, "field": "protocol"},
            "value": rule["protocol"],
        }
        expr.append(
            nft_expr_parser(protocol_match))
    if rule.get("port_src"):
        port_src_match = {
            "payload": {"protocol": port_prot, "field": "sport"},
            "value": rule["port_src"],
        }
        expr.append(
            nft_expr_parser(port_src_match))
    if rule.get("port_dst"):
        port_dst_match = {
            "payload": {"protocol": port_prot, "field": "dport"},
            "value": rule["port_dst"],
        }
        expr.append(
            nft_expr_parser(port_dst_match))
    if rule.get("policy"):
        expr.append({rule["policy"]: None})

    rule_formater["rule"]["expr"] = expr

    return rule_formater


def decompose_range(data):
    arr = []
    for item in data:
        if item.find('-') < 0:
            arr.append(item)
            continue
        range_arr = item.split('-')
        print(range_arr)
        for i in range(int(range_arr[0]), int(range_arr[1]) + 1):
            arr.append(i)
    return arr


def decompose_ip(array):
    if not array:
        return None
    arr = []
    for item in array:
        if item.find('-') < 0:
            arr.append(item)
            continue
        range_arr = item.split('-')
        print(range_arr)
        for item in range_arr:
            arr.append(item)
    return arr
