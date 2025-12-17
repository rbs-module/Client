"use client";
import RefreshLoading from "@/components/Loading/RefreshLoading";
import { MiniNav } from "@/components/MiniNav";
import { getSideBarGridTheme } from "@/theme/ag-grid/grid-theme";
import {
  Button,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef, useState } from "react";

import useSidebarSelection from "@/hooks/useSidebarSelection";

import { PaginationBarMini } from "@/components/pagination/paginationBarMini";
import { useParams } from "next/navigation";
import { useGetAccountsQuery } from "@/services/accounts";
import {
  ACCOUNT_TYPES,
  AccountType,
} from "@/zod-schemas/accounts/account-schema";
import { accountsColDef } from "./colDef";
import { useAccountSocket } from "@/hooks/useAccountSocket";
import { useAccountsStore } from "@/store/chart-of-accounts/hooks";
import { useNamedMenu } from "@/hooks/useMenu";
import { Icons } from "@/components/icons";
import { _arrSum } from "@/utils/arrSum";

function ChartOfAccounts() {
  const { accountsQuery, handleAccountsQueryChange } = useAccountsStore();
  const { data, refetch, isLoading, isFetching } =
    useGetAccountsQuery(accountsQuery);
  useAccountSocket({ query: accountsQuery });

  const accounts = useMemo(() => {
    if (!data || data?.accounts.length == 0) {
      return [];
    }

    const arr = data.accounts;

    if (accountsQuery.type == "all") {
      return arr;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalRow: any = {
      account_name: "Total",
      balance: _arrSum(arr, "balance"),
      _id: "",
    };
    return [...arr, totalRow];
  }, [accountsQuery.type, data]);

  const gridRef = useRef<AgGridReact<AccountType> | null>(null);
  const activePage = useParams();
  const accountId = activePage.id as string;

  const { onGridReady, onRowClicked, onRowSelected } = useSidebarSelection({
    rowData: accounts,
    gridRef,
    id: accountId,
    keyId: "_id",
    getPushLink: ({ _id }) => `/v1/accounts/chart-of-accounts/${_id}`,
  });
  const theme = useTheme();

  const [type, setType] = useState<typeof accountsQuery.type>(
    accountsQuery.type,
  );
  const handleSelectType = (type: typeof accountsQuery.type) => {
    handleAccountsQueryChange({ type });
    setType(type);
    handleTypeMenuClose();
  };
  const handleSearch = (search: string) => {
    handleAccountsQueryChange({ search, type: search ? "all" : type });
  };
  const { TypeAnchorEl, handleTypeMenuClose, TypeOpen, handleTypeMenuOpen } =
    useNamedMenu({ name: "Type" });
  return (
    <>
      <style>{`
      .ag-row-selected { border-left: 4px solid ${theme.palette.primary.main} } 
    `}</style>

      <MiniNav
        isRefreshing={isFetching || isLoading}
        title="Accounts"
        handleSearch={handleSearch}
        createLink="/v1/accounts/chart-of-accounts/create"
        searchValue={accountsQuery.search}
        handleRefresh={refetch}
        extendItem={
          <>
            <Button
              onClick={handleTypeMenuOpen}
              endIcon={<Icons.ExpandMoreIcon />}
            >
              {accountsQuery.type}
            </Button>
            <Menu
              onClose={handleTypeMenuClose}
              open={TypeOpen}
              anchorEl={TypeAnchorEl}
            >
              {ACCOUNT_TYPES.map((item) => (
                <MenuItem
                  key={item}
                  selected={accountsQuery.type == item}
                  onClick={() => handleSelectType(item)}
                >
                  <ListItemText sx={{ textTransform: "capitalize" }}>
                    {item}
                  </ListItemText>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", ml: 3 }}
                  >
                    {accountsQuery.type == item ? <Icons.DoneAllIcon /> : " "}
                  </Typography>
                </MenuItem>
              ))}
              <MenuItem
                selected={accountsQuery.type == "all"}
                onClick={() => handleSelectType("all")}
              >
                <ListItemText sx={{ textTransform: "capitalize" }}>
                  All
                </ListItemText>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", ml: 3 }}
                >
                  {accountsQuery.type == "all" ? <Icons.DoneAllIcon /> : " "}
                </Typography>
              </MenuItem>
            </Menu>
          </>
        }
      />

      <RefreshLoading isLoading={isLoading || isFetching} />
      <AgGridReact
        theme={getSideBarGridTheme(theme)}
        ref={gridRef}
        rowData={accounts}
        columnDefs={accountsColDef}
        onGridReady={onGridReady}
        rowHeight={50}
        onRowClicked={onRowClicked}
        onRowSelected={onRowSelected}
        rowSelection={{
          mode: "singleRow",
          checkboxes: false,
        }}
        defaultColDef={{ headerName: "", resizable: false }}
      />
      <PaginationBarMini
        pagination={data?.pagination}
        onPageChange={handleAccountsQueryChange}
      />
    </>
  );
}

export default ChartOfAccounts;
