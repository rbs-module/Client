"use client";

import { store } from "@/store";
import theme from "@/theme";
import type { LayoutProps } from "@/types/global";
import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const Layout = ({ children }: LayoutProps) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {children}
        </LocalizationProvider>

        <Toaster
          position="bottom-left"
          gutter={8}
          // containerStyle={{}}
          toastOptions={{
            // Define default options
            className: "shadow-md bg-white rounded-sm",
            duration: 3000,
            style: { borderRadius: "3px" },
          }}
        />
      </ThemeProvider>
    </Provider>
  );
};

export default Layout;
