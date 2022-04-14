import React from "react";
import { Outlet } from "react-router-dom";
import { Box, styled, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import { MessageAlert } from "components/MessageAlert";

export function Layout(): React.ReactElement {
  return (
    <Box sx={{ display: "flex" }} bgcolor="grey.100">
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
  padding: theme.spacing(5),
  position: "relative",
}));
