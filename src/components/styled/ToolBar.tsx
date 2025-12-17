"use client";
import { styled, Toolbar as MuiToolbar, ToolbarProps } from "@mui/material";

const Styled = styled(MuiToolbar)(({ theme }) => ({
  borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0  0`,
  backdropFilter: "blur(10px)",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: theme.palette.divider,

  justifyContent: "space-between",
}));

const ToolBarStyled = (props: ToolbarProps) => {
  return <Styled variant="dense" {...props} />;
};

export default ToolBarStyled;
