import { Icons } from "@/components/icons";
import type { TransactionFormatted } from "@/types/Transaction";
import { Button } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import Link from "next/link";

export const SupplierTransactionColDef: ColDef<TransactionFormatted>[] = [
  {
    field: "date_formatted",
    headerName: "Date",
  },
  {
    field: "voucher_no",
    headerName: "Voucher NO",
  },
  {
    field: "sl_no",
    headerName: "Ref No",
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
    field: "amount_formatted",
    headerName: "Amount",
    cellClass: "text-right font-bold",
    cellRenderer: ({
      data,
      value,
    }: CustomCellRendererProps<TransactionFormatted>) => (
      <div
        className={`w-full text-right ${data?.isDeu ? "text-red-700" : ""} ${data?.type == "supplier_payment" ? "text-blue-700" : ""}`}
      >
        <span>
          {data?.type == "custom"
            ? value
            : `${data?.type == "supplier_payment" ? "+ " : "- "} ${value}`}
        </span>
      </div>
    ),
  },

  {
    field: "createdBy.name",
    headerName: "Created By",
  },
  {
    field: "_id",
    headerName: "View",
    cellRenderer: ({
      value,
    }: CustomCellRendererProps<TransactionFormatted>) => (
      <Link
        href={`/view/transactions/${value}`}
        target="_blank"
        rel="noreferrer"
      >
        <Button size="small">
          <Icons.VisibilityIcon />
        </Button>
      </Link>
    ),
  },
];
export const SupplierTransactionDefaultColDef: ColDef<TransactionFormatted> = {
  flex: 1,
  resizable: false,
  cellClass: ({ data }) => [
    "text-left",
    data?.description == "Closing Balance" ? "font-bold" : "",
  ],
  sortable: false,
  cellStyle: ({ data }) => ({
    backgroundColor: data?.description == "Total Amount" ? "#f0f8ff" : "",
    fontWeight: data?.description == "Total Amount" ? "bold" : "",
  }),
};
