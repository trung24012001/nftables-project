from src.service.http_controller import *
from src.nftables.nft_controller import *


def test_add_table():
    return add_table_db({"family": "ip", "name": "ok"})


def test_delete_table():
    return delete_table_db({"family": "ip", "name": "ok"})


def test_add_rule_db():
    return add_rule_db(
        {
            "table": "hi",
            "family": "ip",
            "chain": "ok",
            "protocol": "tcp",
            "policy": "accept",
        }
    )


def test_add__filter_rule_nft():
    return add_filter_rule(
        {
            "family": "ip",
            "table": "filter",
            "chain": "output",
            "protocol": {"protocol": "ip", "value": "udp"},
            "port_dst": {"protocol": "udp", "value": "30"},
            "ip_dst": {"protocol": "ip", "value": "30"},
            "policy": "accept",
        }
    )


def test_get_ruleset():
    return get_ruleset_db()


def run_test():
    check = test_get_ruleset()
    print(check)
    if check:
        print("Test successfully.")
    else:
        print("Test fail.")


run_test()
