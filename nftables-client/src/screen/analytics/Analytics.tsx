
import React from "react";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { AnomalyType } from "lib";
import { useFetchData } from "lib/hooks";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { getAnomalies, setMessage } from "store/reducers";
import Background from "components/Layout/Background";
import EchartBar from "./EchartBar";
import RuleAnomaly from "./RuleAnomaly";

export function Analytics(): React.ReactElement {
  const dispatch = useDispatch();
  const anomalies = useSelector((state: RootState) => state.ruleset.anomalies);
  const analytics = useSelector((state: RootState) => state.ruleset.analytics);
  const { loading: loadingRaw, refetch: rawDetection } = useFetchData<{ anomalies: AnomalyType[] }>({
    path: '/raw-detection',
    onError: (error: any) => {
      dispatch(
        setMessage({
          content: "Detect fail",
          type: "error",
        })
      );
    },
    onSuccess: () => {
      dispatch(
        setMessage({
          content: "Detect successfuly",
          type: "success",
        })
      );
    },
    isFetch: false
  })

  const { loading: loadingSql, refetch: sqlDetection } = useFetchData<{ anomalies: AnomalyType[] }>({
    path: '/sql-detection',
    onError: (error: any) => {
      dispatch(
        setMessage({
          content: "SQL detect fail",
          type: "error",
        })
      );
    },
    onSuccess: () => {
      dispatch(
        setMessage({
          content: "SQL detect successfuly",
          type: "success",
        })
      );
    },
    isFetch: false
  })


  const { loading: loadingSync, refetch: syncData } = useFetchData<any>({
    path: '/sync-db',
    onError: (error: any) => {
      dispatch(
        setMessage({
          content: error.message,
          type: "error",
        })
      );
    },
    onSuccess: (data) => {
      dispatch(
        setMessage({
          content: data.message,
          type: "success",
        })
      );
    },
    isFetch: false
  })

  const handleDetect = async () => {
    const data = await rawDetection()
    dispatch(getAnomalies(data))
  }

  const handleSQLDetect = async () => {
    const data = await sqlDetection()
    dispatch(getAnomalies(data))
  }

  const handleSync = async () => {
     await syncData()
  }

  return (
    <Background title='Detect Anomaly'>
      <Stack direction={'row'} spacing={2}>
        <Box>
          <Button onClick={handleDetect} variant='contained'>
            Algorithm Detection
          </Button>
        </Box>
        <Box>
          <Button onClick={handleSQLDetect} variant='contained'>
            SQL Detection
          </Button>
        </Box>
        <Box>
          <Button onClick={handleSync} variant='contained'>
            Sync Database
          </Button>
        </Box>
      </Stack>
      {(loadingRaw || loadingSql || loadingSync) &&
        <Stack spacing={2} alignItems='center' >
          <CircularProgress />
          <Box >Analysing...</Box>
        </Stack>
      }
      <EchartBar analytics={analytics || {}} />
      {anomalies.length ? anomalies.map((anomaly: AnomalyType, idx: number) => {
        return (
          <RuleAnomaly key={idx} anomaly={anomaly} />
        )
      }):
      <Typography>No anomaly found!</Typography>
      }
    </Background>
  );
}
