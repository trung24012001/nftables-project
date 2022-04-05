from database import IpDst, IpSrc, Table, Chain, Rule, session
import nft_controller as nft
import util


def get_tables_db():
    query = session.query(Table).all()
    tables = util.query_data_to_str(query)
    return tables


def add_table_db(table):
    try:
        # check = nft.add_table(table)
        # if not check:
        #     print("errrrrrrrrrrr")
        #     raise

        new_table = Table(family=table["family"], name=table["name"])
        print(new_table)
        session.add(new_table)
        session.commit()

        return True
    except Exception as e:
        session.rollback()
        print(f"Error: could not add table to db")
        return False


def add_chain_db(chain):
    try:
        # check = nft.add_chain(chain)
        # if not check:
        #     raise

        table = session.query(Table).filter(Table.name == chain["table"]).one()
        new_chain = Chain(
            name=chain["name"],
            handle=chain["handle"],
            type=chain.get("type"),
            hook=chain.get("hook"),
            priority=chain.get("priority"),
            policy=chain.get("policy"),
            table=table,
        )

        session.add(new_chain)
        session.commit()

        return True
    except Exception as e:
        print("Error: could not add chain to db")
        session.rollback()
        return False


def add_rule_db(rule):
    try:
        # check = nft.add_filter_rule(rule)

        # if not check:
        #     raise

        chain = (
            session.query(Chain)
            .filter(
                Chain.name.like(rule["chain"]), Chain.table.name.like(rule["table"])
            )
            .one()
        )

        new_rule = Rule(
            chain=chain,
            protocol=rule.get("protocol"),
            policy=rule.get("policy"),
        )

        ip_src = IpSrc(
            host=rule.get("ip_src"), port=rule.get("port_src"), rule=new_rule
        )

        ip_dst = IpDst(
            host=rule.get("ip_dst"), port=rule.get("port_dst"), rule=new_rule
        )

        new_rule.ip_src_list.append(ip_src)

        new_rule.ip_dst_list.append(ip_dst)

        chain.rules.append(new_rule)

        session.add(chain)
        session.commit()

        return True
    except:
        print("Error: could not add rule to db")
        return False


def clear_database():
    try:
        tables = session.query(Table).delete()
        session.commit()
        print(tables)
        return True
    except:
        session.rollback()
        return False


def get_ruleset():
    try:
        # new_rule = Rule(family="ok")
        # session.add(new_rule)
        # session.commit()

        return True
    except:
        return []


def http_test():

    return ""
