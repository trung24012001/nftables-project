from src.nftables.nft import load_nft, read_nft
import src.lib.util as util
import json


def get_tables():
    data_structure = read_nft("list tables")
    tables = []
    for object in data_structure["nftables"]:
        table = object.get("table")
        if not table:
            continue
        tables.append(
            dict(family=table["family"],
                 name=table["name"], handle=table["handle"])
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
                family=chain["family"],
                table=chain["table"],
                name=chain["name"],
                handle=chain["handle"],
                hook=chain.get("hook"),
                type=chain.get("type"),
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
                family=chain["family"],
                table=chain["table"],
                name=chain["name"],
                handle=chain["handle"],
                hook=chain.get("hook"),
                type=chain.get("type"),
                priority=chain.get("prio"),
                policy=chain.get("policy"),
            )
        )

    return chains


def add_chain(chain):
    try:
        data_structure = util.nft_handle_parser({"chain": chain}, "add")
        ret = load_nft(data_structure)
        return ret
    except Exception as e:
        print("Error: could not add chain to nft.", e)
        return False


def delete_chain(chain):
    try:
        data_structure = util.nft_handle_parser({"chain": chain}, "delete")
        ret = load_nft(data_structure)
        return ret
    except Exception as e:
        print("Error: could not delete chain to nft.", e)
        return False


def get_table(data):
    data_structure = read_nft("list tables")
    for object in data_structure["nftables"]:
        table = object.get("table")
        if not table:
            continue
        if table["family"] == data["family"] and table["name"] == data["name"]:
            return table
    return None


def get_chain(data):
    data_structure = read_nft("list chains")
    for object in data_structure["nftables"]:
        chain = object.get("chain")
        if not chain:
            continue
        if chain["family"] == data["family"] and \
                chain["name"] == data["name"] and \
                chain["table"] == data["table"]:
            return chain
    return None


def get_ruleset(type='filter', cmd='list ruleset'):
    data_structure = read_nft(cmd)
    rules = []
    action = []
    if type == 'filter':
        action = ['accept', 'drop']
    elif type == 'nat':
        action = ["snat", "dnat", "masquerade", "redirect"]

    for object in data_structure["nftables"]:
        rule = object.get("rule")
        if not rule:
            continue

        if not check_rule_type(rule, type):
            continue

        raw_chain = get_chain(
            dict(family=rule["family"], table=rule["table"], name=rule["chain"]))

        print('kakaka', rule)

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
                protocol=util.get_expr_prot(rule.get("expr")),
                policy=util.get_expr_policy(
                    rule.get("expr"), action, default_policy=raw_chain["policy"]),
            )
        )

    return rules


def get_nat_rules(type='nat'):
    data_structure = read_nft("list ruleset")
    rules = []
    nat_action = ["snat", "dnat", "masquerade", "redirect"]
    for object in data_structure["nftables"]:
        rule = object.get("rule")
        if not rule:
            continue

        if not check_rule_type(rule, type):
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
                protocol=util.get_expr_prot(rule.get("expr")),
                policy=util.get_expr_policy(
                    rule.get("expr"), nat_action),
            )
        )

    print(rules)
    return rules


def check_rule_type(rule, type):
    data_structure = read_nft("list chains")
    for object in data_structure["nftables"]:
        chain = object.get('chain')
        if not chain:
            continue
        if chain["family"] == rule["family"] and \
                chain["table"] == rule["table"] and \
                chain["name"] == rule["chain"]:
            print(chain)
            if chain["type"] == type:
                return True
            return False
    return False


def add_rule(rule, type):
    try:
        if type == 'filter':
            rule_formatter = util.filter_rule_formatter(rule)
        elif type == 'nat':
            rule_formatter = util.filter_rule_formatter(rule)
        data_structure = util.nft_handle_parser(
            rule_formatter,
            "add",
        )
        ret = load_nft(data_structure)
        return ret
    except Exception as e:
        print("Error: could not add rule to nft.", e)
        return False


def delete_rule(rule):
    try:
        data_structure = util.nft_handle_parser(
            {
                "rule": rule
            },
            "delete",
        )
        ret = load_nft(data_structure)
        return ret
    except Exception as e:
        print("Error: could not delete rule to nft.", e)
        return False
