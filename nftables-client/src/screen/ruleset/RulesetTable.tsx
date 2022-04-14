import { Box } from "@mui/material";
import { ReactTable } from "components/ReactTable";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";
import { getRuleset } from "store/reducers";

export function RulesetTable(): React.ReactElement {
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
      name: "Chain",
      access: "chain",
    },
    {
      name: "IPSrc",
      access: "ip_src",
    },
    {
      name: "PortSrc",
      access: "port_src",
    },
    {
      name: "IPDst",
      access: "ip_dst",
    },
    {
      name: "PortDst",
      access: "port_dst",
    },
    {
      name: "Protocol",
      access: "protocol",
    },
    {
      name: "Handle",
      access: "handle",
    },
  ];
  const rules = useSelector((state: RootState) => state.ruleset.rules);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getRuleset({}));
  }, []);
  const handleAdd = () => {
    navigate("/rules/add");
  };

  const handleDelete = () => {
    navigate("/rules/add");
  };
  return (
    <Box>
      <ReactTable
        headers={headers}
        rows={rules}
        handleActionAdd={handleAdd}
        handleActionDelete={handleDelete}
      />
    </Box>
  );
}
