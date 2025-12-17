"use client";
import * as React from "react";
import Box from "@mui/material/Box";

import { SidebarProvider } from "./context/sidebarContext";
import { drawerWidth, SidebarDrawer } from "./components/Drawer";
import { RootAppbar } from "./components/Appbar";
import { Toolbar } from "@mui/material";
import { useSidebarContext } from "./hooks/useSidebarContext";
import { LayoutProps } from "@/types/global";
import SimpleBar from "simplebar-react";
export default function WithSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarContent>{children}</SidebarContent>
    </SidebarProvider>
  );
}
const SidebarContent = ({ children }: LayoutProps) => {
  const { isOpen } = useSidebarContext();
  return (
    <>
      <SidebarDrawer />
      <Box
        component={SimpleBar}
        className="bg_image"
        sx={(theme) => ({
          height: "100vh",
          marginLeft: isOpen ? drawerWidth + "px" : 57 + "px",
          overflow: "auto",
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          "& .simplebar-thumb": {
            color: "red", // Change this to your desired track color
          },
        })}
      >
        <RootAppbar />
        <Toolbar variant="dense" sx={{ bgcolor: "background.default" }} />
        {children}
      </Box>
    </>
  );
};
