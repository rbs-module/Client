import { Box, BoxProps } from "@mui/material";
import React from "react";

function Row(props: BoxProps) {
  return <Box {...props} sx={{ display: "flex", gap: 1, ...props.sx }} />;
}

export default Row;
