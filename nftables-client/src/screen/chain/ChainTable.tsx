import { Box } from "@mui/material";
import { ReactTable } from "components/ReactTable";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { getChains } from "store/reducers";

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
    name: "Priority",
    access: "priority",
  },
  {
    name: "Handle",
    access: "handle",
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
