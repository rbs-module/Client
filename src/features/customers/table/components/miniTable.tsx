"use client";
// ====== mui components===============>>
import { useTheme } from "@mui/material";

// ====== grid module==================>>
import { AgGridReact } from "ag-grid-react";
import { getSideBarGridTheme } from "@/theme/ag-grid/grid-theme";

// ====== own components==================>>
import { customersColDefMini } from "./colDef";
import useCustomersHook from "../hooks/useCustomersHook";
import type { Customer } from "@/types/customer";
import { useRef } from "react";
import { useParams } from "next/navigation";

import useSidebarSelection from "@/hooks/useSidebarSelection";
import RefreshLoading from "@/components/Loading/RefreshLoading";
import { MiniNav } from "@/components/MiniNav";
import ExcelButton from "@/components/buttons/ExcellButton";

function CustomersTableMini() {
  const activePage = useParams();
  const customerId = activePage.id as string;

  const { customers, isLoading, handleSearch, query, refetch, handleExport } =
    useCustomersHook();

  const gridRef = useRef<AgGridReact<Customer> | null>(null);
  const { onRowSelected, onGridReady, onRowClicked } = useSidebarSelection({
    rowData: customers,
    id: customerId,
    gridRef,
    keyId: "_id",
    getPushLink: ({ _id }) => `/v1/sales/customers/${_id}`,
  });
  const theme = useTheme();

  return (
    <>
      <style>{`
      .ag-row-selected { border-left: 4px solid ${theme.palette.primary.main} } 
    `}</style>

      <MiniNav
        title="Customers"
        handleSearch={handleSearch}
        createLink="/v1/sales/customers/create"
        searchValue={query.search}
        handleRefresh={refetch}
        extendItem={<ExcelButton onClick={handleExport} />}
      />
      <RefreshLoading isLoading={isLoading} />
      <AgGridReact
        theme={getSideBarGridTheme(theme)}
        ref={gridRef}
        rowData={customers}
        columnDefs={customersColDefMini()}
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

export { CustomersTableMini };
