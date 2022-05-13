import { Box } from '@mui/material';
import Background from 'components/Layout/Background';
import { routes } from 'lib';
import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import CompareRule from './CompareRule';

export function AnalyticDetail() {
  const navigate = useNavigate()
  const [params] = useSearchParams();
  const anomaly = JSON.parse(params.get('anomaly') as string)

  return (
    <Background title='Anomaly Detail' onClick={() => {
      navigate(routes.INDEX_ROUTE);
    }}
    >
      <CompareRule anomaly={anomaly} />
      <Box>
        <b>Description:</b> This is a <b style={{ color: 'red' }}>{anomaly.anomaly_type}</b> anomaly.
      </Box>
    </Background>
  )
}
