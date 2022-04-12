import { Box } from '@mui/material'
import { ReactTable } from 'components/ReactTable'
import React from 'react'

export function ChainTable(): React.ReactElement {
  const headers = ['Family', 'Table', 'Name', 'Type', 'Hook', 'Priority']
  const rows = [{
    family: 'ip',
    table: 'filter',
    name: 'output',
    type: 'filter',
    hook: 'output',
    priority: 1
  }, {
    family: 'ip6',
    table: 'filter',
    name: 'output',
    type: 'filter',
    hook: 'output',
    priority: 2
  }, {
    family: 'inet',
    table: 'filter',
    name: 'output',
    type: 'filter',
    hook: 'output',
    priority: 3
  }]
  return (
    <Box>
      <ReactTable headers={headers}
        rows={rows} />
    </Box>
  )
}
