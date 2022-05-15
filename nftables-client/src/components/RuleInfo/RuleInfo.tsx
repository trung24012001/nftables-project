import React, { useEffect } from 'react'
import { Box, Stack } from '@mui/material'
import { RuleType } from 'lib'

export function RuleInfo({ rule, renderNumber }: { rule: RuleType, renderNumber?: number }) {
  const data = [{
    label: "Family",
    value: rule.family,
  }, {
    label: "Table",
    value: rule.table,
  }, {
    label: "Chain",
    value: rule.chain,
  }, {
    label: "Action",
    value: rule.policy,
  },
  {
    label: "Priority",
    value: rule.handle,
  },
  {
    label: "IP src",
    value: rule.ip_src,
  }, {
    label: "Port src",
    value: rule.port_src,
  }, {
    label: "IP dst",
    value: rule.ip_dst,
  }, {
    label: "Port dst",
    value: rule.port_src,
  }, {
    label: "Protocol",
    value: rule.protocol,
  }, {
    label: "To",
    value: rule.to,
  }].filter((_, idx) => !renderNumber || idx < renderNumber)


  return (
    <Stack>
      {data.map((item, idx) => {
        return (
          <Box key={idx}>
            {item.value &&
              <Box>
                <b>{item.label}:</b> {item.value}
              </Box>
            }
          </Box>
        )
      })}
    </Stack>
  )
}
