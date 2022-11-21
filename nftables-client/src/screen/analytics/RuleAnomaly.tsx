import React, { useEffect, useState } from 'react'
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material'
import { AnomalyType, routes } from 'lib'
import { useNavigate } from 'react-router-dom'
import { RuleInfo } from 'components/RuleInfo'

export default function RuleAnomaly({ anomaly }: {
  anomaly: AnomalyType
}) {
  const navigate = useNavigate()

  const handleAnalytics = () => {
    navigate({
      pathname: routes.ANALYTICS_ROUTE,
      search: `?anomaly=${encodeURIComponent(JSON.stringify(anomaly))}`
    })
  }

  return (
    <Paper sx={{ padding: 2 }} >
      <Stack spacing={3}>
        <Grid spacing={3} container>
          <Grid item xs={6}>
            <Typography variant='h5' lineHeight={3}>
              Rule A
            </Typography>
            <RuleInfo rule={anomaly.rule_a} renderNumber={9} />
          </Grid>
          <Grid item >
            <Typography variant='h5' lineHeight={3}>
              Rule B
            </Typography>
            <RuleInfo rule={anomaly.rule_b} renderNumber={9} />
          </Grid>
        </Grid>
        <Box>
          This is a <b style={{ color: 'red' }}>{anomaly.anomaly_type}</b> anomaly.
        </Box>
        {/* <Box>
          This is a <b style={{ color: 'red' }}>{anomaly.anomaly_type}</b> anomaly. Click ANALYTICS to show more...
        </Box> */}
        {/* <Box>
          <Button variant='contained' onClick={handleAnalytics}>
            Analytics
          </Button>
        </Box> */}

      </Stack>
    </Paper >
  )
}
