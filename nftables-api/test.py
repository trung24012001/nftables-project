from src.service.http_controller import *
from src.nftables.nft_controller import *


def test_add_table():
    return add_table_db({"family": "ip", "name": "ok"})


def test_delete_table():
    return delete_table_db({"family": "ip", "name": "ok"})


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
