import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { RuleType } from 'lib'
import { parseListValue } from 'lib/util'

export function RuleInfo({ rule, renderNumber }: { rule: RuleType, renderNumber?: number }) {
  const data = [
  //   {
  //   label: "Family",
  //   value: rule.family,
  // }, 
  {
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
    value:  parseListValue(rule.ip_src),
  }, {
    label: "Port src",
    value:  parseListValue(rule.port_src),
  }, {
    label: "IP dst",
    value:  parseListValue(rule.ip_dst),
  }, {
    label: "Port dst",
    value:  parseListValue(rule.port_src),
  }, {
    label: "Protocol",
    value: rule.protocol,
  }, {
    label: "To",
    value: rule.to,
  }].filter((_, idx) => !renderNumber || idx < renderNumber)
  console.log(rule)

  return (
    <Stack>
      {data.map((item, idx) => {
        return (
          <Box key={idx}>
            {item.value &&
              <Box>
                <Typography sx={{width: "300px", whiteSpace: "nowrap", lineHeight: "2em", overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  <b>{item.label}:</b> {item.value}
                </Typography>
              </Box>
            }
          </Box>
        )
      })}
    </Stack>
  )
}
