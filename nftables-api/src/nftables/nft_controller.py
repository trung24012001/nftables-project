from src.nftables.nft import load_nft, read_nft
import src.lib.util as util


def get_tables():
    data_structure = read_nft("list tables")
    tables = []
    for object in data_structure["nftables"]:
        table = object.get("table")
        if not table:
            continue
        tables.append(
            dict(family=table["family"], name=table["name"], handle=table["handle"])
        )

    return tables


def add_table(table):
    data_structure = util.nft_handle_parser({"table": table}, "add")
    ret = load_nft(data_structure)

    return ret


def delete_table(table):
    data_structure = util.nft_handle_parser({"table": table}, "delete")
    ret = load_nft(data_structure)

    return ret


def get_chains():
    data_structure = read_nft("list chains")
    chains = []
    for object in data_structure["nftables"]:
        chain = object.get("chain")
        if not chain:
            continue
        chains.append(
            dict(
                table=chain["table"],
                name=chain["name"],
                handle=chain["handle"],
                hook=chain.get("hook"),
                priority=chain.get("prio"),
                policy=chain.get("policy"),
            )
        )

    return chains


def get_chains_from_table(table=""):
    data_structure = read_nft("list chains")
    chains = []

    for object in data_structure["nftables"]:
        chain = object.get("chain")
        if not chain:
            continue
        if table != chain.get("table"):
            print("check")
            continue
        chains.append(
            dict(
                table=chain["table"],
                name=chain["name"],
                handle=chain["handle"],
                type=chain.get("type"),
                hook=chain.get("hook"),
                priority=chain.get("prio"),
                policy=chain.get("policy"),
            )
        )

    return chains


def add_chain(chain):
    data_structure = util.nft_handle_parser({"chain": chain}, "add")
    ret = load_nft(data_structure)

    return ret


def delete_chain(name, table):
    data_structure = util.nft_handle_parser(
        {
            "table": {
                "table": table,
                "name": name,
            }
        },
        "delete",
    )
    ret = load_nft(data_structure)

    return ret


def get_ruleset():
    data_structure = read_nft("list ruleset")
    rules = []
    for object in data_structure["nftables"]:
        rule = object.get("rule")
        if not rule:
            continue

        rules.append(
            dict(
                family=rule["family"],
                table=rule["table"],
                chain=rule["chain"],
                handle=rule["handle"],
                ip_src=util.get_expr_value(rule.get("expr"), "saddr"),
                ip_dst=util.get_expr_value(rule.get("expr"), "daddr"),
                port_src=util.get_expr_value(rule.get("expr"), "sport"),
                port_dst=util.get_expr_value(rule.get("expr"), "dport"),
                policy=list(rule["expr"][-1].keys())[0],
            )
        )

    return rules


def add_filter_rule(rule):
    rule_formater = {
        "rule": {
            "family": rule["family"],
            "table": rule["table"],
            "chain": rule["chain"],
            "expr": [],
        }
    }

    if rule.get("ip_src"):
        ip_src = rule["ip_src"]
        ip_src_match = {
            "payload": {"protocol": ip_src["protocol"], "field": "daddr"},
            "value": ip_src["value"],
        }
        rule_formater["rule"]["expr"].append(util.nft_expr_parser(ip_src_match))

    if rule.get("ip_dst"):
        ip_dst = rule["ip_dst"]
        ip_dst_match = {
            "payload": {"protocol": ip_dst["protocol"], "field": "daddr"},
            "value": ip_dst["value"],
        }
        rule_formater["rule"]["expr"].append(util.nft_expr_parser(ip_dst_match))

    if rule.get("protocol"):
        prot = rule["protocol"]
        protocol_match = {
            "payload": {"protocol": prot["protocol"], "field": "protocol"},
            "value": prot["value"],
        }
        rule_formater["rule"]["expr"].append(util.nft_expr_parser(protocol_match))

    if rule.get("port_src"):
        s_port = rule["port_src"]
        port_src_match = {
            "payload": {"protocol": s_port["protocol"], "field": "sport"},
            "value": s_port["value"],
        }
        rule_formater["rule"]["expr"].append(util.nft_expr_parser(port_src_match))

    if rule.get("port_dst"):
        d_port = rule["port_dst"]
        port_dst_match = {
            "payload": {"protocol": d_port["protocol"], "field": "sport"},
            "value": d_port["value"],
        }
        rule_formater["rule"]["expr"].append(util.nft_expr_parser(port_dst_match))

    rule_formater["rule"]["expr"].append({rule["policy"]: None})

    data_structure = util.nft_handle_parser(
        rule_formater,
        "add",
    )
    ret = load_nft(data_structure)

    return ret


def delete_rule():
    print()
