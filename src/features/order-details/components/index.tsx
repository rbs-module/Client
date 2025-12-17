import { Box } from "@mui/material";
import React from "react";
import OrderDetailsNav from "./Nav";
import OrderDetailsTab from "./tabs";

function OrderDetail() {
  return (
    <Box>
      <OrderDetailsNav />
      <OrderDetailsTab />
    </Box>
  );
}

export { OrderDetail };
