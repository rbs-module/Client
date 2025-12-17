"use client";
import { Box } from "@mui/material";
import React, { useState } from "react";
import IconButtonStyled from "../styled/IconButton";
import { Icons } from "../icons";

type Props = {
  Sidebar: React.ReactNode;
  Main: React.ReactNode;
  height?: string;
};
function SideTableLayout({ Main, Sidebar, height }: Props) {
  const [swipe, setSwipe] = useState(false);
  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        height: height || "calc(100vh - 48px)",
        width: "100%",
        px: theme.spacing(1),
        pt: 1,
        overflow: "auto",
      })}
    >
      <Box
        sx={{
          height: "100%",
          width: { xs: "100%", sm: "300px", xl: "400px" },
          display: { xs: swipe ? "none" : "block", sm: "block" },
          minWidth: "250px",
          position: "relative",
        }}
      >
        {Sidebar}
      </Box>

      <Box
        sx={(theme) => ({
          height: "100%",
          flexGrow: 1,
          display: { xs: swipe ? "block" : "none", sm: "block" },
          ml: { xs: 0, sm: theme.spacing(1) },
          position: "relative",
          overflow: "hidden",
          // border: 1,
          // borderColor: "divider",
          // borderTopLeftRadius: theme.shape.borderRadius,
          // borderTopRightRadius: theme.shape.borderRadius,
        })}
      >
        {Main}
      </Box>
      <IconButtonStyled
        sx={{
          display: { xs: "block", sm: "none" },
          position: "fixed",
          zIndex: 10,
          right: !swipe ? 10 : undefined,
          left: swipe ? 60 : undefined,
          top: "25%",
          border: 1,
          borderColor: "divider",
        }}
        onClick={() => {
          setSwipe((p) => !p);
        }}
      >
        <Icons.ArrowForwardIosIcon className={swipe ? `rotate-180` : ""} />
      </IconButtonStyled>
    </Box>
  );
}

export default SideTableLayout;
