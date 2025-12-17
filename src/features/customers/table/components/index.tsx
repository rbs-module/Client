"use client";
// ====== mui components===============>>
import { Box, useTheme } from "@mui/material";

// ====== grid module==================>>
import { AgGridReact } from "ag-grid-react";
import { getGridTheme } from "@/theme/ag-grid/grid-theme";

// ====== own components==================>>
import { PaginationBar } from "@/components/pagination/paginationBar";
import { CustomersNav } from "./Nav";
import { customersColDef } from "./colDef";
import useCustomersHook from "../hooks/useCustomersHook";
import RefreshLoading from "@/components/Loading/RefreshLoading";

function CustomersTable() {
  const { customers, pagination, handleUpdate, isLoading } = useCustomersHook();

  const theme = useTheme();
  return (
    <Box
      sx={(theme) => ({
        height: "calc(100vh - 150px)",
        width: "100%",
        px: theme.spacing(1),
        position: "relative",
      })}
    >
      <CustomersNav />
      <RefreshLoading isLoading={isLoading} className="top-32" />
      <AgGridReact
        rowData={customers}
        columnDefs={customersColDef()}
        theme={getGridTheme(theme)}
        defaultColDef={{ flex: 1, valueSetter: () => false }}
        headerHeight={40}
        onCellEditingStopped={handleUpdate}
      />
      <Box sx={{ bgcolor: "background.default" }}>
        <PaginationBar pagination={pagination} />
      </Box>
    </Box>
  );
}

export { CustomersTable };
