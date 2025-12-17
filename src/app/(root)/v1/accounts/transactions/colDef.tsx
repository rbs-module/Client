import type { TransactionFormatted } from "@/types/Transaction";
import { Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import Link from "next/link";

export const TransactionColDef: ColDef<TransactionFormatted>[] = [
  {
    field: "date_formatted",
    headerName: "Date",
  },
  {
    field: "voucher_no",
    headerName: "Voucher NO",
    // valueFormatter: ({ value }) => `${value} ==>`,
    cellRenderer: ({ value, data }: CustomCellRendererProps) => (
      <Link href={`/view/transactions/${data._id}`} target="_blank">
        <Typography
          className="hover:underline underline-offset-2"
          color="secondary"
        >
          {value}
        </Typography>
      </Link>
    ),
  },
  {
    field: "source.account_name",
    headerName: "Source",
    // valueFormatter: ({ value }) => `${value} ==>`,
  },
  {
    field: "destination.account_name",
    headerName: "Destination",
  },
  {
    field: "type",
    valueFormatter: ({ value }) =>
      value == "custom" ? "" : String(value).toUpperCase(),
  },
  {
    field: "description",
  },
  {
    field: "description",
    headerName: "Customer/Supplier",
    valueGetter: ({ data }) =>
      data?.customer?.name || data?.supplier?.name || "",
  },
  {
    field: "amount_formatted",
    headerName: "Amount",
    cellClass: "text-right font-bold",
  },
  {
    field: "createdBy.name",
    headerName: "Created By",
  },
];
export const TransactionDefaultColDef: ColDef<TransactionFormatted> = {
  flex: 1,
  resizable: false,
  cellClass: ({ data }) => [
    "text-left",
    data?.description == "Closing Balance" ? "font-bold" : "",
  ],
  sortable: false,
};
