from flask import Blueprint, jsonify, request
from sync import sync_table, sync_chain, sync_rule
from http_controller import (
    add_table_db,
    add_chain_db,
    clear_database,
    get_tables_db,
    get_ruleset,
    add_rule_db,
    http_test,
)

main_api = Blueprint("api", __name__)


@main_api.route("/test")
def test():
    try:
        http_test()

        return jsonify({"message": "hello"}), 200
    except:
        return jsonify({"error": "error"}), 500


@main_api.route("/sync-to-db")
def sync_database():
    try:
        clear_database()
        sync_table()
        sync_chain()
        # sync_rule()

        return jsonify({"message": "sync successfully"}), 200
    except:
        return jsonify({"error": "sync interrupted"}), 500


@main_api.route("/sync-to-nft")
def sync_nft():
    try:
        clear_database()
        sync_table()
        sync_chain()
        # sync_rule()

        return jsonify({"message": "sync successfully"}), 200
    except:
        return jsonify({"error": "sync interrupted"}), 500


@main_api.route("/tables")
def get_tables():
    tables = get_tables_db()
    return jsonify({"tables": tables}), 200


@main_api.route("/tables", methods=["POST"])
def add_table():
    try:
        payload = request.get_json()
        table = dict(family=payload["family"], name=payload["name"])

        add_table_db(table)

        return jsonify({"message": "success"}), 200

    except:

        return jsonify({"error": "could not add table"}), 500


@main_api.route("/chains", methods=["POST"])
def add_chain():
    try:
        payload = request.get_json()
        chain = dict(
            table=payload["table"],
            name=payload["name"],
            type=payload.get("type"),
            hook=payload.get("hook"),
            priority=payload.get("priority"),
            policy=payload.get("policy"),
        )

        add_chain_db(chain)

        return jsonify({"message": "success"}), 200

    except:

        return jsonify({"error": "could not add chain"}), 500


@main_api.route("/rules")
def get_all_ruleset():
    try:
        ruleset = get_ruleset()

        return jsonify({"ruleset": ruleset}), 200

    except:
        return jsonify({"error": "could not add chain"}), 500


@main_api.route("/rules", methods=["POST"])
def add_rule():
    try:
        payload = request.get_json()
        rule = dict(
            table=payload["table"],
            chain=payload["chain"],
            ip_src=payload.get("ip_src"),
            port_src=payload.get("port_src"),
            ip_dst=payload.get("ip_dst"),
            port_dst=payload.get("port_dst"),
            policy=payload.get("policy"),
            protocol=payload.get("protocol"),
        )

        add_rule_db(rule)

        return jsonify({"message": "success"}), 200

    except:

        return jsonify({"error": "could not add chain"}), 500
