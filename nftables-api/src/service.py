from flask import Blueprint, jsonify, request
from src.database import Table, session
from src.util import *


main_api = Blueprint('api', __name__)


@main_api.route('/tables')
def get_all_tables():
    print(session.query(Table).all())
    tables = parse_to_json(session.query(Table).all())
    return jsonify({'tables': tables}), 200


@main_api.route('/tables', methods=['POST'])
def add_table():

    try:
        payload = request.get_json()
        table_name = payload['table']

        dup = session.query(Table).filter(Table.name == table_name).one()
        print(dup)
        if dup:
            return jsonify({'message': 'name of table be duplicated'}), 403

        new_table = Table(name=table_name)
        session.add(new_table)
        session.commit()
        return jsonify({'message': 'success'}), 200

    except:

        return jsonify({'error': 'server error'}), 500
