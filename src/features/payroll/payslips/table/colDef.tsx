import { Icons } from "@/components/icons";
import IconButtonStyled from "@/components/styled/IconButton";
import { PayslipData } from "@/types/payroll";
import { numberWithCommas } from "@/utils/currency-formatter";
import { Tooltip } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import { getDaysInMonth } from "date-fns";
import Link from "next/link";

export const PayslipsColDef: ColDef<PayslipData>[] = [
  {
    field: "employee",
    valueFormatter: ({ data }) => (data?._id ? `${data?.employee?.name}` : ""),
    cellClass: "text-left",
  },
  {
    field: "employee",
    headerName: "ID NO",
    valueFormatter: ({ data }) => (data?._id ? `${data?.employee?.id_no}` : ""),
  },
  {
    field: "month",
    // valueFormatter: ({ data }) => `${getDaysInMonth(data?.month || "")}`,
  },
  {
    field: "present_days",
    headerName: "Present",
    valueFormatter: ({ value, data }) =>
      `${getDaysInMonth(data?.month || "")} / ${value} Days `,
    editable: ({ data }) => Boolean(data?._id),
  },
  {
    field: "leave_days",
    headerName: "Leave",
    valueFormatter: ({ value }) => `${value} Days`,
    sortable: true,
    editable: ({ data }) => Boolean(data?._id),
  },
  {
    field: "absent_days",
    headerName: "Absent",
    valueFormatter: ({ value }) => `${value} Days`,
  },

  {
    field: "overtime_hours",
    headerName: "Overtime",
    valueFormatter: ({ value }) => `${value} Hours`,
    editable: ({ data }) => Boolean(data?._id),
  },
  {
    field: "overtimePay",
    headerName: "OT Amount",
    valueFormatter: ({ value }) => numberWithCommas(value),
  },
  {
    field: "advanceDeduction",
    headerName: "Advance D",
    valueFormatter: ({ value }) => numberWithCommas(value),
    editable: ({ data }) => Boolean(data?._id),
  },
  {
    field: "net_payable",
    headerName: "N Payable",
    valueFormatter: ({ value }) => numberWithCommas(value),
    cellClass: "text-right font-bold",
  },
  {
    field: "_id",
    headerName: "Action",
    cellRenderer: ({ value }: CustomCellRendererProps) => (
      <Tooltip title="Details" placement="top" arrow>
        <IconButtonStyled
          size="xs"
          disabled={!value}
          LinkComponent={Link}
          href={`payslips/${value}`}
          color="info"
        >
          <Icons.VisibilityIcon />
        </IconButtonStyled>
      </Tooltip>
    ),
  },
];
export const PayslipDefaultColDef: ColDef<PayslipData> = {
  flex: 1,
  resizable: false,
  cellClass: ({ data }) => ["text-center", !data?._id ? "font-bold" : ""],
  sortable: false,
  valueSetter: () => false,
};
