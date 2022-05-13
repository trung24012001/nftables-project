import { Typography } from '@mui/material'
import Background from 'components/Layout/Background'
import { RuleInfo } from 'components/RuleInfo'
import { RuleType, routes } from 'lib'
import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export function FilterRuleDetail() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const rule = JSON.parse(params.get('rule') as string) as RuleType
  return (
    <Background onClick={() => { navigate(routes.FIREWALL_ROUTE) }}>
      <Typography variant='h5'>
        Rule Info
      </Typography>
      <RuleInfo rule={rule} />
    </Background>
  )
}
