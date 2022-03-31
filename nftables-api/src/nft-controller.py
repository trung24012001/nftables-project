from pymysql import NULL
from nft import *


def get_tables():
    data_structure = log_nft("list tables")
    nft_raw_data = data_structure["nftables"]
    tables = []
    for object in nft_raw_data:
        table = object.get("table")
        if not table:
            continue
        tables.append(
            dict(family=table["family"], name=table["name"], handle=table["handle"])
        )

    return tables


def get_chains():
    data_structure = log_nft("list chains")
    nft_raw_data = data_structure["nftables"]
    chains = []
    print(nft_raw_data)
    for object in nft_raw_data:
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


def get_chains_table(table=""):
    data_structure = log_nft("list chains")
    nft_raw_data = data_structure["nftables"]
    chains = []

    for object in nft_raw_data:
        chain = object.get("chain")
        if not chain:
            continue
        if table != chain.get("table"):
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

    print(chains)

    return chains


def add_table(family="", name=""):
    print(family)
    data_structure = dict(nftables=[dict(add=dict(family=family, name=name))])
    print(data_structure)
    ret = load_nft(data_structure)

    return ret


# get_chains_table("kaka_mytab")
add_table(family="inet", name="test")
