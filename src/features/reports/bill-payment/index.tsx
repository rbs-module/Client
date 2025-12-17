"use client";
import ExcelButton from "@/components/buttons/ExcellButton";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import DateRangeSelector from "@/components/DateRangeSelector";
import ToolBarStyled from "@/components/styled/ToolBar";
import { useBillPaymentQuery } from "@/store/reports/api";
import { getInvoiceViewGridTheme } from "@/theme/ag-grid/grid-theme";
import {
  prevMonthRange,
  prevYearRange,
  thisMonthRange,
  thisYearRange,
} from "@/utils/date-ranges";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { BlobProvider } from "@react-pdf/renderer";
import { AgGridReact } from "ag-grid-react";
import exportFromJSON from "export-from-json";
import { useState } from "react";
import BillPaymentReportPdf from "./pdf";
import { useFetchMyOrganizationQuery } from "@/services/organization";
import Link from "next/link";
import IconButtonStyled from "@/components/styled/IconButton";
import { Icons } from "@/components/icons";

function BillPaymentReport() {
  const [query, setQuery] = useState({
    ...thisMonthRange,
  });
  const { data: organization } = useFetchMyOrganizationQuery(null);
  const { data, refetch, isFetching } = useBillPaymentQuery(query);

  const theme = useTheme();

  const handleExport = () => {
    const rows = data ? [...data.report, data.totals] : [];
    const fileName = `Bill Payment Report`;
    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data: rows, fileName, exportType });
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
                <BillPaymentReportPdf
                  rows={data ? [...data.report, data.totals] : []}
                  organization={organization}
                  {...query}
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
            ranges={[
              thisMonthRange,
              thisYearRange,
              prevMonthRange,
              prevYearRange,
            ]}
            onChange={setQuery}
          />
        </Stack>
      </ToolBarStyled>
      <Box mt={1}>
        <Box sx={{ height: "calc(100vh - 113px)" }}>
          <AgGridReact
            rowHeight={25}
            headerHeight={25}
            theme={getInvoiceViewGridTheme(theme, {
              headerBackgroundColor: theme.palette.background.default,
              fontSize: 14,
            })}
            columnDefs={[
              {
                field: "name",
                cellClass: `text-left `,
                valueFormatter: ({ value }) => value ?? "Total",
              },
              { field: "bill_formatted", headerName: "Bill" },
              { field: "payment_formatted", headerName: "Payment" },
              {
                field: "balance_formatted",
                headerName: "Balance",
                cellStyle: { fontWeight: "bold" },
              },
            ]}
            defaultColDef={{
              flex: 1,
              resizable: false,
              cellClass: ({ data }) => [
                `${!data?.name ? "font-bold " : ""}`,
                `text-right`,
              ],
            }}
            rowData={data ? [...data.report, data.totals] : []}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default BillPaymentReport;
