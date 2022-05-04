import React from "react";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { sidebarItems, SidebarType } from "./sidebarItems";

const DrawerItem: React.VFC = () => {
  const APP_NAME = process.env.REACT_APP_NAME;
  const location = useLocation();

  const checkActiveRoute = (route: string) => {
    if (route == '/')
      return location.pathname === '/'

    return location.pathname.indexOf(route) >= 0;
  }

  return (
    <div>
      <Toolbar component="h1" >{APP_NAME}</Toolbar>
      <Divider />
      <List>
        {sidebarItems.map((item: SidebarType, idx: number) => (
          <ListItem
            button={true}
            key={idx}
            component={NavLink}
            to={item.route}
            sx={(theme) => ({
              background: checkActiveRoute(item.route) ? theme.palette.primary.light : '#fff',

            })}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
      {/* <Divider /> */}
    </div>
  );
};


export { DrawerItem };
