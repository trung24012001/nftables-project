from flask import Blueprint, jsonify, request
from src.lib.sync import sync_nft_to_db, sync_db_to_nft
from src.service.http_controller import (
    add_table_db,
    add_chain_db,
    delete_table_db,
    get_chains_db,
    get_ruleset_db,
    get_tables_db,
    add_rule_db,
    delete_rule_db
)
import json

main_api = Blueprint("api", __name__)


@main_api.route("/sync-to-db")
def sync_database():
    try:
        sync_nft_to_db()
        return jsonify({"message": "sync successfully"}), 200
    except:
        return jsonify({"error": "sync interrupted"}), 500


@main_api.route("/sync-to-nft")
def sync_nft():
    try:
        sync_db_to_nft()
        return jsonify({"message": "sync successfully"}), 200
    except:
        return jsonify({"error": "sync interrupted"}), 500


@main_api.route("/tables")
def get_tables():
    try:
        tables = get_tables_db()
        return jsonify({"tables": tables}), 200
    except:
        return jsonify({"error": "could not get tables"})


@main_api.route("/tables", methods=["POST"])
def add_table():
    try:
        payload = request.get_json()
        table = dict(family=payload["family"], name=payload["name"])
        add_table_db(table)
        return jsonify({"message": "success"}), 200
    except:
        return jsonify({"error": "could not add table"}), 500


@main_api.route("/tables", methods=["DELETE"])
def delete_table():
    try:
        table = dict(family=request.args.get('family'),
                     name=request.args.get('name'))
        delete_table_db(table)
        return jsonify({"message": "success"}), 200
    except:
        return jsonify({"error": "could not delete table"}), 500


@main_api.route("/chains")
def get_chains():
    try:
        chains = get_chains_db()
        return jsonify({"chains": chains}), 200
    except:
        return jsonify({"error": "could not get chains"})


@main_api.route("/chains", methods=["POST"])
def add_chain():
    try:
        payload = request.get_json()
        chain = dict(
            table=json.loads(payload["table"]),
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
        ruleset = get_ruleset_db()
        return jsonify({"ruleset": ruleset}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "could not get rules"}), 500


@main_api.route("/rules", methods=["POST"])
def add_rule():
    try:
        payload = request.get_json()
        rule = dict(
            chain=json.loads(payload["chain"]),
            ip_src=payload.get("ip_src"),
            ip_dst=payload.get("ip_dst"),
            port_src=payload.get("port_src"),
            port_dst=payload.get("port_dst"),
            port_prot=payload.get("port_prot"),
            protocol=payload.get("protocol"),
            policy=payload.get("policy"),
        )
        is_added = add_rule_db(rule)
        if not is_added:
            return jsonify({"message": "could not add rule"}), 400
        return jsonify({"message": "success"}), 200
    except:
        return jsonify({"error": "could not add rule"}), 500


@main_api.route("/rules", methods=["DELETE"])
def delete_rule():
    try:
        delete_rule_db()
        return jsonify({"message": "Delete successfully"}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "could not delete rule"}), 500
