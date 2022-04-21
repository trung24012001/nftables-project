import { Box } from "@mui/material";
import { ReactTable } from "components/ReactTable";
import { request } from "lib";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getChains({}));
  }, []);
  const handleAdd = () => {
    navigate("/chains/add");
  };

  const handleDelete = async () => {
    try {
      const res = await request.delete("/chains");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <ReactTable
        headers={headers}
        rows={chains}
        handleActionAdd={handleAdd}
        handleActionDelete={handleDelete}
      />
    </Box>
  );
}
