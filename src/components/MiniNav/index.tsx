import {
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { SearchBar } from "../search-bar";
import Link from "next/link";
import IconButtonStyled from "../styled/IconButton";
import { useState } from "react";

import { Icons } from "@/components/icons";
import { RefreshButton } from "../buttons/RefreshButton";

type Props = {
  handleSearch?: (text: string) => void;
  handleRefresh?: () => void;
  searchValue?: string;
  createLink?: string;
  title?: string;
  isRefreshing?: boolean;
  extendItem?: React.ReactNode | null;
  searchAble?: boolean;
  isAbsolute?: boolean;
};
export const MiniNav = ({
  handleSearch = () => {},
  searchValue,
  createLink,
  isRefreshing = false,
  handleRefresh = () => {},
  extendItem = null,
  title = "Title",
  searchAble = true,
  isAbsolute = true,
}: Props) => {
  const [searchOpen, setSearchOpen] = useState(Boolean(searchValue));
  const toggleSearchBar = () => {
    setSearchOpen((p) => !p);
    handleSearch("");
  };
  return (
    <Box className={isAbsolute ? "absolute z-10 -top-0 w-full " : ""}>
      <Toolbar
        variant="dense"
        sx={() => ({
          justifyContent: "space-between",
          // overflow: "auto",
        })}
      >
        {searchOpen ? (
          <>
            <SearchBar value={searchValue} onChange={handleSearch} />
            <IconButton onClick={toggleSearchBar} color="error">
              <Icons.CloseIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
              {title}
            </Typography>
            <Stack direction={"row"} spacing={1}>
              {extendItem}
              <Tooltip title="Refresh">
                <RefreshButton loading={isRefreshing} onClick={handleRefresh} />
              </Tooltip>
              {createLink && (
                <Link href={createLink}>
                  <Tooltip title="Create">
                    <IconButtonStyled size="xs">
                      <Icons.Add />
                    </IconButtonStyled>
                  </Tooltip>
                </Link>
              )}
              {searchAble ? (
                <Tooltip title={"Search"}>
                  <IconButtonStyled size="xs" onClick={toggleSearchBar}>
                    <Icons.SearchIcon />
                  </IconButtonStyled>
                </Tooltip>
              ) : null}
            </Stack>
          </>
        )}
      </Toolbar>
    </Box>
  );
};
