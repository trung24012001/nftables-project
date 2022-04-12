import { Box } from "@mui/material";
import { ReactTable } from "components/ReactTable";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { getChains } from "store/reducers/ruleset.reducer";

const headers = [
  {
    name: "Family",
    access: "family",
  },
  {
    name: "Table",
    access: "table",
  },
  {
    name: "Name",
    access: "name",
  },
  {
    name: "Type",
    access: "type",
  },
  {
    name: "Hook",
    access: "hook",
  },
  {
    name: "Handle",
    access: "handle",
  },
];

const rows = [
  {
    family: "ip",
    table: "filter",
    name: "output",
    type: "filter",
    hook: "output",
    priority: 1,
  },
  {
    family: "ip6",
    table: "filter",
    name: "output",
    type: "filter",
    hook: "output",
    priority: 2,
  },
  {
    family: "inet",
    table: "filter",
    name: "output",
    type: "filter",
    hook: "output",
    priority: 3,
  },
];

export function ChainTable(): React.ReactElement {
  const chains = useSelector((state: RootState) => state.ruleset.chains);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getChains({}));
  }, []);
  return (
    <Box>
      <ReactTable headers={headers} rows={chains} />
    </Box>
  );
}
