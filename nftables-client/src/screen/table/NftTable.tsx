import Background from "components/Layout/Background";
import { ReactTable } from "components/ReactTable";
import { request, routes, TableType } from "lib";
import { useFetchData } from "lib/hooks";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, createSearchParams } from "react-router-dom";
import { setMessage } from "store/reducers";
import { headers } from "./header";


export function NftTable(): React.ReactElement {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, loading, refetch } = useFetchData<{ tables: TableType[] }>({
    path: '/tables',
    onError: (error) => {
      console.log(error)
    }
  })

  const handleAdd = () => {
    navigate(routes.ADD_TABLE_ROUTE);
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
        refetch()
      }
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

  const handleSelectRow = (row: TableType) => {
    navigate({
      pathname: routes.CHAIN_ROUTE,
      search: `?table=${encodeURIComponent(JSON.stringify(row))}`
    })
  }

  return (
    <Background title='Tables'>
      <ReactTable
        headers={headers}
        rows={data?.tables}
        loading={loading}
        onActionAdd={handleAdd}
        onActionDelete={handleDelete}
        onActionRow={handleSelectRow}
      />
    </Background>
  );
}
