import { TableColDef } from "@/components/pdf/Table";
import { ProductionPdfDataType } from "@/types/production";
import { numberWithCommas } from "@/utils/currency-formatter";
import { isFriday } from "date-fns";

export const productionPdf: TableColDef<ProductionPdfDataType>[] = [
  {
    field: "Date",
    getViewStyle: ({ data }) => ({
      backgroundColor: isFriday(new Date(data?.Date || ""))
        ? "#e2eafd"
        : data?.Date !== "Total"
          ? undefined
          : "#f0f0f0",
    }),
  },
  {
    field: "Day Shift",
    getTextStyle: () => ({
      textAlign: "right",
    }),
    getViewStyle: ({ data }) => ({
      backgroundColor: data?.Date !== "Total" ? undefined : "#f0f0f0",
    }),
    formatter: ({ data }) => numberWithCommas(data?.["Day Shift"]),
  },
  {
    field: "Night Shift",
    getTextStyle: ({ data }) => ({
      textAlign: "right",
      fontWeight: data?.Date !== "Total" ? "bold" : undefined,
    }),
    getViewStyle: ({ data }) => ({
      backgroundColor: data?.Date !== "Total" ? undefined : "#f0f0f0",
    }),
    formatter: ({ data }) => numberWithCommas(data?.["Night Shift"]),
  },
  {
    field: "Total",
    getTextStyle: ({ data }) => ({
      textAlign: "right",
      fontWeight: data?.Date == "Total" ? "bold" : undefined,
    }),
    getViewStyle: ({ data }) => ({
      backgroundColor: data?.Date !== "Total" ? undefined : "#f0f0f0",
    }),
    formatter: ({ data }) => numberWithCommas(data?.["Total"]),
  },
];
