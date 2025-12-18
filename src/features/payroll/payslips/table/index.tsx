"use client";
import { PaginationBar } from "@/components/pagination/paginationBar";
import { useGetPayslipsQuery, useUpdatePayslipMutation } from "@/store/payroll";
import { getGridTheme } from "@/theme/ag-grid/grid-theme";
import { PayslipData } from "@/types/payroll";
import { Box, useTheme } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { PayslipDefaultColDef, PayslipsColDef } from "./colDef";
import toast from "react-hot-toast";
import { CellEditingStoppedEvent } from "ag-grid-community";
import { usePayrollStore } from "@/store/payroll/hooks";
import PayslipNav from "./Nav";

function PayslipTable() {
  const { setFindPayslipQuery: handleQueryChange, findPayslipQuery: query } =
    usePayrollStore();
  const { data, refetch, isFetching, isLoading } = useGetPayslipsQuery(query);

  const theme = useTheme();
  const [updatePayslip] = useUpdatePayslipMutation();
  const onCellValueChanged = async ({
    oldValue,
    newValue,
    data,
    colDef,
  }: CellEditingStoppedEvent<PayslipData>) => {
    try {
      if (oldValue == newValue) {
        return;
      }
      const field = colDef.field as keyof PayslipData;
      const id = data?._id || "";
      const { error: updateError } = await updatePayslip({
        id,
        body: { [field]: newValue },
      });

      if (updateError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err: any = updateError;
        const errors = err.data.errors;
        const msg = err.data.message;
        toast.error(msg || "Failed to update the data");
        errors?.forEach((error: { message: string }) => {
          toast.error(error.message);
        });
      } else {
        refetch();
        toast.success(`update success`);
      }
    } catch (error) {
      console.error("Failed to update the data:", error);
    }
  };

  return (
    <Box
      mx={1}
      mt={1}
      maxHeight={"calc(100vh - 150px)"}
      minHeight={`calc(100vh - 293px)`}
      height={Number(data?.payslips.length) * 25 + 80}
      minWidth={"1000px"}
    >
      <PayslipNav />

      <AgGridReact
        containerStyle={{ minWidth: "1000px" }}
        loading={isFetching || isLoading}
        rowData={data?.payslips}
        columnDefs={PayslipsColDef}
        headerHeight={30}
        rowHeight={30}
        defaultColDef={PayslipDefaultColDef}
        theme={getGridTheme(theme)}
        onCellEditingStopped={onCellValueChanged}
      />

      <PaginationBar
        onLimitChange={handleQueryChange}
        onPageChange={handleQueryChange}
        pagination={data?.pagination}
      />
    </Box>
  );
}

export default PayslipTable;
