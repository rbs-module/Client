"use client";
import DateRangeSelector from "@/components/DateRangeSelector";
import RefreshLoading from "@/components/Loading/RefreshLoading";
import { MiniNav } from "@/components/MiniNav";
import { PaginationBarMini } from "@/components/pagination/paginationBarMini";
import useSidebarSelection from "@/hooks/useSidebarSelection";
import { useGetExpensesQuery } from "@/services/expenses";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getSideBarGridTheme } from "@/theme/ag-grid/grid-theme";
import { DefaultQueryParamsDTOType } from "@/zod-schemas/default-query-paramsDTO";
import { useTheme } from "@mui/material";

import { AgGridReact } from "ag-grid-react";
import { useParams } from "next/navigation";
import React, { useRef } from "react";
import { expenseColDef, expenseDefaultColDef } from "./colDef";
import { TransactionFormatted } from "@/types/Transaction";
import exportFromJSON from "export-from-json";
import ExcelButton from "@/components/buttons/ExcellButton";

function ExpenseTable() {
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.expenses.query);
  const { data, isFetching, isLoading, refetch } = useGetExpensesQuery(query);

  const activePage = useParams();
  const orderId = activePage.id as string;

  const gridRef = useRef<AgGridReact<TransactionFormatted> | null>(null);
  const { onGridReady, onRowClicked, onRowSelected } = useSidebarSelection({
    rowData: data?.transactions || [],
    gridRef,
    id: orderId,
    keyId: "_id",
    getPushLink: ({ _id }) => `/v1/purchase/expenses/${_id}`,
  });
  const theme = useTheme();

  const handleQueryChange = (
    queryParams: Partial<DefaultQueryParamsDTOType>,
  ) => {
    dispatch({
      type: "expenses/setExpensesQuery",
      payload: queryParams,
    });
  };

  const handleExport = () => {
    const pagination = data?.pagination;
    const expenses = data?.transactions;
    if (!expenses || !Boolean(data.transactions.length)) {
      return alert("No Data Found For Export");
    }

    const fileName = `Expenditure`;

    if (pagination?.totalPages !== 1) {
      return alert(
        `Total Doc Row = "${pagination?.totalDocuments}", \n But Limit = "${pagination?.limit}", \n For Export increase the "Limit"`,
      );
    }
    const excelData = expenses.map((item) => {
      const { date_formatted, voucher_no, destination, description, amount } =
        item;
      return {
        date_formatted,
        voucher_no,
        account: destination.account_name,
        description,
        amount,
      };
    });

    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data: excelData, fileName, exportType });
  };

  return (
    <>
      <style>{`
      .ag-row-selected { border-left: 4px solid ${theme.palette.primary.main} } 
    `}</style>

      <MiniNav
        searchAble={false}
        isRefreshing={isFetching || isLoading}
        title="Expenses"
        handleSearch={() => {}}
        createLink="/v1/purchase/expenses/create"
        searchValue={""}
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

      <RefreshLoading isLoading={isLoading || isFetching} />
      <AgGridReact
        theme={getSideBarGridTheme(theme)}
        ref={gridRef}
        rowData={data?.transactions || []}
        columnDefs={expenseColDef}
        onGridReady={onGridReady}
        onRowClicked={onRowClicked}
        onRowSelected={onRowSelected}
        defaultColDef={expenseDefaultColDef}
        rowHeight={80}
        rowSelection={{
          mode: "singleRow",
          checkboxes: false,
        }}
      />
      <PaginationBarMini
        pagination={data?.pagination}
        onPageChange={handleQueryChange}
      />
    </>
  );
}

export default ExpenseTable;
