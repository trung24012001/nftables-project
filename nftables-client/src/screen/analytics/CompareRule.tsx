import { Grid, Typography } from '@mui/material'
import { RuleInfo } from 'components/RuleInfo';
import { AnomalyType } from 'lib';

export default function CompareRule({ anomaly }: { anomaly: AnomalyType }) {

  return (
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
  )
}
