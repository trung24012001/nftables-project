import json
from src.database import AlchemyEncoder


def parse_to_json(data):
    return json.dumps(data, cls=AlchemyEncoder)
