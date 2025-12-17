import { alpha, Theme as MuiTheme } from "@mui/material";
import { themeQuartz } from "ag-grid-community";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getGridTheme = (theme: MuiTheme, expend?: any) => {
  const gridThemeParams = themeQuartz.withParams({
    browserColorScheme: "dark",
    backgroundColor: alpha(theme.palette.background.paper, 0.5),
    menuBackgroundColor: theme.palette.background.paper,
    headerBackgroundColor: theme.palette.background.default,
    foregroundColor: theme.palette.text.primary,
    selectedRowBackgroundColor: theme.palette.action.selected,
    rowHoverColor: theme.palette.action.hover,
    wrapperBorderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
    chromeBackgroundColor: {
      ref: "foregroundColor",
      mix: 0.07,
      onto: "backgroundColor",
    },

    headerFontSize: 14,
    fontSize: 11,
    columnBorder: {
      color: alpha(theme.palette.divider, 0.05),
    },
    rowBorder: {
      color: alpha(theme.palette.divider, 0.05),
    },

    ...expend,
  });
  return gridThemeParams;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSideBarGridTheme = (theme: MuiTheme, expend?: any) => {
  const gridTheme = getGridTheme(theme, {
    columnBorder: {
      style: "none",
    },
    headerBackgroundColor: theme.palette.background.paper,
    backgroundColor: theme.palette.background.paper,
    rangeSelectionBorderColor: "transparent",
    ...expend,
  });
  return gridTheme;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getInvoiceViewGridTheme = (theme: MuiTheme, expend?: any) => {
  const gridTheme = getGridTheme(theme, {
    backgroundColor: theme.palette.background.paper,
    headerBackgroundColor: theme.palette.baseShadow,
    rangeSelectionBorderColor: "transparent",
    headerRowBorder: {
      color: alpha(theme.palette.divider, 0.05),
    },
    headerColumnBorder: {
      color: alpha(theme.palette.divider, 0.05),
    },

    ...expend,
  });
  return gridTheme;
};
