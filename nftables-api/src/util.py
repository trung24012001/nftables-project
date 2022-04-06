import json
from database import AlchemyEncoder


def query_data_to_str(data):
    return json.dumps(data, cls=AlchemyEncoder)


def nft_add_parser(data):
    return json.dumps(dict(nftables=[dict(add=dict(data))]))


def nft_delete_parser(data):
    return dict(nftables=[dict(delete=dict(data))])


def nft_replace_parser(data):
    return dict(nftables=[dict(replace=dict(data))])


def nft_flush_parser(data):
    return dict(nftables=[dict(flush=dict(data))])


def nft_expr_parser(data):
    if data["value"] is None:
        return ""
    return (
        dict(
            match=dict(
                op="==",
                left=dict(payload=data["payload"]),
                right=data["value"],
            )
        ),
    )


def get_match_key(expr, key):
    for match in expr:
        match = expr.get("match")
        if not match:
            continue
        m_key = match.get("left").get("payload").get("field").get("field")
        if m_key == key:
            return match.get("right")

    return ""
