"use client";
import { Icons } from "@/components/icons";
import { NoData } from "@/components/no-data/NoData";
import { PaginationBar } from "@/components/pagination/paginationBar";
import Row from "@/components/Row";
import IconButtonStyled from "@/components/styled/IconButton";
import ToolBarStyled from "@/components/styled/ToolBar";
import DataTable from "@/components/Table";
import { EditableOnChangeArg } from "@/components/Table/types";
import {
  useGetEmployeeByIdQuery,
  useGetPayslipsByEmployeeIdQuery,
  useUpdatePayslipMutation,
} from "@/store/payroll";
import { PayslipData } from "@/types/payroll";
import { numberWithCommas } from "@/utils/currency-formatter";
import { DefaultQueryParamsDTOType } from "@/zod-schemas/default-query-paramsDTO";
import { Box, Tooltip } from "@mui/material";
import { format, addMonths, compareDesc } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

function EmployeePayslipTable() {
  const activePage = useParams();
  const id = activePage.id;

  const [query, setQuery] = useState<Partial<DefaultQueryParamsDTOType>>({
    sort_key: "month",
    sort_type: "desc",
    limit: 10,
    expand: "yes",
  });

  const { data: employee } = useGetEmployeeByIdQuery(String(id));

  const { data, refetch } = useGetPayslipsByEmployeeIdQuery({
    id: `${id}`,
    query,
  });

  const handleQueryChange = (q: Partial<DefaultQueryParamsDTOType>) => {
    setQuery((p) => ({ ...p, ...q }));
  };

  const [updatePayslip] = useUpdatePayslipMutation();

  const isCellEditable = (month: string) => {
    const isEditable = compareDesc(
      format(new Date(), "yyyy-MM"),
      format(addMonths(month, 1), "yyyy-MM"),
    );
    return isEditable == -1;
  };
  const onCellValueChanged = async ({
    value,
    fieldName,
    data,
  }: EditableOnChangeArg<PayslipData>) => {
    try {
      if (isCellEditable(data?.month || "")) {
        alert("!Data not editable");
        return;
      }

      const id = data?._id || "";
      const { error: updateError } = await updatePayslip({
        id,
        body: { [fieldName]: value },
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
    <Box>
      <ToolBarStyled sx={{ fontWeight: 700 }}>
        {employee?.name} / Payslips
      </ToolBarStyled>
      <Box>
        {data?.payslips.length == 0 ? (
          <NoData subTitle={"change query for get data"} />
        ) : (
          <DataTable
            rowData={data?.payslips}
            onChangeCellValue={onCellValueChanged}
            colDef={[
              { field: "month", getTextStyle: () => ({ textAlign: "center" }) },
              {
                field: "present_days",
                headerName: "Present",
                formatter: ({ value }) => `${value} Days`,
                isEditable: ({ data }) =>
                  Boolean(data?._id && !isCellEditable(data.month)),
              },
              {
                field: "absent_days",
                headerName: "Absent",
                formatter: ({ value }) => `${value} Days`,
              },
              {
                field: "leave_days",
                headerName: "Leave",
                formatter: ({ value }) => `${value} Days`,
                isEditable: ({ data }) =>
                  Boolean(data?._id && !isCellEditable(data.month)),
              },
              {
                field: "overtime_hours",
                headerName: "Overtime",
                formatter: ({ value }) => `${value} Hours`,
                isEditable: ({ data }) =>
                  Boolean(data?._id && !isCellEditable(data.month)),
              },
              {
                field: "overtimePay",
                headerName: "OT TK",
                formatter: ({ value }) =>
                  value == 0 ? "-" : numberWithCommas(+value, 0),
              },
              {
                field: "advanceDeduction",
                headerName: "Advance",
                formatter: ({ value }) =>
                  value == 0 ? "-" : numberWithCommas(+value, 0),
                isEditable: ({ data }) =>
                  Boolean(data?._id && !isCellEditable(data.month)),
              },
              {
                field: "net_payable",
                headerName: "Total",
                formatter: ({ value }) =>
                  value == 0 ? "-" : numberWithCommas(+value, 0),
              },
              {
                field: "_id",
                headerName: "action",
                cellRenderer: ({ value }) => (
                  <Row sx={{ justifyContent: "center" }}>
                    <Tooltip title="Edit" placement="top" arrow>
                      <IconButtonStyled size="xs" color="warning">
                        <Icons.DesignServices />
                      </IconButtonStyled>
                    </Tooltip>
                    <Tooltip title="Details" placement="top" arrow>
                      <IconButtonStyled
                        size="xs"
                        LinkComponent={Link}
                        href={`/v1/payroll/payslips/${value}`}
                        color="info"
                      >
                        <Icons.VisibilityIcon />
                      </IconButtonStyled>
                    </Tooltip>
                  </Row>
                ),
              },
            ]}
            defaultColDef={{ getTextStyle: () => ({ textAlign: "center" }) }}
            isFooter={({ _id }) => !_id}
          />
        )}
        <PaginationBar
          onLimitChange={handleQueryChange}
          onPageChange={handleQueryChange}
          pagination={data?.pagination}
        />
      </Box>
    </Box>
  );
}

export default EmployeePayslipTable;
