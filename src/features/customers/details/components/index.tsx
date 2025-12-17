"use client";
import { Box } from "@mui/material";
import React from "react";
import CustomerDetailsNav from "./nav";
import TabBar from "./tabs";

function CustomerDetails() {
  return (
    <Box>
      <CustomerDetailsNav />
      <TabBar />
    </Box>
  );
}

export default CustomerDetails;
