import json
from database import AlchemyEncoder


def query_data_to_str(data):
    return json.dumps(data, cls=AlchemyEncoder)


def nft_add_parser(data):
    return dict(nftables=[dict(add=dict(data))])


def nft_delete_parser(data):
    return dict(nftables=[dict(delete=dict(data))])


def nft_replace_parser(data):
    return dict(nftables=[dict(replace=dict(data))])


def nft_flush_parser(data):
    return dict(nftables=[dict(flush=dict(data))])
