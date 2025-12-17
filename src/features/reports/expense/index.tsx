/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ExcelButton from "@/components/buttons/ExcellButton";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import ToolBarStyled from "@/components/styled/ToolBar";
import { useGetExpensesQuery } from "@/services/expenses";
import { thisMonthRange } from "@/utils/date-ranges";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { BlobProvider } from "@react-pdf/renderer";
import React, { useState } from "react";
import ExpensePdf from "./pdf";
import { useFetchMyOrganizationQuery } from "@/services/organization";
import exportFromJSON from "export-from-json";
import { FindTransactionsQueryType } from "@/zod-schemas/accounts/find-transactions";
import Link from "next/link";
import IconButtonStyled from "@/components/styled/IconButton";
import { Icons } from "@/components/icons";
import DateRangeSelector from "@/components/DateRangeSelector";
import { AgGridReact } from "ag-grid-react";
import { getInvoiceViewGridTheme } from "@/theme/ag-grid/grid-theme";
import { PaginationBar } from "@/components/pagination/paginationBar";
import { numberWithCommas } from "@/utils/currency-formatter";
import { _arrSum } from "@/utils/arrSum";

function ExpensesReport() {
  const { data: organization } = useFetchMyOrganizationQuery(null);
  const [query, setQuery] = useState<
    Partial<FindTransactionsQueryType> & { label: string }
  >({
    ...thisMonthRange,
    sort_type: "asc",
    limit: 100,
  });

  const { data, isFetching, refetch } = useGetExpensesQuery(query);
  const theme = useTheme();
  const handleExport = () => {
    const fileName = `Expenditure`;
    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data: data?.transactions || [], fileName, exportType });
  };

  const totalRow = {
    amount: 0,
    description: "Total Debits asd Credits",
    amount_formatted: `${numberWithCommas(_arrSum(data?.transactions || [], "amount"))}`,
    date_formatted: `Total`,

    _id: "",
    type: "custom",
    destination: {
      account_name: "",
      _id: "",
    },
    source: {
      account_name: "",
      _id: "",
    },
    createdBy: {
      id: "",
      name: "",
    },
    date: new Date(),
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 150px)",
        width: "100%",
        px: theme.spacing(1),
        mt: 1,
      }}
    >
      <title>Reports</title>
      <ToolBarStyled>
        <Typography variant="h6">Bill & Payments</Typography>
        <Stack direction={"row"} spacing={2}>
          <RefreshButton onClick={refetch} loading={isFetching} />
          <ExcelButton onClick={handleExport} />

          {isFetching ? null : (
            <BlobProvider
              document={
                <ExpensePdf
                  rows={data ? [...data.transactions, totalRow as any] : []}
                  organization={organization}
                  start_date={query.start_date || ""}
                  end_date={query.end_date || ""}
                />
              }
            >
              {({ url, loading }) => (
                <Link href={`${url}`} target="_blank">
                  <IconButtonStyled size="xs" disabled={loading}>
                    <Icons.PrintIcon className="w-4 h-4" />
                  </IconButtonStyled>
                </Link>
              )}
            </BlobProvider>
          )}
          <DateRangeSelector
            showLabel
            {...query}
            selected={query.label}
            onChange={(value) => setQuery((prev) => ({ ...prev, ...value }))}
          />
        </Stack>
      </ToolBarStyled>
      <Box mt={1}>
        <Box sx={{ height: "calc(100vh - 153px)" }}>
          <AgGridReact
            rowHeight={25}
            headerHeight={25}
            theme={getInvoiceViewGridTheme(theme, {
              headerBackgroundColor: theme.palette.background.default,
              fontSize: 14,
            })}
            columnDefs={[
              {
                field: "date_formatted",
                headerName: "Date",
              },
              {
                field: "voucher_no",
                headerName: "Voucher",
              },
              {
                field: "destination.account_name",
                headerName: "Account",

                flex: 1.2,
              },
              {
                field: "supplier.name",
                headerName: "Supplier",
              },
              {
                field: "amount_formatted",
                flex: 0.8,
                headerName: "Amount",
                cellClass: "!text-right font-bold",
              },
            ]}
            defaultColDef={{ flex: 1 }}
            rowData={data ? [...data.transactions, totalRow as any] : []}
          />
          <PaginationBar
            pagination={data?.pagination}
            onLimitChange={(value) => setQuery((pre) => ({ ...pre, ...value }))}
            onPageChange={(value) => setQuery((pre) => ({ ...pre, ...value }))}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default ExpensesReport;
