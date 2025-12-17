"use client";
import { useCustomerSocket } from "@/hooks/useCustomerSocket";
import { getGridTheme } from "@/theme/ag-grid/grid-theme";
import {
  alpha,
  Box,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useParams } from "next/navigation";
import { customerStatementColDef } from "./colDef";
import RefreshLoading from "@/components/Loading/RefreshLoading";
import { useFetchMyOrganizationQuery } from "@/services/organization";
import DateRangeSelector from "@/components/DateRangeSelector";
import { CustomerStatementQueryType } from "@/types/customer";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import ExcellButton from "@/components/buttons/ExcellButton";
import { PaginationBar } from "@/components/pagination/paginationBar";
import exportFromJSON from "export-from-json";
import { useGetSupplierStatementQuery } from "@/services/suppliers";
import ToolBarStyled from "@/components/styled/ToolBar";
import { useState } from "react";
import { thisYearRange } from "@/utils/date-ranges";
import { BlobProvider } from "@react-pdf/renderer";
import SupplierStatementPDFDoc from "./pdf/statementPdfDoc";
import Link from "next/link";
import IconButtonStyled from "@/components/styled/IconButton";
import { Icons } from "@/components/icons";

function SupplierStatement() {
  const { id } = useParams();
  const theme = useTheme();
  const { data: organization } = useFetchMyOrganizationQuery(null);

  const [query, setQuery] = useState<CustomerStatementQueryType>({
    page: 1,
    limit: 100,
    start_date: thisYearRange.start_date,
    end_date: thisYearRange.end_date,
    label: thisYearRange.label,
    expand: "yes",
  });

  const { data, refetch, isFetching } = useGetSupplierStatementQuery({
    query: { ...query },
    id: id as string,
  });
  useCustomerSocket({ trigger: refetch });

  if (!data || !organization) {
    return <></>;
  }

  const handleQueryChange = (params: CustomerStatementQueryType) => {
    setQuery((p) => {
      return { ...p, ...params };
    });
  };
  const rows = data?.data.transactions;

  const pagination = data?.pagination;
  const isPrintable =
    !rows || !Boolean(rows.length) || pagination?.totalDocuments == 0;
  const handleExport = () => {
    if (isPrintable) {
      return alert("No Data Found For Export");
    }

    const fileName = `${data.data.supplier.name} / transactions`;

    if (pagination?.totalPages !== 1) {
      return alert(
        `Total Doc Row = "${pagination?.totalDocuments}", \n But Limit = "${pagination?.limit}", \n For Export increase the "Limit"`,
      );
    }

    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data: rows, fileName, exportType });
  };
  return (
    <Box mx={1} mt={1}>
      <RefreshLoading isLoading={isFetching} />
      <ToolBarStyled>
        <Typography variant="h6">{data.data.supplier.name}</Typography>
        <Stack
          my={1}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          spacing={1}
        >
          <DateRangeSelector
            onChange={handleQueryChange}
            selected={query.label || ""}
            start_date={query.start_date}
            end_date={query.end_date}
          />
          {isFetching ? null : (
            <BlobProvider
              document={
                <SupplierStatementPDFDoc
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
          <Tooltip title="Make Payment">
            <Link href={`/v1/purchase/suppliers/${id}/payment`}>
              <IconButtonStyled size="xs" color="secondary">
                <Icons.Add />
              </IconButtonStyled>
            </Link>
          </Tooltip>
        </Stack>
      </ToolBarStyled>
      <Box height={`calc(100vh - 155px)`} mt={1}>
        <AgGridReact
          rowHeight={25}
          headerHeight={25}
          theme={getGridTheme(theme, {
            oddRowBackgroundColor: alpha(theme.palette.background.default, 0.5),
            wrapperBorderRadius: `0 0 0 0`,
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

export default SupplierStatement;
