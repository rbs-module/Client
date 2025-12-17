"use  client";
import useSidebarSelection from "@/hooks/useSidebarSelection";
import { PaymentType } from "@/zod-schemas/Payment";
import { AgGridReact } from "ag-grid-react";
import { useParams } from "next/navigation";
import React, { useRef } from "react";
import usePayments from "../hooks/usePayments";
import { useTheme } from "@mui/material";
import { MiniNav } from "@/components/MiniNav";
import DateRangeSelector from "@/components/DateRangeSelector";
import RefreshLoading from "@/components/Loading/RefreshLoading";
import { getSideBarGridTheme } from "@/theme/ag-grid/grid-theme";
import { PaginationBarMini } from "@/components/pagination/paginationBarMini";
import { paymentsColDef } from "./colDef";
import ExcelButton from "@/components/buttons/ExcellButton";

function PaymentsTable() {
  const {
    payments,
    isLoading,
    query,
    pagination,
    handleExport,
    refetch,
    handleQueryChange,
  } = usePayments();

  const theme = useTheme();
  const gridRef = useRef<AgGridReact<PaymentType> | null>(null);
  const activePage = useParams();
  const paymentId = activePage.id as string;

  const { onGridReady, onRowClicked, onRowSelected } = useSidebarSelection({
    rowData: payments || [],
    gridRef,
    id: paymentId,
    keyId: "_id",
    getPushLink: ({ _id }) => `/v1/sales/payment-received/${_id}`,
  });

  return (
    <>
      <style>{`
      .ag-row-selected { border-left: 4px solid ${theme.palette.primary.main} } 
    `}</style>

      <MiniNav
        isRefreshing={isLoading}
        title="Payments"
        handleSearch={(search) => handleQueryChange({ search })}
        createLink="/v1/sales/payment-received/create"
        searchValue={query.search}
        handleRefresh={refetch}
        extendItem={
          <>
            <ExcelButton onClick={handleExport} />
            <DateRangeSelector
              showLabel={false}
              onChange={handleQueryChange}
              selected={query.label || ""}
              start_date={query.start_date}
              end_date={query.end_date}
            />
          </>
        }
      />

      <RefreshLoading isLoading={isLoading} />
      <AgGridReact
        theme={getSideBarGridTheme(theme)}
        ref={gridRef}
        rowData={payments}
        columnDefs={paymentsColDef}
        onGridReady={onGridReady}
        rowHeight={80}
        onRowClicked={onRowClicked}
        onRowSelected={onRowSelected}
        rowSelection={{
          mode: "singleRow",
          checkboxes: false,
        }}
        defaultColDef={{ flex: 1, resizable: false }}
      />
      <PaginationBarMini
        pagination={pagination}
        onPageChange={handleQueryChange}
      />
    </>
  );
}

export default PaymentsTable;
