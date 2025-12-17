import { TableColDef } from "@/components/pdf/Table";
import { CustomerTransaction } from "@/types/customer";

export const customerStatementPDFColDef: TableColDef<CustomerTransaction>[] = [
  {
    field: "date_formatted",
    width: "23%",
    headerName: "Date",
    getTextStyle: ({ data }) => {
      return {
        textAlign: "left",
        color: data?.type == "settlement" ? "red" : "",
      };
    },
  },

  {
    field: "description",
    width: "23%",
    getTextStyle: ({ data }) => {
      return {
        textAlign: "left",
        color: data?.type == "settlement" ? "red" : "",
      };
    },
  },
  {
    field: "type",
    width: "15%",
    formatter: ({ value }) => String(value == "custom" ? "" : value),
    getTextStyle: ({ data }) => {
      return {
        textAlign: "left",
        color: data?.type == "settlement" ? "red" : "",
        textTransform: "capitalize",
      };
    },
    headerName: "Type",
  },
  {
    field: "debit_formatted",
    width: "13%",
    headerName: "Debit",
    formatter: ({ value }) => (value == "0.00" ? "-" : String(value)),
    getTextStyle: ({ data }) => {
      return {
        textAlign: "right",
        color: data?.type == "settlement" ? "red" : "",
      };
    },
  },
  {
    field: "credit_formatted",
    formatter: ({ value }) => (value == "0.00" ? "-" : String(value)),
    width: "13%",
    headerName: "Credit",
    getTextStyle: ({ data }) => {
      return {
        textAlign: "right",
        color: data?.type == "settlement" ? "red" : "",
      };
    },
  },
  {
    field: "running_balance_formatted",
    width: "13%",
    getTextStyle: ({ data }) => {
      return {
        textAlign: "right",
        color: data?.type == "settlement" ? "red" : "",
      };
    },
    headerName: "Balance",
  },
];
