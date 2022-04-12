import React from "react";
import { Outlet } from "react-router-dom";
import { Box, styled, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";

export function Layout(): React.ReactElement {
  return (
    <Box sx={{ display: 'flex' }} bgcolor="grey.100">
      <Sidebar />
      <Main>
        <Toolbar />
        <Outlet />
      </Main>
    </Box>
  )
}

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  minHeight: '100vh',
  padding: theme.spacing(5),
}))