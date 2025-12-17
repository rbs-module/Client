"use client";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useParams } from "next/navigation";
import { AgGridReact } from "ag-grid-react";

import { getGridTheme } from "@/theme/ag-grid/grid-theme";
import { useState } from "react";
import { FindTransactionsQueryType } from "@/zod-schemas/accounts/find-transactions";
import { useGetSupplierTransactionsQuery } from "@/services/suppliers";
import ToolBarStyled from "@/components/styled/ToolBar";
import { thisYearRange } from "@/utils/date-ranges";
import { PaginationBar } from "@/components/pagination/paginationBar";
import exportFromJSON from "export-from-json";
import {
  SupplierTransactionColDef,
  SupplierTransactionDefaultColDef,
} from "./colDef";
import ExcelButton from "@/components/buttons/ExcellButton";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import DateRangeSelector from "@/components/DateRangeSelector";

import { Icons } from "@/components/icons";
import IconButtonStyled from "@/components/styled/IconButton";
import Link from "next/link";
import { useMenu } from "@/hooks/useMenu";
function SupplierTransactions() {
  const activePage = useParams();
  const id = activePage.id as string;
  const theme = useTheme();
  const [query, setQuery] = useState<Partial<FindTransactionsQueryType>>({
    limit: 100,
    ...thisYearRange,
    expand: "no",
    isDeu: "false",
  });

  const { data, isFetching, refetch } = useGetSupplierTransactionsQuery({
    id,
    query,
  });

  const handleQueryChange = (newQuery: Partial<FindTransactionsQueryType>) => {
    setQuery((prev) => ({ ...prev, ...newQuery }));
  };
  const handleExport = () => {
    const rows = data?.transactions;
    const pagination = data?.pagination;
    if (!rows || !Boolean(rows.length) || pagination?.totalDocuments == 0) {
      return alert("No Data Found For Export");
    }

    const fileName = `Supplier Transactions`;

    if (pagination?.totalPages !== 1) {
      return alert(
        `Total Doc Row = "${pagination?.totalDocuments}", \n But Limit = "${pagination?.limit}", \n For Export increase the "Limit"`,
      );
    }

    const excelData = rows.map((item) => ({
      Date: item.date_formatted,
      No: item.voucher_no,
      Source: item.source.account_name,
      Destination: item.destination.account_name,
      Type: item.type,
      Descriptions: item.description,
      "Customer/Supplier": item?.customer?.name || item?.supplier?.name || "",
      "Created By": item?.createdBy?.name,
      Amount: item.amount_formatted,
      Reference: item.sl_no || "",
    }));

    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data: excelData, fileName, exportType });
  };
  const { anchorEl, handleClose, handleOpen, open } = useMenu();
  return (
    <Box
      maxHeight={"calc(100vh - 150px)"}
      minHeight={`calc(100vh - 150px)`}
      height={Number(data?.transactions.length) * 25 + 80}
    >
      <title>{data?.supplier.name}</title>
      <ToolBarStyled sx={{ my: 1 }}>
        <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>
          {data?.supplier.name}
        </Typography>
        <Stack direction={"row"} spacing={2}>
          <Tooltip title="Deu Transactions">
            <IconButtonStyled
              color={query.isDeu == "true" ? "primary" : "secondary"}
              onClick={() => {
                setQuery((prev) => ({
                  ...prev,
                  isDeu: prev.isDeu !== "true" ? "true" : "false",
                }));
              }}
              size="xs"
            >
              {query.isDeu === "false" ? (
                <Icons.CheckBoxOutlineBlankRoundedIcon />
              ) : (
                <Icons.DoneAllIcon />
              )}
            </IconButtonStyled>
          </Tooltip>
          <Tooltip title="Deu Transactions">
            <Button onClick={handleOpen}>Hallo</Button>
          </Tooltip>
          <Tooltip title="Export">
            <ExcelButton onClick={handleExport} />
          </Tooltip>
          <Tooltip title="Export">
            <Link href={`/v1/purchase/suppliers/${id}/payment`}>
              <IconButtonStyled size="xs" color="secondary">
                <Icons.Add />
              </IconButtonStyled>
            </Link>
          </Tooltip>
          <Tooltip title="Refresh">
            <RefreshButton loading={isFetching} onClick={refetch} />
          </Tooltip>
          <Tooltip title="Select Date Range">
            <DateRangeSelector
              onChange={handleQueryChange}
              start_date={query.start_date}
              end_date={query.end_date}
              selected={query.label || ""}
            />
          </Tooltip>
        </Stack>
      </ToolBarStyled>
      <Menu onClose={handleClose} open={open} anchorEl={anchorEl}>
        <Box onMouseLeave={handleClose}>
          <MenuItem>All</MenuItem>
          <MenuItem>PURCHASE</MenuItem>
        </Box>
      </Menu>
      <AgGridReact
        rowData={data?.transactions}
        columnDefs={SupplierTransactionColDef}
        headerHeight={30}
        rowHeight={25}
        defaultColDef={SupplierTransactionDefaultColDef}
        theme={getGridTheme(theme)}
      />
      <PaginationBar pagination={data?.pagination} />
    </Box>
  );
}

export default SupplierTransactions;
