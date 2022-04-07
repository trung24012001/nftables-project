from database import IpDst, IpSrc, Table, Chain, Rule, session
import nft_controller as nft
import util


def get_tables_db():
    query = session.query(Table).all()
    tables = util.query_data_to_str(query)
    return tables


def add_table_db(table):
    try:
        new_table = Table(family=table["family"], name=table["name"])
        session.add(new_table)
        session.flush()
        is_added = nft.add_table(table)
        if not is_added:
            raise Exception("Could not add table to nft")
        session.commit()

        return True
    except Exception as e:
        session.rollback()
        print("Error: could not add table to db.", e)
        return False


def add_chain_db(chain):
    try:
        table = (
            session.query(Table)
            .filter(
                Table.name.like(chain["table"]),
                Table.family.like(chain["family"]),
            )
            .one()
        )
        new_chain = Chain(
            name=chain["name"],
            type=chain["type"],
            hook=chain["hook"],
            priority=chain.get("priority"),
            policy=chain.get("policy"),
            table=table,
        )
        session.add(new_chain)
        session.flush()
        chain["prio"] = chain.pop("priority")
        is_added = nft.add_chain(chain)
        if not is_added:
            raise Exception("Could not add chain to nft")
        session.commit()

        return True
    except Exception as e:
        print("Error: could not add chain to db.", e)
        session.rollback()
        return False


def add_rule_db(rule):
    try:
        chain = (
            session.query(Chain)
            .filter(
                Chain.name.like(rule["chain"]),
                Chain.table.has(name=rule["table"], family=rule["family"]),
            )
            .first()
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
        session.flush()
        is_added = nft.add_filter_rule(rule)
        if not is_added:
            raise Exception("Could not add rule to nft")
        session.commit()

        return True
    except Exception as e:
        session.rollback()
        print("Error: could not add rule to db.", e)
        return False


add_rule_db(
    {
        "table": "hi",
        "family": "ip",
        "chain": "ok",
        "protocol": "tcp",
        "policy": "accept",
    }
)


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
    new_table = Table(family="ok")
    session.add(new_table)
    session.flush()
    session.rollback()
    return ""
