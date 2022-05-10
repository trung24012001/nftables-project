from flask import Blueprint, jsonify, request
import src.service.http_controller as http
import json

main_api = Blueprint("api", __name__)


@main_api.route("/anomaly")
def get_anomaly():
    try:
        anomaly = http.get_anomaly_http()
        return jsonify({"anomaly": anomaly}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "could not get anomaly"}), 500


@main_api.route("/tables")
def get_tables():
    try:
        tables = http.get_tables_db()
        return jsonify({"tables": tables}), 200
    except:
        return jsonify({"error": "could not get tables"}), 500


@main_api.route("/tables", methods=["POST"])
def add_table():
    try:
        payload = request.get_json()
        table = dict(family=payload["family"], name=payload["name"])
        if not http.add_table_db(table):
            return jsonify({"error": "could not add table"}), 400
        return jsonify({"message": "successfully"}), 200
    except Exception as e:
        print("Could not ad table. ", e)
        return jsonify({"error": "could not add table"}), 500


@main_api.route("/tables", methods=["DELETE"])
def delete_table():
    try:
        table = json.loads(request.args.get('table'))
        if not http.delete_table_db(table):
            return jsonify({"error": "could not delete table"}), 500
        return jsonify({"message": "success"}), 200
    except:
        return jsonify({"error": "could not delete table"}), 500


@main_api.route("/chains")
def get_chains():
    try:
        table = request.args.get('table')
        if table:
            table = json.loads(table)
        chains = http.get_chains_http(table)
        return jsonify({"chains": chains}), 200
    except Exception as e:
        print('Could not get chains.', e)
        return jsonify({"error": "could not get chains"}), 500


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
        is_added = http.add_chain_http(chain)
        if not is_added:
            return jsonify({"error": "could not add chain"}), 400
        return jsonify({"message": "successfully"}), 200
    except Exception as e:
        print("Could not add chain. ", e)
        return jsonify({"error": "could not add chain"}), 500


@main_api.route("/chains", methods=["DELETE"])
def delete_chain():
    try:
        chain = json.loads(request.args.get('chain'))
        if not http.delete_chain_db(chain):
            return jsonify({"error": "could not delete chain"}), 400
        return jsonify({"message": "successfully"}), 200

    except Exception as e:
        print("Could not delete chain. ", e)
        return jsonify({"error": "could not delete chain"}), 500


@main_api.route("/rules")
def get_ruleset():
    try:
        chain = request.args.get('chain')
        if chain:
            chain = json.loads(chain)
        ruleset = http.get_ruleset_http(
            type=request.args.get("type"), chain=chain)
        return jsonify({"ruleset": ruleset}), 200
    except Exception as e:

        print(e)
        return jsonify({"error": "could not get rules"}), 500


@main_api.route("/rules", methods=["POST"])
def add_rule():
    try:
        payload = request.get_json()
        is_added = http.add_rule_http(
            rule=payload, type=request.args.get("type"))
        if not is_added:
            return jsonify({"error": "could not add rule"}), 400
        return jsonify({"message": "successfully"}), 200
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
        if not http.delete_rule_db(rule):
            return jsonify({"error": "could not delete rule"}), 400
        return jsonify({"message": "Delete successfully"}), 200
    except Exception as e:
        print("Could not delete rule. ", e)
        return jsonify({"error": "could not delete rule"}), 500
