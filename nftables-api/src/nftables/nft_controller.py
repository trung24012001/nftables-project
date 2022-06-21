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


def get_chains(table):
    cmd = "list chains"
    if table:
        cmd = "list table {family} {name}".format(
            family=table.get('family'), name=table.get('name'))
    data_structure = read_nft(cmd)
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


def get_table(table):
    data_structure = read_nft("list tables")
    for object in data_structure["nftables"]:
        raw_table = object.get("table")
        if not raw_table:
            continue
        if raw_table["family"] == table["family"] and raw_table["name"] == table["name"]:
            return raw_table
    return None


def get_chain(chain):
    data_structure = read_nft("list chains")
    for object in data_structure["nftables"]:
        raw_chain = object.get("chain")
        if not raw_chain:
            continue
        if raw_chain["family"] == chain["family"] and \
                raw_chain["name"] == chain["name"] and \
                raw_chain["table"] == chain["table"]:
            return raw_chain
    return None


def get_ruleset(rule_type, chain=None):
    cmd = 'list ruleset'
    if chain:
        cmd = "list chain {family} {table} {name}".format(family=chain.get(
            'family'), table=chain.get('table'), name=chain.get('name'))
    data_structure = read_nft(cmd)
    rules = []
    for object in data_structure["nftables"]:
        rule = object.get("rule")
        if not rule:
            continue
        if not check_rule_type(rule, rule_type):
            continue
        raw_chain = get_chain(
            dict(family=rule["family"], table=rule["table"], name=rule["chain"]))

        expr = rule.get("expr")
        network = util.get_expr_value(expr, keys=[
            'saddr', 'daddr', 'sport', 'dport'])
        interface = util.get_expr_interface(expr, keys=["iifname", "oifname"])

        rules.append(
            dict(
                family=rule["family"],
                table=rule["table"],
                chain=rule["chain"],
                handle=rule["handle"],
                hook=raw_chain['hook'],
                ip_src=network.get('saddr') or ["*"],
                ip_dst=network.get('daddr') or ["*"],
                port_src=network.get('sport') or ["*"],
                port_dst=network.get('dport') or ["*"],
                protocol=util.get_expr_prot(expr) or ["*"],
                policy=util.get_expr_policy(expr) or raw_chain.get("policy"),
                iif=interface.get("iifname") or ["*"],
                oif=interface.get("oifname") or ["*"],
                to=util.get_expr_nat(expr)
            )
        )

    def get_handle(rule):
        return rule.get("handle")
    rules.sort(key=get_handle)
    return rules


def check_rule_type(rule, rule_type):
    data_structure = read_nft("list chains")
    for object in data_structure["nftables"]:
        chain = object.get('chain')
        if not chain:
            continue
        if chain["family"] == rule["family"] and \
                chain["table"] == rule["table"] and \
                chain["name"] == rule["chain"]:
            chain_type = chain.get("type")
            if chain_type == rule_type:
                return True
            elif chain_type == None and rule_type == "return":
                return True
            return False
    return False


def add_rule(rule, type):
    try:
        if type == 'filter':
            rule_formatter = util.filter_rule_formatter(rule)
        elif type == 'nat':
            rule_formatter = util.nat_rule_formatter(rule)
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
