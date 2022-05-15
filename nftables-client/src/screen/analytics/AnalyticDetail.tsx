import { Box, Grid, Typography } from '@mui/material';
import Background from 'components/Layout/Background';
import { RuleInfo } from 'components/RuleInfo';
import { routes } from 'lib';
import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';

export function AnalyticDetail() {
  const navigate = useNavigate()
  const [params] = useSearchParams();
  const anomaly = JSON.parse(params.get('anomaly') as string)

  const alertAnomaly = (type: string) => {
    if (type === "shadowing") {
      return "The range of Rule A contains the range of Rule B. Rule B will not work."
    } else if (type === "redundancy") {
      return "This anomaly works fine, but it slows down your system."
    } else if (type === "generalization") {
      return "The range of Rule A is within the range of Rule B. Some cases in B will not work."
    } else if (type === "correlation") {
      return "The range of Rule A intersects the range of Rule B. Crossings between A and B will not work."
    }
  }

  return (
    <Background title='Anomaly Detail' onClick={() => {
      navigate(routes.INDEX_ROUTE);
    }}
    >
      <Grid spacing={3} container>
        <Grid item xs={6}>
          <Typography variant='h5' mb={2}>
            Rule A
          </Typography>
          <RuleInfo rule={anomaly.rule_a} />
        </Grid>
        <Grid item >
          <Typography variant='h5' mb={2}>
            Rule B
          </Typography>
          <RuleInfo rule={anomaly.rule_b} />
        </Grid>
      </Grid>
      <Box>
        This is a <b style={{ color: 'red' }}>{anomaly.anomaly_type}</b> anomaly.
        <div>{alertAnomaly(anomaly.anomaly_type)}</div>
      </Box>
    </Background>
  )
}
