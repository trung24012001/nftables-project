import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

export function Layout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Outlet />
    </Box>
  )
} 
