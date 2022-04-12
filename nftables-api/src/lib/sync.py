from src.nftables.nft_controller import get_chains, get_tables, get_ruleset
from src.service.http_controller import (
    add_table_db,
    add_chain_db,
    get_ruleset_db,
    add_rule_db,
    clear_database,
)


def sync_table_nft_db():
    try:
        tables = get_tables()
        for table in tables:
            add_table_db(table)
        return True
    except:
        print("Error: sync table be interrupted")
        return False


def sync_chain_nft_db():
    try:
        chains = get_chains()
        for chain in chains:
            add_chain_db(chain)

        return True
    except:
        print("Error: sync chain be interrupted")
        return False


def sync_rule_nft_db():
    try:
        rules = get_ruleset()
        for rule in rules:
            get_ruleset_db(rule)

        return True
    except:
        print("Error: sync rule be interrupted")
        return False


def sync_nft_to_db():
    clear_database()
    sync_table_nft_db()
    sync_chain_nft_db()
    sync_rule_nft_db()


def sync_db_to_nft():
    print()
