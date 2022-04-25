import React from 'react'
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Stack, Typography } from '@mui/material';

export default function Background({ children, onClick, title }: {
  children: React.ReactNode,
  onClick?: () => void,
  title?: string
}) {
  return (
    <Stack spacing={2}>
      {onClick &&
        <KeyboardBackspaceIcon
          fontSize="large"
          sx={{ mb: 5, cursor: "pointer" }}
          onClick={onClick}
        />
      }
      {title && <Typography variant="h4">{title}</Typography>}
      {children}
    </Stack>
  )
}
