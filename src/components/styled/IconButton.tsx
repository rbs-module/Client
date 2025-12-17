import {
  alpha,
  IconButtonProps,
  IconButton as MuiIconButton,
  styled,
  svgIconClasses,
} from "@mui/material";

declare module "@mui/material/IconButton" {
  interface IconButtonPropsSizeOverrides {
    xs: true;
  }
}

const Styled = styled(MuiIconButton)(({ theme, size }) => ({
  boxShadow: theme.shadows[1],
  borderRadius: theme.shape.borderRadius,
  textTransform: "none",
  fontWeight: theme.typography.fontWeightMedium,
  letterSpacing: 0,
  ...(size === "small" && {
    width: "1.9rem",
    height: "1.9rem",
    padding: "0.1rem",
    [`& .${svgIconClasses.root}`]: { fontSize: "1.1rem" },
  }),
  ...(size === "xs" && {
    width: "1.6rem",
    height: "1.6rem",
    padding: "0.09rem",
    [`& .${svgIconClasses.root}`]: { fontSize: "1rem" },
  }),
  ...(size === "medium" && {
    width: "2.5rem",
    height: "2.5rem",
  }),
}));

const IconButtonStyled = (
  props: IconButtonProps & {
    href?: string;
  },
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const style: any = props.sx;
  return (
    <Styled
      color="secondary"
      size="xs"
      {...props}
      sx={(theme) => ({
        boxShadow: theme.shadows[1],
        border: 0.5,
        borderColor: alpha(theme.palette.divider, 0.05),
        ...style,
      })}
    />
  );
};

export default IconButtonStyled;
