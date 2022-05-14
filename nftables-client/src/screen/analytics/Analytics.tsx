
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import Background from "components/Layout/Background";
import { AnomalyType } from "lib";
import { useFetchData } from "lib/hooks";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { getAnomalies } from "store/reducers";
import EchartBar from "./EchartBar";
import RuleAnomaly from "./RuleAnomaly";

export function Analytics(): React.ReactElement {
  const dispatch = useDispatch();
  const anomalies = useSelector((state: RootState) => state.ruleset.anomalies);
  const analytics = useSelector((state: RootState) => state.ruleset.analytics);
  const { loading, refetch } = useFetchData<{ anomalies: AnomalyType[] }>({
    path: '/anomaly',
    onError: (error) => {
      console.log(error)
    },
    isFetch: false
  })

  const handleDetect = async () => {
    const refetchData = await refetch()
    dispatch(getAnomalies(refetchData))
  }

  return (
    <Background title='Detect Anomaly'>
      <Box>
        <Button onClick={handleDetect} variant='contained'>
          Detect
        </Button>
      </Box>
      {loading &&
        <Stack spacing={2} alignItems='center' >
          <CircularProgress />
          <Box >Analysing...</Box>
        </Stack>
      }
      <EchartBar analytics={analytics || {}} />
      {anomalies.map((anomaly: AnomalyType, idx: number) => {
        return (
          <RuleAnomaly key={idx} anomaly={anomaly} />
        )
      })}
    </Background>
  );
}
