
import { Box, Button } from "@mui/material";
import Background from "components/Layout/Background";
import { ReactTable } from "components/ReactTable";
import { AnomalyType, TableType } from "lib";
import { useFetchData } from "lib/hooks";
import React from "react";
import { useNavigate } from "react-router-dom";
import { headers } from "./header";


export function Overview(): React.ReactElement {
  const navigate = useNavigate();

  const { data, loading, refetch } = useFetchData<{ anomaly: AnomalyType[] }>({
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
        rows={data?.anomaly}
        loading={loading}
      />
    </Background>
  );
}
