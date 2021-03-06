import React from "react";
import { Outlet } from "react-router-dom";
import { Box, styled } from "@mui/material";
import Sidebar, { drawerWidth } from "./Sidebar";
import { MessageAlert } from "components/MessageAlert";

export function Layout(): React.ReactElement {
  return (
    <Box sx={{ display: "flex", overflow: 'hidden' }} bgcolor="grey.100">
      <Sidebar />
      <Main>
        <Outlet />
        <MessageAlert />
      </Main>
    </Box>
  );
}

const Main = styled("main")(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  minWidth: `calc(100vw - ${drawerWidth})`,
  padding: theme.spacing(5),
  position: "relative",
}));
