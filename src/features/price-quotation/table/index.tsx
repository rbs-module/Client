"use client";
import RefreshLoading from "@/components/Loading/RefreshLoading";
import { MiniNav } from "@/components/MiniNav";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getSideBarGridTheme } from "@/theme/ag-grid/grid-theme";
import { useTheme } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useRef } from "react";
import { invoiceColDef } from "./components/colDef";
import useSidebarSelection from "@/hooks/useSidebarSelection";
import { FindInvoicesQueryType, InvoiceType } from "@/zod-schemas/invoice";
import DateRangeSelector from "../../../components/DateRangeSelector";
import { PaginationBarMini } from "@/components/pagination/paginationBarMini";
import { useParams } from "next/navigation";
import { _arrSum } from "@/utils/arrSum";
import { numberWithCommas } from "@/utils/currency-formatter";

import { useGetPriceQuotationsQuery } from "@/services/price-quotation";

function PriceQuotationTable() {
  const query = useAppSelector((state) => state.priceQut.query);

  const dispatch = useAppDispatch();
  const { data, refetch, isLoading, isFetching } =
    useGetPriceQuotationsQuery(query);
  const totalAmount = _arrSum(data?.quotations ?? [], "amount");

  const invoices = data?.quotations ?? ([] as InvoiceType[]);

  const gridRef = useRef<AgGridReact<InvoiceType> | null>(null);
  const activePage = useParams();
  const invoiceId = activePage.id as string;

  const { onGridReady, onRowClicked, onRowSelected } = useSidebarSelection({
    rowData: invoices,
    gridRef,
    id: invoiceId,
    keyId: "_id",
    getPushLink: ({ _id }) => `/v1/sales/price-quotation/${_id}`,
  });
  const theme = useTheme();

  const handleQueryChange = (queryParams: Partial<FindInvoicesQueryType>) => {
    dispatch({
      type: "priceQut/setPriceQuotationQuery",
      payload: queryParams,
    });
  };

  const handleSearch = (search: string) => {
    handleQueryChange({ search });
  };

  return (
    <>
      <style>{`
      .ag-row-selected { border-left: 4px solid ${theme.palette.primary.main} } 
    `}</style>

      <MiniNav
        isRefreshing={isFetching || isLoading}
        title="Price Quotation"
        handleSearch={handleSearch}
        createLink="/v1/sales/price-quotation/create"
        searchValue={query.search}
        handleRefresh={refetch}
        extendItem={
          <>
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

      <RefreshLoading isLoading={isLoading || isFetching} />
      <AgGridReact
        theme={getSideBarGridTheme(theme)}
        ref={gridRef}
        rowData={invoices}
        columnDefs={invoiceColDef}
        onGridReady={onGridReady}
        rowHeight={80}
        onRowClicked={onRowClicked}
        onRowSelected={onRowSelected}
        rowSelection={{
          mode: "singleRow",
          checkboxes: false,
        }}
      />
      <PaginationBarMini
        pagination={data?.pagination}
        onPageChange={handleQueryChange}
      />
      <div className="absolute bottom-3 left-3 backdrop-blur-sm">
        <strong>Total = {numberWithCommas(totalAmount)}</strong>
      </div>
    </>
  );
}

export default PriceQuotationTable;
