from nft_controller import get_chains, get_tables
from http_controller import add_table_db, add_chain_db


def sync_table():
    try:
        tables = get_tables()
        for table in tables:
            add_table_db(table)
        return True
    except:
        print("Error: sync table be interrupted")
        return False


def sync_chain():
    try:
        chains = get_chains()
        for chain in chains:
            add_chain_db(chain)

        return True
    except:
        print("Error: sync chain be interrupted")
        return False


def sync_rule():
    try:
        tables = get_tables()
        for table in tables:
            add_table_db(table)

        return True
    except:
        print("Error: sync rule be interrupted")
        return False
