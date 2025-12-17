import {
  Skeleton,
  SkeletonProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import React from "react";

function LoadingText(
  props: TypographyProps & { loading?: boolean; skeletonProps?: SkeletonProps },
) {
  const { loading, skeletonProps, ...rest } = props;
  if (loading) {
    return <Skeleton width={100} {...skeletonProps} />;
  }

  return <Typography {...rest} />;
}

export default LoadingText;
