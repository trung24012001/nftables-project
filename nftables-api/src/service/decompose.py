from src.schema.database import IpDst, IpSrc, PortSrc, PortDst, Protocol, Table, Chain, Rule, session
import src.nftables.nft_controller as nft
import src.lib.util as util


def decompose(ruleset):
    fields = [{'name': 'ip_src', 'type': 'ip'}, {'name': 'ip_dst', 'type': 'ip'},
              {'name': 'port_src', 'type': 'port'}, {
                  'name': 'port_dst', 'type': 'port'},
              {'name': 'protocols', 'type': None}]
    for rule in ruleset:
        for field in fields:
            rule[field['name']] = util.decompose_data(
                rule.get(field), type=field['type'])

    return True


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
            for new_ip_src in util.decompose_data(rule.get("ip_src"), type='ip'):
                ip_src = IpSrc(
                    host=new_ip_src
                )
                rule_db.ip_src_list.append(ip_src)
            for new_ip_dst in util.decompose_data(rule.get("ip_dst"), type='ip'):
                ip_dst = IpDst(
                    host=new_ip_dst
                )
                rule_db.ip_dst_list.append(ip_dst)
            for new_port_src in util.decompose_data(rule.get("port_src"), type='port'):
                posr_src = PortSrc(
                    port=new_port_src,
                )
                rule_db.port_src_list.append(posr_src)

            for new_port_dst in util.decompose_data(rule.get("port_dst"), type='port'):
                port_dst = PortDst(
                    port=new_port_dst,
                )
                rule_db.port_dst_list.append(port_dst)
            for new_prot in util.decompose_data(rule.get("protocol")):
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
