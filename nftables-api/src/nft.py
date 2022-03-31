import nftables
import json

nft = nftables.Nftables()
nft.set_json_output(True)
nft.set_handle_output(True)


def log_nft(cmd="list ruleset"):

    rc, output, error = nft.cmd(cmd)

    if rc != 0:
        print("ERROR: running cmd 'list ruleset'")
        print(error)
        return

    if len(output) == 0:
        print("ERROR: no output from libnftables")
        return

    data_structure = json.loads(output)
    # print("raw libnftables JSON output:\n{}".format(output))
    # print("native python data structure:\n{}".format(data_structure))

    return data_structure


NFTABLES_JSON = """
{ "nftables": [
    {"add": { "table": {
        "family": "inet",
        "name": "mytable"
    }}}
   
]}
"""


def load_nft(data_structure):

    # try:
    #     data_structure = json.loads(data)
    # except json.decoder.JSONDecodeError as e:
    #     print(f"ERROR: failed to decode JSON: {e}")
    #     return False

    # print(data_structure)

    try:
        nft.json_validate(data_structure)
    except Exception as e:
        print(f"ERROR: failed validating json schema: {e}")
        return False

    print(f"INFO: running json cmd: {data_structure}")

    rc, output, error = nft.json_cmd(data_structure)

    # print(output)

    if rc != 0:
        print(f"ERROR: running json cmd: {error}")
        return False

    if len(output) != 0:
        print(f"WARNING: output: {output}")

    return True


# get_nftables(cmd="list tables")
# load_nft(NFTABLES_JSON)
