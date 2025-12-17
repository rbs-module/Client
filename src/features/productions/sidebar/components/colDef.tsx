import { ProductionType } from "@/types/production";
import { numberWithCommas } from "@/utils/currency-formatter";

import { ColDef } from "ag-grid-community";
import { format, isFriday } from "date-fns";

export const productionColDef: ColDef<ProductionType>[] = [
  {
    field: "date",
    headerName: "",
    flex: 1.5,
    resizable: false,
    valueFormatter: ({ value, data }) =>
      data?._id
        ? `${format(value, "dd-MMM-yy")} ${format(value, "EEE")}`
        : "Total",
    cellClass: ({ value }) => `${isFriday(value) ? "bg-gray-200" : ""}`,
  },
  {
    field: "shift",
    headerName: "",
    flex: 1.3,
    resizable: false,
  },
  {
    field: "amount",
    headerName: "",
    flex: 1,
    resizable: false,
    cellClass: ({ data }) => [
      data?._id ? `` : "text-md",
      "text-right font-bold",
    ],
    cellStyle: { color: "primary.default" },
    valueFormatter: ({ value }) => numberWithCommas(value),
  },
];
