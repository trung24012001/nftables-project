import { Box, Toolbar } from "@mui/material";
import { ReactTable } from "components/ReactTable";
import { request, TableType } from "lib";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";
import { getTables, setMessage } from "store/reducers";

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

  const handleDelete = async (row: any) => {
    try {
      const res = await request.delete("/tables", {
        params: {
          family: row.family,
          name: row.name,
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
      return res.data;
    } catch (err) {
      console.log(err);
      dispatch(
        setMessage({
          content: "Delete table error",
          type: "error",
        })
      );
    }
    console.log(row);
  };

  return (
    <Box>
      <ReactTable
        headers={headers}
        rows={tables}
        handleActionAdd={handleAdd}
        handleActionDelete={handleDelete}
      />
    </Box>
  );
}
