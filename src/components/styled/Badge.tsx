import { BadgeProps, Badge as MuiBadge, styled } from "@mui/material";

const BadgeStyled = styled(MuiBadge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: -3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));
export default BadgeStyled;
