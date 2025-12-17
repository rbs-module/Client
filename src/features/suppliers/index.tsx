"use client";
// ====== mui components===============>>
import { useTheme } from "@mui/material";

// ====== grid module==================>>
import { AgGridReact } from "ag-grid-react";
import { getSideBarGridTheme } from "@/theme/ag-grid/grid-theme";

// ====== own components==================>>
import { supplierColDef } from "./colDef";

import type { Customer } from "@/types/customer";
import { useRef } from "react";
import { useParams } from "next/navigation";

import useSidebarSelection from "@/hooks/useSidebarSelection";
import RefreshLoading from "@/components/Loading/RefreshLoading";
import { MiniNav } from "@/components/MiniNav";
import ExcelButton from "@/components/buttons/ExcellButton";
import useSuppliersTable from "./useSuppliersHook";

function SuppliersTable() {
  const activePage = useParams();
  const customerId = activePage.id as string;

  const {
    suppliers: customers,
    isLoading,
    handleSearch,
    query,
    refetch,
    handleExport,
  } = useSuppliersTable();

  const gridRef = useRef<AgGridReact<Customer> | null>(null);
  const { onRowSelected, onGridReady, onRowClicked } = useSidebarSelection({
    rowData: customers,
    id: customerId,
    gridRef,
    keyId: "_id",
    getPushLink: ({ _id }) => `/v1/purchase/suppliers/${_id}`,
  });
  const theme = useTheme();

  return (
    <>
      <title>RBS | Suppliers</title>
      <style>{`
      .ag-row-selected { border-left: 4px solid ${theme.palette.primary.main} } 
    `}</style>

      <MiniNav
        title="Suppliers"
        handleSearch={handleSearch}
        createLink="/v1/purchase/suppliers/create"
        searchValue={query.search}
        handleRefresh={refetch}
        extendItem={<ExcelButton onClick={handleExport} />}
      />
      <RefreshLoading isLoading={isLoading} />
      <AgGridReact
        theme={getSideBarGridTheme(theme)}
        ref={gridRef}
        rowData={customers}
        columnDefs={supplierColDef}
        onGridReady={onGridReady}
        rowHeight={45}
        onRowClicked={onRowClicked}
        onRowSelected={onRowSelected}
        rowSelection={{
          mode: "singleRow",
          checkboxes: false,
        }}
      />
    </>
  );
}

export default SuppliersTable;
