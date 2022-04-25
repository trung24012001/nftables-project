import { IconButton, Stack } from '@mui/material';
import React from 'react'
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

export default function ActionContainer({ children, onAdd, onDelete, hasDelete, hasAdd }: {
  children: React.ReactNode,
  onAdd?: () => void,
  onDelete?: () => void,
  hasDelete?: boolean,
  hasAdd?: boolean
}) {
  return (
    <Stack direction={'row'} alignItems='center'>
      {children}
      {hasAdd &&
        <IconButton onClick={onAdd} color='success'>
          <AddCircleOutline />
        </IconButton>
      }
      {hasDelete &&
        <IconButton onClick={onDelete} color='error'>
          <DeleteOutline />
        </IconButton>
      }
    </Stack>
  )
}
