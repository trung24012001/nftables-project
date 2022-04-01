from flask import Blueprint, jsonify, request
from sync import sync_table, sync_chain, sync_rule
from http_controller import add_table_db, add_chain_db, clear_database, get_tables_db

main_api = Blueprint("api", __name__)


@main_api.route("/sync")
def sync_database():
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
