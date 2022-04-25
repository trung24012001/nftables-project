import { Box, Toolbar } from "@mui/material";
import Background from "components/Layout/Background";
import { ReactTable } from "components/ReactTable";
import { request, TableType } from "lib";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";
import { getTables, setMessage } from "store/reducers";
import { headers } from "./header";


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

  const handleDelete = async (table: TableType) => {
    try {
      const res = await request.delete("/tables", {
        params: {
          table
        },
      });
      if (res.status === 200) {
        dispatch(
          setMessage({
            content: res.data.message,
            type: "success",
          })
        );
      }
      dispatch(getTables({}));
    } catch (err) {
      console.log(err);
      dispatch(
        setMessage({
          content: "Delete table error",
          type: "error",
        })
      );
    }
  };

  return (
    <Background title='Tables'>
      <ReactTable
        headers={headers}
        rows={tables}
        onActionAdd={handleAdd}
        onActionDelete={handleDelete}
      />
    </Background>
  );
}
