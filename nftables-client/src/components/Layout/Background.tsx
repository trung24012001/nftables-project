import React from 'react'
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Stack, SxProps, Theme, Typography } from '@mui/material';

export default function Background({ children, onClick, title, sx }: {
  children: React.ReactNode,
  onClick?: () => void,
  title?: string,
  sx?: SxProps<Theme>
}) {
  return (
    <Stack spacing={2} sx={sx}>
      <Stack direction={'row'} justifyContent='space-between'>
        {onClick &&
          <KeyboardBackspaceIcon
            fontSize="large"
            sx={{ mb: 5, cursor: "pointer" }}
            onClick={onClick}
          />
        }
        {title && <Typography variant="h4">{title}</Typography>}
      </Stack>

      {children}
    </Stack>
  )
}
