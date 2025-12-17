import { numberWithCommas } from "@/utils/currency-formatter";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";
import type { InvoiceItemType } from "@/zod-schemas/invoice";
import type { ColDef } from "ag-grid-community";
import type { CustomCellRendererProps } from "ag-grid-react";
import Image from "next/image";

export const invoiceViewColDef: ColDef<InvoiceItemType>[] = [
  {
    field: "sl_no",
    headerName: "Des No",

    cellClass: "text-center",
    colSpan: ({ data }) =>
      data?.order_name ? 1 : data?.orderId == "Total" ? 3 : 4,
    valueFormatter: ({ data, value }) => {
      if (data?.orderId == "Total" || data?.orderId == "Discount") {
        return data.orderId;
      }
      return value;
    },
  },
  {
    field: "order_name",
    headerName: "Style",
    editable: true,
    flex: 1.5,
    valueFormatter: ({ value }) => `${value} ✎`,
  },
  {
    field: "cover_photo",
    width: 70,
    headerName: "Design",
    cellRenderer: ({ value }: CustomCellRendererProps<InvoiceItemType>) =>
      value ? (
        <Image
          src={ImageUrlConfig(value, "w_70,h_40")}
          width={70}
          height={40}
          alt="Des"
        />
      ) : (
        ""
      ),
  },

  {
    field: "qty",
    editable: true,
    cellRenderer: ({
      value,
      data,
    }: CustomCellRendererProps<InvoiceItemType>) =>
      data?.orderId == "Total" ? <strong>{value}</strong> : `✎ ${value}`,
  },
  {
    field: "rate",
    editable: true,

    cellClass: ({ data }) =>
      data?.orderId == "Discount" ? "text-center " : "text-right",
    cellRenderer: ({
      value,
      data,
    }: CustomCellRendererProps<InvoiceItemType>) =>
      value ? (
        data?.orderId == "Discount" ? (
          <strong>{value + "%"}</strong>
        ) : (
          `✎ ${numberWithCommas(value)} `
        )
      ) : (
        "-"
      ),
    colSpan: ({ data }) => (data?.orderId !== "Discount" ? 1 : 2),
  },
  {
    field: "total",
    cellClass: "text-right",
    valueFormatter: ({ value, data }) => {
      if (data?.currency !== "USD") {
        return "-";
      }
      if (data?.orderId == "Total" || data.currency == "USD") {
        return numberWithCommas(value / (data?.exchange_rate || 1));
      }
      return numberWithCommas(value);
    },
  },
  {
    field: "total",
    cellClass: "text-right",
    cellRenderer: ({
      value,
      data,
    }: CustomCellRendererProps<InvoiceItemType>) => {
      if (data?.orderId == "Total") {
        return <strong>{numberWithCommas(value)}</strong>;
      }
      if (data?.orderId == "Discount") {
        return <strong>{numberWithCommas(value)}</strong>;
      }
      return numberWithCommas(value);
    },
  },
];
