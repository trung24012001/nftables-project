import { Box, Button, IconButton, Stack } from '@mui/material'
import { ReactTable } from 'components/ReactTable'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import React from 'react'
export function FilterTable(): React.ReactElement {

  const headers = ['Family', 'Name', 'Priority']
  const rows = [{
    family: 'ip',
    name: 'filter',
    priority: 1
  }, {
    family: 'inet',
    name: 'filter',
    priority: 2
  }, {
    family: 'ip',
    name: 'newtable',
    priority: 3
  }]

  return (
    <Box>
      <ReactTable headers={headers}
        rows={rows} />
    </Box>
  )
}
