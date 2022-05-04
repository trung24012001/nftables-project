import { Box } from "@mui/material";
import Background from "components/Layout/Background";
import { ReactTable } from "components/ReactTable";
import { request, routes } from "lib";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";
import { getRuleset, setMessage } from "store/reducers";
import { firewallHeaders } from "./header";

export function FirewallTable(): React.ReactElement {
  const firewallRules = useSelector(
    (state: RootState) => state.ruleset.filter_rules
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getRuleset({ type: "filter" }));
  }, []);
  const handleAdd = () => {
    navigate(routes.ADD_FIREWALL_ROUTE);
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
        dispatch(getRuleset({ type: "filter" }));
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
    <Background title="Firewall Ruleset">
      <ReactTable
        headers={firewallHeaders}
        rows={firewallRules}
        onActionAdd={handleAdd}
        onActionDelete={handleDelete}
      />
    </Background>
  );
}
