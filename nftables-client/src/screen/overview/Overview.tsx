
import { Box, Button } from "@mui/material";
import Background from "components/Layout/Background";
import { ReactTable } from "components/ReactTable";
import { request, TableType } from "lib";
import { useFetchData } from "lib/hooks";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getTables, setMessage } from "store/reducers";
import { headers } from "./header";


export function Overview(): React.ReactElement {
  const navigate = useNavigate();

  const { data, loading, refetch } = useFetchData<{ tables: TableType[] }>({
    path: '/anomaly',
    onError: (error) => {
      console.log(error)
    }
  })

  const handleClick = () => {
    refetch()
  }

  return (
    <Background title='Detect Anomaly'>
      <Box>
        <Button onClick={handleClick} variant='contained'>
          Detect
        </Button>
      </Box>
      <ReactTable
        headers={headers}
        rows={data?.tables}
        loading={loading}
      />
    </Background>
  );
}
