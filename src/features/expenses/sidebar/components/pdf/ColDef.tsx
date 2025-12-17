import { TableColDef } from "@/components/pdf/Table";
import { TransactionFormatted } from "@/types/Transaction";

export const expensePdfColDef: TableColDef<TransactionFormatted>[] = [
  {
    field: "date_formatted",
    getTextStyle: () => ({ textAlign: "left" }),
  },
  {
    field: "voucher_no",
    getTextStyle: () => ({ textAlign: "left" }),
  },
  {
    field: "destination",
    formatter: ({ data }) => data?.destination.account_name || "",
    getTextStyle: () => ({ textAlign: "left" }),
  },
  {
    field: "customer",
    formatter: ({ data }) => data?.supplier?.name || "",
    getTextStyle: () => ({ textAlign: "left" }),
  },
  {
    field: "amount_formatted",
    getTextStyle: () => ({ textAlign: "right" }),
  },
];
