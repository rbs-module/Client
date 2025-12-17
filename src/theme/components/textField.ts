import { Components, Theme } from "@mui/material";

export const TextFieldCustomization: Components<Theme> = {
  MuiTextField: {
    defaultProps: {
      size: "small",
      fullWidth: true,
      onFocus: (e) => {
        if (e?.target instanceof HTMLInputElement) {
          e.target.select();
        }
      },
      onClick: (e) => {
        if (e?.target instanceof HTMLInputElement) {
          e.target.select();
        }
      },
    },
  },

  MuiSelect: {
    defaultProps: {
      size: "small",
      fullWidth: true,
    },
  },
};
