import { TableColDef } from "@/components/pdf/Table";
import { TransactionFormatted } from "@/types/Transaction";

export const expensePdfColDef: TableColDef<TransactionFormatted>[] = [
  {
    field: "date_formatted",
    headerName: "Date",
    getTextStyle: () => ({ textAlign: "left" }),
    width: "15%",
  },
  {
    field: "voucher_no",
    headerName: "Voucher NO",
    getTextStyle: () => ({ textAlign: "left" }),
    width: "15%",
  },
  {
    field: "destination",
    headerName: "Account",
    formatter: ({ data }) => data?.destination.account_name || "",
    getTextStyle: () => ({ textAlign: "left" }),
    width: "22%",
  },
  {
    field: "supplier",
    formatter: ({ data }) => data?.supplier?.name || "",
    getTextStyle: () => ({ textAlign: "left" }),
    width: "22%",
  },
  {
    field: "sl_no",
    headerName: "Ref",
    getTextStyle: () => ({ textAlign: "center" }),
    width: "11%",
  },
  {
    field: "amount_formatted",
    headerName: "Amount",
    getTextStyle: () => ({ textAlign: "right" }),
    width: "15%",
  },
];
