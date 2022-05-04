from flask import Blueprint, jsonify, request
from src.lib.sync import sync_nft_to_db, sync_db_to_nft
from src.service.http_controller import (
    add_table_db,
    add_chain_db,
    delete_table_db,
    delete_chain_db,
    get_chains_db,
    get_ruleset_db,
    get_tables_db,
    add_rule_db,
    delete_rule_db,
    get_anomaly_db
)
import json

main_api = Blueprint("api", __name__)


@main_api.route("/anomaly")
def get_anomaly():
    try:
        anomaly = get_anomaly_db()
        return jsonify({"anomaly": anomaly}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "could not get anomaly"}), 500


@main_api.route("/tables")
def get_tables():
    try:
        tables = get_tables_db()
        return jsonify({"tables": tables}), 200
    except:
        return jsonify({"error": "could not get tables"}), 500


@main_api.route("/tables", methods=["POST"])
def add_table():
    try:
        payload = request.get_json()
        table = dict(family=payload["family"], name=payload["name"])
        if not add_table_db(table):
            return jsonify({"error": "could not add table"}), 400
        return jsonify({"message": "success"}), 200
    except Exception as e:
        print("Could not ad table. ", e)
        return jsonify({"error": "could not add table"}), 500


@main_api.route("/tables", methods=["DELETE"])
def delete_table():
    try:
        table = json.loads(request.args.get('table'))
        if not delete_table_db(table):
            return jsonify({"error": "could not delete table"}), 500
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
            family=payload["table"].get("family"),
            table=payload["table"].get("name"),
            name=payload["name"],
            type=payload.get("type"),
            hook=payload.get("hook"),
            prio=payload.get("priority"),
            policy=payload.get("policy"),
        )
        is_added = add_chain_db(chain)
        if not is_added:
            return jsonify({"error": "could not add chain"}), 400
        return jsonify({"message": "success"}), 200
    except Exception as e:
        print("Could not add chain. ", e)
        return jsonify({"error": "could not add chain"}), 500


@main_api.route("/chains", methods=["DELETE"])
def delete_chain():
    try:
        chain = json.loads(request.args.get('chain'))
        if not delete_chain_db(chain):
            return jsonify({"error": "could not delete chain"}), 400
        return jsonify({"message": "success"}), 200

    except Exception as e:
        print("Could not delete chain. ", e)
        return jsonify({"error": "could not delete chain"}), 500


@main_api.route("/rules")
def get_all_ruleset():
    try:
        ruleset = get_ruleset_db(request.args.get("type"))
        return jsonify({"ruleset": ruleset}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "could not get rules"}), 500


@main_api.route("/rules", methods=["POST"])
def add_rule():
    try:
        payload = request.get_json()
        rule = dict(
            chain=payload["chain"],
            ip_src=payload.get("ip_src"),
            ip_dst=payload.get("ip_dst"),
            port_src=payload.get("port_src"),
            port_dst=payload.get("port_dst"),
            port_prot=payload.get("port_prot"),
            protocol=payload.get("protocol"),
            policy=payload.get("action"),
        )
        is_added = add_rule_db(rule)
        if not is_added:
            return jsonify({"error": "could not add rule"}), 400
        return jsonify({"message": "success"}), 200
    except:
        return jsonify({"error": "could not add rule"}), 500


@main_api.route("/rules", methods=["DELETE"])
def delete_rule():
    try:
        query_rule = json.loads(request.args.get("rule"))
        rule = dict(
            family=query_rule.get('family'),
            table=query_rule.get("table"),
            chain=query_rule.get('chain'),
            handle=query_rule.get("handle")
        )
        print(rule)
        if not delete_rule_db(rule):
            return jsonify({"error": "could not delete rule"}), 400
        return jsonify({"message": "Delete successfully"}), 200
    except Exception as e:
        print("Could not delete rule. ", e)
        return jsonify({"error": "could not delete rule"}), 500
