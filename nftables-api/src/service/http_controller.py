from src.schema.database import Table, session
import src.nftables.nft_controller as nft
import src.service.decompose as decompose
import src.service.detect_anomaly as detect


def get_anomaly_http():
    ruleset = nft.get_ruleset(rule_type="filter")
    is_clear = clear_database()
    if not is_clear:
        return []
    for rule in ruleset:
        decompose.insert_db(rule)
    result = detect.detect_anomaly()
    return result


def get_tables_http():
    tables = nft.get_tables()
    return tables


def add_table_http(table):
    try:
        is_added = nft.add_table(table)
        if not is_added:
            raise Exception("Could not add table to nft")
        return True
    except Exception as e:
        print("Error: could not add table to db.", e)
        return False


def delete_table_http(table):
    try:
        is_deleted = nft.delete_table(table)
        if not is_deleted:
            raise Exception("Could not delete table from nft.")
        return True
    except Exception as e:
        print("Error: could not delete table from db.", e)
        return False


def add_chain_http(chain):
    try:
        is_added = nft.add_chain(chain)
        if not is_added:
            raise Exception("Could not add chain to nft")

        return True
    except Exception as e:
        print("Error: could not add chain to db.", e)
        return False


def get_chains_http(table):
    chains = nft.get_chains(table)
    return chains


def delete_chain_http(chain):
    try:
        is_deleted = nft.delete_chain(chain)
        if not is_deleted:
            raise Exception("Could not delete chain from nft.")
        return True
    except Exception as e:
        print("Error: could not delete chain from db.", e)
        return False


def get_ruleset_http(rule_type, chain):
    rules = nft.get_ruleset(rule_type, chain)
    return rules


def add_rule_http(rule, type):
    try:
        is_added = nft.add_rule(rule, type)
        if not is_added:
            raise Exception("Could not add rule to nft")
        return True
    except Exception as e:
        session.rollback()
        print("Error: could not add rule to db.", e)
        return False


def delete_rule_http(rule):
    try:
        if not nft.delete_rule(rule):
            raise Exception("Could not delete rule in nft")
        return True
    except Exception as e:
        print("Error: could not delete rule", e)
        return False


def clear_database():
    try:
        session.query(Table).delete()
        session.commit()
        return True
    except Exception as e:
        print(e)
        session.rollback()
        return False
