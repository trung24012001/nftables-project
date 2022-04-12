import { Box } from '@mui/material'
import { ReactTable } from 'components/ReactTable'
import React from 'react'

export function RulesetTable(): React.ReactElement {
  const headers = ['Family', 'Table', 'Chain', 'IPSrc', 'PortSrc', 'IPDst', 'PortDst', 'Priority']
  const rows = [{
    family: 'ip',
    table: 'filter',
    chain: 'output',
    ipSrc: '1.2.3.4',
    portSrc: 3000,
    ipDst: '23.34.5.6',
    portDst: 5000,
    priority: 10

  }, {
    family: 'ip',
    table: 'filter',
    chain: 'output',
    ipSrc: '1.2.3.4-2.3.4.5',
    portSrc: 3000,
    ipDst: '23.34.5.6',
    portDst: 5000,
    priority: 11
  }, {
    family: 'ip',
    table: 'filter',
    chain: 'output',
    ipSrc: '1.2.3.4',
    portSrc: 3000,
    ipDst: '23.34.5.6',
    portDst: 5000,
    priority: 12
  }]
  return (
    <Box>
      <ReactTable headers={headers}
        rows={rows} />
    </Box>
  )
}
