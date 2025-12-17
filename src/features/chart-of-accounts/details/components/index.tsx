"use client";
import { Box, Divider, Typography, useTheme } from "@mui/material";
import AccountDetailsNav from "./nav";
import { useParams } from "next/navigation";
import { useGetAccountTransactionsQuery } from "@/services/accounts";
import { numberWithCommas } from "@/utils/currency-formatter";
import { AgGridReact } from "ag-grid-react";
import { getTransactionColDef, TransactionDefaultColDef } from "./colDef";
import { getGridTheme } from "@/theme/ag-grid/grid-theme";
import SimpleBar from "simplebar-react";
import { PaginationBar } from "@/components/pagination/paginationBar";
import { useAccountsStore } from "@/store/chart-of-accounts/hooks";

function AccountDetails() {
  const activePage = useParams();
  const id = activePage.id as string;
  const theme = useTheme();
  const {
    transactionsQuery: query,
    handleTransactionsQueryChange: handleQueryChange,
  } = useAccountsStore();
  const { data } = useGetAccountTransactionsQuery({ id, query });

  return (
    <Box height={"100vh"}>
      <AccountDetailsNav title={data?.data.account_name || ""} />
      <title>{"Accounts | " + data?.data.account_name}</title>
      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          height: "calc(100vh - 103px)",
          borderTop: 0,
        }}
        component={SimpleBar}
      >
        <Box sx={(theme) => ({ p: theme.spacing(2) })}>
          <Typography>Closing Balance</Typography>
          <Typography
            color="primary"
            sx={{
              fontSize: 40,
              fontWeight: "bold",
              textShadow: "3px 2px #ff000078",
            }}
          >
            {numberWithCommas(data?.data.balance)}
          </Typography>
          <Divider />
          <Typography sx={{ pt: 2 }}>Recent Transactions</Typography>
        </Box>
        <Box
          maxHeight={"calc(100vh - 148px)"}
          minHeight={`calc(100vh - 293px)`}
          height={Number(data?.data?.transactions.length) * 25 + 80}
        >
          <AgGridReact
            rowData={data?.data.transactions}
            columnDefs={getTransactionColDef({
              account_name: data?.data.account_name || "",
            })}
            headerHeight={30}
            rowHeight={25}
            defaultColDef={TransactionDefaultColDef}
            theme={getGridTheme(theme)}
          />
        </Box>
        <Box
          sx={{
            bgcolor: "background.default",
            border: 1,
            borderColor: "divider",
            borderTop: 0,
          }}
        >
          <PaginationBar
            onPageChange={handleQueryChange}
            onLimitChange={handleQueryChange}
            pagination={data?.pagination}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default AccountDetails;
