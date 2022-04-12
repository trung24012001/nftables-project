import { Paper, PaperProps, Stack, Typography } from '@mui/material'
import React from 'react'

type PageProps = {
  title?: string
  leftHeader?: React.ReactNode
} & PaperProps

const Page: React.VFC<PageProps> = ({ children, title, leftHeader, ...paperProps }) => {
  return (
    <Paper elevation={1} sx={{ p: 3, height: '100%', borderRadius: 2 }} {...paperProps}>
      {title && (
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={{ md: 6 }}>
          <Typography variant="h4">{title}</Typography>

          {leftHeader}
        </Stack>
      )}
      {children}
    </Paper>
  )
}

export { Page }
