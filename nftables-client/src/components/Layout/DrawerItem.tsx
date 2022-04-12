import React from 'react'
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Divider, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { APP_NAME, sidebarItems } from 'lib';

const DrawerItem: React.VFC = () => {
  const navigate = useNavigate();
  const handleClick = (route: string) => {
    navigate(route)
  }

  return (
    <div>
      <Toolbar component='h1'>{APP_NAME}</Toolbar>
      <Divider />
      <List>
        {sidebarItems.map((item, index) => (
          <ListItem button key={index}
            onClick={() => handleClick(item.route)}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
      {/* <Divider /> */}
    </div>
  )
}

export { DrawerItem }