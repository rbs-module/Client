"use client";
import { Icons } from "@/components/icons";
import IconButtonStyled from "@/components/styled/IconButton";
import { useCustomerSocket } from "@/hooks/useCustomerSocket";
import { useGetCustomerStatementQuery } from "@/services/customers";
import { getInvoiceViewGridTheme } from "@/theme/ag-grid/grid-theme";
import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useParams } from "next/navigation";
import { customerStatementColDef } from "./colDef";
import RefreshLoading from "@/components/Loading/RefreshLoading";
import { BlobProvider } from "@react-pdf/renderer";
import CustomerStatementPDFDoc from "./pdf/statementPdfDoc";
import Link from "next/link";
import { useFetchMyOrganizationQuery } from "@/services/organization";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import DateRangeSelector from "@/components/DateRangeSelector";
import { CustomerStatementQueryType } from "@/types/customer";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import ExcellButton from "@/components/buttons/ExcellButton";
import { PaginationBar } from "@/components/pagination/paginationBar";
import exportFromJSON from "export-from-json";

function CustomerStatement() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const theme = useTheme();
  const { data: organization } = useFetchMyOrganizationQuery(null);
  const query = useAppSelector((state) => state.customer.statementQuery);
  const { data, refetch, isFetching } = useGetCustomerStatementQuery({
    query,
    id: id as string,
  });
  useCustomerSocket({ trigger: refetch });

  if (!data || !organization) {
    return <></>;
  }

  const handleQueryChange = (params: CustomerStatementQueryType) => {
    dispatch({
      type: "customer/setStatementQuery",
      payload: params,
    });
  };

  const handleExport = () => {
    const rows = data?.data.transactions;
    const pagination = data?.pagination;
    if (!rows || !Boolean(rows.length) || pagination?.totalDocuments == 0) {
      return alert("No Data Found For Export");
    }

    const fileName = `${data.data.customer.name} / transactions`;

    if (pagination?.totalPages !== 1) {
      return alert(
        `Total Doc Row = "${pagination?.totalDocuments}", \n But Limit = "${pagination?.limit}", \n For Export increase the "Limit"`,
      );
    }

    const excelData = rows.map((item) => ({
      ...item,
      // date: item.date_formatted,
      // type: item.type,
      // description: item.description,
      // source: item.source.account_name,
      // destination: item.destination.account_name,
      // amount: item.amount,
      // createdBy: item?.createdBy?.name,
    }));

    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data: excelData, fileName, exportType });
  };
  return (
    <Box mx={1} mt={1}>
      <RefreshLoading isLoading={isFetching} />
      <Stack
        my={1}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="subtitle1">Transactions</Typography>
        <Stack direction={"row"} spacing={2}>
          <DateRangeSelector
            onChange={handleQueryChange}
            selected={query.label || ""}
            start_date={query.start_date}
            end_date={query.end_date}
          />

          {isFetching ? null : (
            <BlobProvider
              document={
                <CustomerStatementPDFDoc
                  pageData={data}
                  organization={organization}
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
          <ExcellButton onClick={handleExport} />
          <RefreshButton onClick={refetch} loading={isFetching} />
        </Stack>
      </Stack>
      <Box height={`calc(100vh - 238px)`}>
        <AgGridReact
          rowHeight={25}
          headerHeight={25}
          theme={getInvoiceViewGridTheme(theme, {
            oddRowBackgroundColor: alpha(theme.palette.background.default, 0.5),
          })}
          rowData={[...data.data.transactions]}
          columnDefs={customerStatementColDef}
          defaultColDef={{
            flex: 1,
            resizable: false,
            cellClass: ({ data, value }) => [
              `${data?.type == "settlement" ? "text-red-600" : ""}`,
              ` ${typeof value == "number" ? "text-right " : ""}`,
              ` ${data?.type == "custom" ? "font-bold" : ""}`,
            ],
          }}
        />
        <Box
          sx={{
            border: 1,
            borderTop: 0,
            borderColor: "divider",
            bgcolor: "background.default",
          }}
        >
          <PaginationBar
            pagination={data.pagination}
            onPageChange={handleQueryChange}
            onLimitChange={handleQueryChange}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default CustomerStatement;
