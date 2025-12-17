import React from "react";
import MuiDrawer from "@mui/material/Drawer";
import type { CSSObject, Theme } from "@mui/material";
import {
  Box,
  createTheme,
  IconButton,
  styled,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";

import { DrawerContent } from "./DrawerContent";
import { useSidebarContext } from "../hooks/useSidebarContext";
import { components } from "@/theme/components";
import { shadows, shape, typography } from "@/theme/themePrimitives";
import { useFetchMyOrganizationQuery } from "@/services/organization";
import { Icons } from "@/components/icons";

export const drawerWidth = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
});

export const SidebarDrawer = () => {
  const { data } = useFetchMyOrganizationQuery(null);
  const { isOpen, toggleSidebar } = useSidebarContext();
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
    components: {
      ...components,
    },
    typography,
    shadows,
    shape,
  });
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ position: "fixed", zIndex: 10 }}>
        <Drawer variant="permanent" open={isOpen}>
          <Toolbar
            variant="dense"
            sx={{
              justifyContent: isOpen ? "space-between" : "center",
              position: "sticky",
              top: 0,
              zIndex: 10,
              backdropFilter: "blur(10px)",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            {isOpen ? (
              <Typography sx={{ fontWeight: "bold" }}>
                {data?.organization_name}
              </Typography>
            ) : null}
            <IconButton onClick={toggleSidebar}>
              {isOpen ? <Icons.ChevronLeftIcon /> : <Icons.MenuIcon />}
            </IconButton>
          </Toolbar>

          <DrawerContent />
        </Drawer>
      </Box>
    </ThemeProvider>
  );
};
