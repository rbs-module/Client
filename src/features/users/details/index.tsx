"use client";
import ToolBarStyled from "@/components/styled/ToolBar";
import { Box } from "@mui/material";
import React from "react";
import UserDetailsTab from "./tabs";

function UserDetails() {
  return (
    <Box>
      <ToolBarStyled>User Name</ToolBarStyled>
      <UserDetailsTab />
    </Box>
  );
}

export default UserDetails;
