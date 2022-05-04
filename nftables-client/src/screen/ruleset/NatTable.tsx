import { Box } from "@mui/material";
import Background from "components/Layout/Background";
import { ReactTable } from "components/ReactTable";
import { request, routes, RuleType } from "lib";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";
import { getRuleset, setMessage } from "store/reducers";
import { natHeaders } from "./header";

export function NatTable(): React.ReactElement {
  const natRules = useSelector((state: RootState) => state.ruleset.nat_rules);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getRuleset({ type: "nat" }));
  }, []);
  const handleAdd = () => {
    navigate(routes.ADD_NAT_ROUTE);
  };

  const handleDelete = async (rule: any) => {
    try {
      console.log(rule);
      const res = await request.delete("/rules", {
        params: {
          rule,
        },
      });
      if (res.status === 200) {
        dispatch(
          setMessage({
            content: res.data.message,
            type: "success",
          })
        );
        dispatch(getRuleset({ type: "nat" }));
      }
    } catch (error) {
      console.log(error);
      dispatch(
        setMessage({
          content: "Delete rule error",
          type: "error",
        })
      );
    }
  };
  return (
    <Background title="Nat Ruleset">
      <ReactTable
        headers={natHeaders}
        rows={natRules}
        onActionAdd={handleAdd}
        onActionDelete={handleDelete}
      />
    </Background>
  );
}
