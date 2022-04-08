import json
from src.schema.database import AlchemyEncoder


def query_to_str(data):
    return json.dumps(data, cls=AlchemyEncoder)


def nft_handle_parser(data, handle):
    return {"nftables": [{handle: data}]}


def nft_expr_parser(data):
    if data["value"] is None:
        return ""
    return {
        "match": {
            "op": "==",
            "left": {"payload": data["payload"]},
            "right": data["value"],
        }
    }


def get_expr_value(expr, key):
    for object in expr:
        match = object.get("match")
        if not match:
            continue
        m_key = match.get("left").get("payload").get("field")
        if m_key == key:
            return match.get("right")

    return None
