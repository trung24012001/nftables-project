import React, { useEffect, useRef } from 'react'
import { Alert, Snackbar } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { setMessage } from 'store/reducers';


export function MessageAlert() {
  const dispatch = useDispatch()
  const message = useSelector((state: RootState) => state.common.message)
  const timeout = useRef<any>();

  useEffect(() => {
    if (!message) {
      return;
    }
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      dispatch(setMessage(null))
    }, 3000)

  }, [message])

  const handleClose = () => {
    dispatch(setMessage(null))
  }

  return (
    <Snackbar
      open={!!message?.content}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      autoHideDuration={3000}
      onClose={handleClose}

    >
      <Alert severity={message?.type}>{message?.content}</Alert>
    </Snackbar >

  )
}
