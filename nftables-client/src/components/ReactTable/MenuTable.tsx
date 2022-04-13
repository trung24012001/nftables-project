import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function MenuTable({ anchorEl, handleClose, handleDelete }: {
  anchorEl: null | HTMLElement,
  handleClose: () => void,
  handleDelete?: () => void
}) {
  const open = Boolean(anchorEl);

  return (
    <Menu
      id="demo-positioned-menu"
      aria-labelledby="demo-positioned-button"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <MenuItem onClick={handleDelete}>Delete</MenuItem>
    </Menu>
  );
}