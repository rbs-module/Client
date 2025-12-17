import { CustomerTransaction } from "@/types/customer";

import { ColDef } from "ag-grid-community";

export const customerStatementColDef: ColDef<CustomerTransaction>[] = [
  {
    field: "date_formatted",
    flex: 1.5,
    headerName: "Date",
  },
  {
    field: "type",

    valueFormatter: ({ value }) =>
      String(value == "custom" ? "" : value).toUpperCase(),
  },
  {
    field: "description",
    flex: 1.3,
  },
  {
    field: "debit_formatted",
    cellStyle: { textAlign: "right" },
    headerName: "Debit",
  },
  {
    field: "credit_formatted",
    cellStyle: { textAlign: "right" },
    headerName: "Credit",
  },
  {
    field: "running_balance_formatted",
    cellStyle: { textAlign: "right" },
    headerName: "Balance",
  },
];
