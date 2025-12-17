import ExcelButton from "@/components/buttons/ExcellButton";
import { Icons } from "@/components/icons";
import { SearchBar } from "@/components/search-bar";
import IconButtonStyled from "@/components/styled/IconButton";
import ToolBarStyled from "@/components/styled/ToolBar";
import {
  Button,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";

import Link from "next/link";
import useCustomersHook from "../hooks/useCustomersHook";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import { useNamedMenu } from "@/hooks/useMenu";

export const CustomersNav = () => {
  const {
    handleExport,
    handleSearch,
    isLoading,
    refetch,
    query,
    handleQueryChange,
  } = useCustomersHook();
  const {
    ActiveAnchorEl,
    ActiveOpen,
    handleActiveMenuClose,
    handleActiveMenuOpen,
  } = useNamedMenu({ name: "Active" });
  return (
    <nav>
      <ToolBarStyled
        sx={(theme) => ({
          my: theme.spacing(1),
          pl: 3,
          pr: 1,
        })}
      >
        <SearchBar onChange={handleSearch} />
        <Stack direction={"row"} spacing={2}>
          <Button
            onClick={handleActiveMenuOpen}
            endIcon={<Icons.ExpandMoreIcon />}
          >
            {query.active ? "Active" : "All"}
          </Button>
          <ExcelButton onClick={handleExport} />
          <Link href={"/v1/sales/customers/create"}>
            <IconButtonStyled size="xs">
              <Icons.Add />
            </IconButtonStyled>
          </Link>
          <RefreshButton loading={isLoading} onClick={refetch} />
        </Stack>
      </ToolBarStyled>
      <Menu
        open={ActiveOpen}
        anchorEl={ActiveAnchorEl}
        onClose={handleActiveMenuClose}
      >
        <MenuItem
          selected={query.active}
          onClick={() => {
            handleQueryChange({ active: true });
            handleActiveMenuClose();
          }}
        >
          <ListItemText>Receive</ListItemText>
          <Typography variant="body2" sx={{ color: "text.secondary", ml: 3 }}>
            {query.active ? <Icons.DoneAllIcon /> : " "}
          </Typography>
        </MenuItem>

        <MenuItem
          selected={!query.active}
          onClick={() => {
            handleQueryChange({ active: undefined });
            handleActiveMenuClose();
          }}
        >
          <ListItemText>All</ListItemText>
          <Typography variant="body2" sx={{ color: "text.secondary", ml: 3 }}>
            {!query.active ? <Icons.DoneAllIcon /> : " "}
          </Typography>
        </MenuItem>
      </Menu>
    </nav>
  );
};
