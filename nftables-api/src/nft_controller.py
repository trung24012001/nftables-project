from nft import load_nft, log_nft
import util


def get_tables():
    data_structure = log_nft("list tables")
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
    data_structure = util.nft_add_parser(table=table)
    ret = load_nft(data_structure)

    return ret


def delete_table(table):
    data_structure = util.nft_delete_parser(table=table)
    ret = load_nft(data_structure)

    return ret


def get_chains():
    data_structure = log_nft("list chains")
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
    data_structure = log_nft("list chains")
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
    data_structure = util.nft_add_parser(chain)
    print(data_structure)
    ret = load_nft(data_structure)

    return ret


def delete_chain(name, table):
    data_structure = util.nft_delete_parser(
        table=dict(
            table=table,
            name=name,
        )
    )
    ret = load_nft(data_structure)

    return ret


def get_rules():
    data_structure = log_nft("list ruleset")

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
            )
        )

    return rules


def add_filter_rule(rule):
    # policy = {}
    # policy[rule["policy"]] = None

    ip_src_match = dict(
        payload=dict(protocol=rule["protocol"], field="saddr"),
        value=rule["ip_src"],
    )

    port_src_match = dict(
        payload=dict(protocol=rule["protocol"], field="sport"),
        value=rule["port_src"],
    )

    ip_dst_match = dict(
        payload=dict(protocol=rule["protocol"], field="daddr"),
        value=rule["ip_dst"],
    )

    port_dst_match = dict(
        payload=dict(protocol=rule["protocol"], field="dport"),
        value=rule["port_dst"],
    )

    data_structure = util.nft_add_parser(
        rule=dict(
            family=rule["family"],
            table=rule["table"],
            chain=rule["chain"],
            expr=[
                util.nft_expr_parser(ip_src_match),
                {rule["policy"]: None},
            ],
        )
    )
    ret = load_nft(data_structure)

    return ret


# def flush_ruleset():
#     data_structure = util.nft_flush_parser(ruleset=None)
#     ret = load_nft(data_structure)

#     return ret