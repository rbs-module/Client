"use client";

import { alpha, Box, useTheme } from "@mui/material";
import { AgGridReact } from "ag-grid-react";

import { getGridTheme } from "@/theme/ag-grid/grid-theme";
import { ordersColDef } from "./colDef";
import { PaginationBar } from "../../../components/pagination/paginationBar";
import { OrdersNav } from "./nav";
import { useOrdersTable } from "../hooks/useOrdersTable";
import { GridReadyEvent } from "ag-grid-community";
import { useFetchMeQuery } from "@/services/user";

function OrdersTable() {
  const {
    orders,
    handleQueryChange,
    handleRowSelection,
    loading,
    pagination,
    onCellValueChanged,
    selectedRows,
  } = useOrdersTable();
  const theme = useTheme();
  const { data: user } = useFetchMeQuery("");
  const onGridReady = (params: GridReadyEvent) => {
    const { api } = params;
    if (user && !user?.role.some((role) => ["admin", "user"].includes(role))) {
      api.setColumnsVisible(["rate"], false);
    }
  };

  const data = orders.map((item) => ({ ...item }));
  return (
    <Box
      sx={{
        height: "calc(100vh - 150px)",
        width: "100%",
        px: theme.spacing(1),
      }}
    >
      <title>RBS | Orders</title>
      <OrdersNav
        handleQueryChange={handleQueryChange}
        selectedRows={selectedRows}
      />
      <style>{`.ag-select-list { background: ${theme.palette.background.paper} }`}</style>
      <AgGridReact
        headerHeight={35}
        onRowSelected={handleRowSelection}
        getRowId={(x) => x.data._id}
        loading={loading}
        theme={getGridTheme(theme, {
          backgroundColor: alpha(theme.palette.background.paper, 0.2),
        })}
        rowSelection={{ mode: "multiRow" }}
        className="h-full"
        animateRows
        rowData={data}
        columnDefs={ordersColDef}
        pagination={false}
        paginationPageSize={50}
        infiniteInitialRowCount={500}
        rowHeight={50}
        onCellEditingStopped={onCellValueChanged}
        colResizeDefault="shift"
        onGridReady={onGridReady}
        defaultColDef={{
          minWidth: 80,
          flex: 1,
          valueSetter: () => false,
          cellStyle: {
            height: "100%",
            display: "flex",
            alignItems: "center",
            // paddingX: 1,
          },
        }}
      />

      <Box sx={{ bgcolor: "background.paper" }}>
        <PaginationBar
          pagination={pagination}
          onPageChange={handleQueryChange}
          onLimitChange={handleQueryChange}
        />
      </Box>
    </Box>
  );
}

export { OrdersTable };
