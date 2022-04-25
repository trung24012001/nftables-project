import { Box } from "@mui/material";
import Background from "components/Layout/Background";
import { ReactTable } from "components/ReactTable";
import { request, RuleType } from "lib";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";
import { getRuleset, setMessage } from "store/reducers";
import { headers } from "./header";

export function RulesetTable(): React.ReactElement {

  const rules = useSelector((state: RootState) => state.ruleset.rules);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getRuleset({}));
  }, []);
  const handleAdd = () => {
    navigate("/rules/add");
  };

  const handleDelete = async (rule: RuleType) => {
    try {
      console.log(rule)
      // const res = await request.delete('/rules', {
      //   params: {
      //     rule
      //   }
      // })
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
    <Background title="Ruleset">
      <ReactTable
        headers={headers}
        rows={rules}
        onActionAdd={handleAdd}
        onActionDelete={handleDelete}
      />
    </Background>
  );
}
