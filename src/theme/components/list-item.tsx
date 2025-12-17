import { Theme, Components } from "@mui/material/styles";
import { svgIconClasses } from "@mui/material/SvgIcon";
import { typographyClasses } from "@mui/material/Typography";
import { buttonBaseClasses } from "@mui/material/ButtonBase";

export const listItemCustomization: Components<Theme> = {
  MuiList: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }),
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        [`& .${svgIconClasses.root}`]: {
          // width: "1.5rem",
          // height: "1.5rem",
          color: theme.palette.text.primary,
        },
        [`& .${typographyClasses.root}`]: {
          fontWeight: 400,
        },
        [`& .${buttonBaseClasses.root}`]: {
          display: "flex",
          gap: 15,
          padding: "5px 8px",
          borderRadius: theme.shape.borderRadius,
          opacity: 0.9,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          "&.Mui-selected": {
            opacity: 1,
            backgroundColor: theme.palette.action.selected,

            [`& .${svgIconClasses.root}`]: {
              color: theme.palette.text.primary,
            },
            "&:focus-visible": {
              backgroundColor: theme.palette.action.hover,
            },
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          },
          "&:focus-visible": {
            backgroundColor: "transparent",
          },
        },
      }),
    },
  },
  MuiListItemText: {
    styleOverrides: {
      primary: ({ theme }) => ({
        fontSize: theme.typography.body2.fontSize,
        fontWeight: 400,
        lineHeight: theme.typography.body2.lineHeight,
      }),
      secondary: ({ theme }) => ({
        fontSize: theme.typography.caption.fontSize,
        lineHeight: theme.typography.caption.lineHeight,
      }),
    },
  },
  MuiListSubheader: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: "transparent",
        padding: "4px 8px",
        fontSize: theme.typography.caption.fontSize,
        fontWeight: 500,
        lineHeight: theme.typography.caption.lineHeight,
      }),
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        minWidth: 0,
      },
    },
  },
};
