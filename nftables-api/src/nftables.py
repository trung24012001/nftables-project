import nftables
import json


def get_rule():
    nft = nftables.Nftables()
    # configure library behavior
    nft.set_json_output(True)
    nft.set_stateless_output(False)
    nft.set_service_output(False)
    nft.set_reversedns_output(False)
    nft.set_numeric_proto_output(True)

    rc, output, error = nft.cmd("list ruleset")
    if rc != 0:
        # do proper error handling here, exceptions etc
        print("ERROR: running cmd 'list ruleset'")
        print(error)
        return

    if len(output) == 0:
        # more error control
        print("ERROR: no output from libnftables")
        return

    print("raw libnftables JSON output:\n{}".format(output))
    data_structure = json.loads(output)
    print("native python data structure:\n{}".format(data_structure))

    return data_structure


def add_rule(rule):
    nft = nftables.Nftables()

    # STEP 1: load your JSON content
    try:
        data_structure = get_rule()
        data_structure.append(rule)
    except json.decoder.JSONDecodeError as e:
        print(f"ERROR: failed to decode JSON: {e}")
        exit(1)

    # STEP 2: validate it with the libnftables JSON schema
    try:
        nft.json_validate(data_structure)
    except Exception as e:
        print(f"ERROR: failed validating json schema: {e}")
        exit(1)

    # STEP 3: finally, run the JSON command
    print(f"INFO: running json cmd: {data_structure}")
    rc, output, error = nft.json_cmd(data_structure)
    if rc != 0:
        # do proper error handling here, exceptions etc
        print(f"ERROR: running json cmd: {error}")
        exit(1)

    if len(output) != 0:
        # more error control?
        print(f"WARNING: output: {output}")
    return ''


def delete_rule():

    return ''
