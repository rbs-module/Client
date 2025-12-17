import { TableColDef } from "@/components/pdf/Table";
import { BillPayment } from "@/types/reports";

export const billPaymentReportPdfColDef: TableColDef<BillPayment>[] = [
  {
    field: "name",
    textStyle: { textAlign: "left" },
    getViewStyle: ({ data }) => ({
      backgroundColor: data?.name ? undefined : "#f0f0f0",
    }),
    formatter: ({ value }) => String(value ?? "Total"),
  },
  {
    field: "bill_formatted",
    textStyle: { textAlign: "right" },
    headerName: "Bill",
    getViewStyle: ({ data }) => ({
      backgroundColor: data?.name ? undefined : "#f0f0f0",
    }),
  },
  {
    field: "payment_formatted",
    textStyle: { textAlign: "right" },
    headerName: "Payment",
    getViewStyle: ({ data }) => ({
      backgroundColor: data?.name ? undefined : "#f0f0f0",
    }),
  },
  {
    field: "balance_formatted",
    textStyle: { textAlign: "right" },
    headerName: "Balance",
    getViewStyle: ({ data }) => ({
      backgroundColor: data?.name ? undefined : "#f0f0f0",
    }),
  },

  // {
  //   field: "description",
  //   width: "23%",
  //   getTextStyle: ({ data }) => {
  //     return {
  //       textAlign: "left",
  //       color: data?.type == "settlement" ? "red" : "",
  //     };
  //   },
  // },
  // {
  //   field: "type",
  //   width: "15%",
  //   formatter: ({ value }) => String(value == "custom" ? "" : value),
  //   getTextStyle: ({ data }) => {
  //     return {
  //       textAlign: "left",
  //       color: data?.type == "settlement" ? "red" : "",
  //       textTransform: "capitalize",
  //     };
  //   },
  //   headerName: "Type",
  // },
  // {
  //   field: "debit_formatted",
  //   width: "13%",
  //   headerName: "Debit",
  //   formatter: ({ value }) => (value == "0.00" ? "-" : String(value)),
  //   getTextStyle: ({ data }) => {
  //     return {
  //       textAlign: "right",
  //       color: data?.type == "settlement" ? "red" : "",
  //     };
  //   },
  // },
  // {
  //   field: "credit_formatted",
  //   formatter: ({ value }) => (value == "0.00" ? "-" : String(value)),
  //   width: "13%",
  //   headerName: "Credit",
  //   getTextStyle: ({ data }) => {
  //     return {
  //       textAlign: "right",
  //       color: data?.type == "settlement" ? "red" : "",
  //     };
  //   },
  // },
  // {
  //   field: "running_balance_formatted",
  //   width: "13%",
  //   getTextStyle: ({ data }) => {
  //     return {
  //       textAlign: "right",
  //       color: data?.type == "settlement" ? "red" : "",
  //     };
  //   },
  //   headerName: "Balance",
  // },
];
