import { Components, Theme } from "@mui/material";

export const SkeletonCustomization: Components<Theme> = {
  MuiSkeleton: {
    defaultProps: {
      animation: "wave",
    },
  },
};
