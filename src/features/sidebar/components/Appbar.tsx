import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { Avatar, Stack, styled, Tooltip, Typography } from "@mui/material";
import { drawerWidth } from "./Drawer";
import { useSidebarContext } from "../hooks/useSidebarContext";
import ColorModeIconDropdown from "./ColorModeIconDropdown";
import { useFetchMyOrganizationQuery } from "@/services/organization";
import ToolBarStyled from "@/components/styled/ToolBar";
import IconButtonStyled from "@/components/styled/IconButton";
import { Icons } from "@/components/icons";
import ConfirmationDialog from "@/components/dialog/confirmation";
import useLogout from "../hooks/useLogout";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  width: `calc(100% - ${56}px)`,
  zIndex: 10,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
      },
    },
  ],
}));

export const RootAppbar = () => {
  const { isOpen } = useSidebarContext();
  const { data: org } = useFetchMyOrganizationQuery(null);

  const {
    handleCloseLogoutPopup,
    handleLogout,
    openLogoutPopup,
    handleOpenLogoutPopup,
  } = useLogout();
  return (
    <AppBar
      position="fixed"
      open={isOpen}
      sx={{ bgcolor: "transparent", backdropFilter: "blur(10px)" }}
      elevation={1}
    >
      <ToolBarStyled sx={{ borderRadius: 0 }}>
        <Stack direction={"row"} spacing={2}>
          <Typography variant="h6" color="textPrimary" noWrap>
            {org?.organization_name}
          </Typography>
        </Stack>
        <Stack direction={"row"} spacing={1}>
          <ColorModeIconDropdown />
          <Tooltip title="Logout">
            <IconButtonStyled
              size="small"
              sx={{ border: 1, borderColor: "divider" }}
              onClick={handleOpenLogoutPopup}
            >
              <Icons.LoginIcon />
            </IconButtonStyled>
          </Tooltip>
        </Stack>
      </ToolBarStyled>
      <ConfirmationDialog
        closable
        open={openLogoutPopup}
        onClose={handleCloseLogoutPopup}
        onConfirm={handleLogout}
        content={
          <Stack direction={"row"} spacing={3} alignItems={"center"}>
            <Avatar>
              <Icons.LoginIcon />
            </Avatar>
            <Typography pr={10}>Do you want to logout?</Typography>
          </Stack>
        }
      />
    </AppBar>
  );
};
