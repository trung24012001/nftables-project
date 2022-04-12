import { Box } from "@mui/material";
import { ReactTable } from "components/ReactTable";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { getTables } from "store/reducers/ruleset.reducer";

const headers = [
  {
    name: "Family",
    access: "family",
  },
  {
    name: "Name",
    access: "name",
  },
  {
    name: "Handle",
    access: "handle",
  },
];

export function FilterTable(): React.ReactElement {
  const tables = useSelector((state: RootState) => state.ruleset.tables);
  const dispatch = useDispatch();

  console.log(tables);

  useEffect(() => {
    dispatch(getTables({}));
  }, []);

  return (
    <Box>
      <ReactTable headers={headers} rows={tables} />
    </Box>
  );
}
