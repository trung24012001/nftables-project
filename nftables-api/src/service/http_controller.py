from sqlalchemy import table
from src.schema.database import IpDst, IpSrc, PortSrc, PortDst, Protocol, Table, Chain, Rule, session
import src.nftables.nft_controller as nft
import src.lib.util as util


def get_anomaly_db():
    ruleset = nft.get_ruleset(type="filter")
    result = []
    is_clear = clear_database()
    if not is_clear:
        return []
    for rule in ruleset:
        print('xxxxxx', rule)
        result.append(util.parse_query(insert_db(rule)))
    # detect_anomaly()
    return result


def detect_anomaly():
    sql = 'select  src.host as ip_src, dst.host as ip_dst, psrc.port as port_src, pdst.port as port_dst, prot.protocol as protocol, count(*) as anomaly from rules r join ip_src src on r.id = src.rule_id join ip_dst dst on r.id = dst.rule_id join port_src psrc on r.id = psrc.rule_id join port_dst pdst on r.id = pdst.rule_id join protocols prot on prot.rule_id = r.id  group by src.host, dst.host, psrc.port, pdst.port, prot.protocol;'


def insert_db(rule):
    try:
        table = nft.get_table(dict(
            family=rule['family'], name=rule['table']))
        table_db = insert_table(table)
        chain = nft.get_chain(dict(
            family=rule['family'],
            table=rule['table'],
            name=rule['chain']
        ))
        chain_db = insert_chain(chain, table_db)
        rule_db = insert_rule(rule, chain_db, table_db)
        return rule_db
    except Exception as e:
        print(e)
        return None


def insert_table(table):
    try:
        table_db = session.query(Table).filter_by(
            family=table["family"], name=table["name"]).first()
        if not table_db:
            table_db = Table(family=table["family"],
                             name=table["name"], handle=table["handle"])
        session.add(table_db)
        session.commit()
        return table_db
    except Exception as e:
        print(e)
        session.rollback()
        return None


def insert_chain(chain, table_db):
    try:
        chain_db = session.query(Chain).filter(
            Chain.name.like(chain["name"]),
            Chain.table.has(family=chain["family"], name=chain["table"]),
        ).first()

        if not chain_db:
            chain_db = Chain(
                name=chain["name"],
                type=chain["type"],
                hook=chain["hook"],
                handle=chain['handle'],
                priority=chain.get("prio"),
                policy=chain.get("policy"),
                table=table_db,
            )
        session.add(chain_db)
        session.commit()
        return chain_db
    except Exception as e:
        print(e)
        session.rollback()
        return None


def insert_rule(rule, chain_db, table_db):
    try:
        rule_db = session.query(Rule).filter(
            Rule.chain.has(
                name=rule["chain"]),
            Rule.handle.like(rule["handle"]),
            Chain.table.has(
                family=rule['family'],
                name=rule['table']
            )
        ).first()
        if not rule_db:
            rule_db = Rule(
                policy=rule.get("policy"),
                handle=rule["handle"]
            )
            for new_ip_src in util.decompose_ip(rule.get("ip_src")):
                ip_src = IpSrc(
                    host=new_ip_src
                )
                rule_db.ip_src_list.append(ip_src)
            for new_ip_dst in util.decompose_ip(rule.get("ip_dst")):
                ip_dst = IpDst(
                    host=new_ip_dst
                )
                rule_db.ip_dst_list.append(ip_dst)
            for new_port_src in util.decompose_port(rule.get("port_src")):
                posr_src = PortSrc(
                    port=new_port_src,
                )
                rule_db.port_src_list.append(posr_src)

            for new_port_dst in util.decompose_port(rule.get("port_dst")):
                port_dst = PortDst(
                    port=new_port_dst,
                )
                rule_db.port_dst_list.append(port_dst)
            for new_prot in util.decompose_port(rule.get("protocol")):
                prot = Protocol(
                    protocol=new_prot,
                )
                rule_db.protocols.append(prot)
        chain_db.rules.append(rule_db)
        table_db.chains.append(chain_db)
        session.add(table_db)
        session.commit()
        return rule_db
    except Exception as e:
        print(e)
        session.rollback()
        return None


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
    rules = nft.get_ruleset(type)
    return rules


def add_rule_controller(rule, type):
    try:
        is_added = nft.add_rule(rule, type)
        if not is_added:
            raise Exception("Could not add rule to nft")
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
        session.query(Table).delete()
        session.commit()
        return True
    except Exception as e:
        print(e)
        session.rollback()
        return False
