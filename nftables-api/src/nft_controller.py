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
    policy = {}
    policy[rule["policy"]] = None

    data_structure = util.nft_add_parser(
        rule=dict(
            family=rule["family"],
            table=rule["table"],
            chain=rule["chain"],
            expr=[
                dict(
                    match=dict(
                        op="==",
                        left=dict(
                            payload=dict(protocol=rule["protocol"], field=rule["field"])
                        ),
                        right=rule["value"],
                    )
                ),
                policy,
            ],
        )
    )
    ret = load_nft(data_structure)

    return ret


# def flush_ruleset():
#     data_structure = util.nft_flush_parser(ruleset=None)
#     ret = load_nft(data_structure)

#     return ret
