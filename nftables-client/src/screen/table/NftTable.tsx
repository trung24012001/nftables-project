import { Box } from "@mui/material";
import { ReactTable } from "components/ReactTable";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";
import { getTables } from "store/reducers";

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

export function NftTable(): React.ReactElement {
  const tables = useSelector((state: RootState) => state.ruleset.tables);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getTables({}));
  }, []);

  const handleAdd = () => {
    console.log("hello");
    navigate("/tables/add");
  };

  return (
    <Box>
      <ReactTable headers={headers} rows={tables} handleActionAdd={handleAdd} />
    </Box>
  );
}
