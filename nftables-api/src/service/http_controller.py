from src.schema.database import IpDst, IpSrc, Table, Chain, Rule, session
import src.nftables.nft_controller as nft
import src.lib.util as util


def get_tables_db():
    # query = session.query(Table).all()
    # tables = util.query_to_str(query)
    tables = nft.get_tables()
    return tables


def add_table_db(table):
    try:
        # new_table = Table(family=table["family"], name=table["name"])
        # session.add(new_table)
        # session.flush()
        is_added = nft.add_table(table)
        if not is_added:
            raise Exception("Could not add table to nft")
        # session.commit()

        return True
    except Exception as e:
        # session.rollback()
        print("Error: could not add table to db.", e)
        return False


def delete_table_db(table):
    try:
        # delete_table = session.query(Table).filter_by(
        #     family=table["family"], name=table["name"]).first()
        # session.delete(delete_table)
        # session.flush()
        is_deleted = nft.delete_table(table)
        if not is_deleted:
            raise Exception("Could not delete table from nft.")
        # session.commit()

        return True
    except Exception as e:
        # session.rollback()
        print("Error: could not delete table from db.", e)
        return False


def add_chain_db(chain):
    try:
        # table = (
        #     session.query(Table)
        #     .filter(
        #         Table.name.like(chain["table"].get("name")),
        #         Table.family.like(chain["table"].get("family")),
        #     )
        #     .first()
        # )
        # new_chain = Chain(
        #     name=chain["name"],
        #     type=chain["type"],
        #     hook=chain["hook"],
        #     priority=chain.get("priority"),
        #     policy=chain.get("policy"),
        #     table=table,
        # )
        # session.add(new_chain)
        # session.flush()
        is_added = nft.add_chain(chain)
        if not is_added:
            raise Exception("Could not add chain to nft")
        # session.commit()

        return True
    except Exception as e:
        print("Error: could not add chain to db.", e)
        # session.rollback()
        return False


def get_chains_db():
    # query = session.query(Chain).all()
    # chains = util.query_to_str(query)
    chains = nft.get_chains()
    return chains


def delete_chain_db(chain):
    try:
        # chain = Chain(family=chain["family"],
        #               table=chain["table"], name=chain["name"])
        # session.delete(chain)
        # session.flush()
        is_deleted = nft.delete_chain(chain)
        if not is_deleted:
            raise Exception("Could not delete chain from nft.")
        # session.commit()

        return True
    except Exception as e:
        # session.rollback()
        print("Error: could not delete chain from db.", e)
        return False


def get_ruleset_db(type):
    # query = session.query(Rule).all()
    # rules = util.query_to_str(query)
    print(type)
    rules = nft.get_ruleset(type)
    return rules


def add_rule_db(rule):
    try:
        # chain = (
        #     session.query(Chain)
        #     .filter(
        #         Chain.name.like(rule["chain"].get("name")),
        #         Chain.table.has(name=rule["chain"].get("table"),
        #                         family=rule["chain"].get("family")),
        #     )
        #     .first()
        # )

        # new_rule = Rule(
        #     protocol=rule.get("protocol"),
        #     policy=rule.get("policy"),
        # )

        # ip_src = IpSrc(
        #     host=rule.get("ip_src"), port=rule.get("port_src")
        # )

        # ip_dst = IpDst(
        #     host=rule.get("ip_dst"), port=rule.get("port_dst")
        # )

        # new_rule.ip_src_list.append(ip_src)
        # new_rule.ip_dst_list.append(ip_dst)
        # chain.rules.append(new_rule)
        # session.add(chain)
        # session.flush()
        is_added = nft.add_filter_rule(rule)
        if not is_added:
            raise Exception("Could not add rule to nft")

        # session.commit()
        return True
    except Exception as e:
        session.rollback()
        print("Error: could not add rule to db.", e)
        return False


def delete_rule_db(rule):
    try:
        if not nft.delete_rule(rule):
            raise Exception("Could not delete rule in nft")
        return True
    except Exception as e:
        print("Error: could not delete rule", e)
        return False


def clear_database():
    try:
        tables = session.query(Table).delete()
        session.commit()
        return True
    except:
        session.rollback()
        return False
