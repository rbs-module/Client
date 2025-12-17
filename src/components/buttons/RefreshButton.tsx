import React from "react";
import IconButtonStyled from "../styled/IconButton";
import { Icons } from "../icons";
import { IconButtonProps } from "@mui/material";
type Props = IconButtonProps & {
  href?: string;
  loading?: boolean;
};
export function RefreshButton(props: Props) {
  const { loading, ...rest } = props;

  return (
    <IconButtonStyled size="xs" {...rest}>
      <Icons.RefreshIcon className={loading ? "animate-spin" : ""} />
    </IconButtonStyled>
  );
}
