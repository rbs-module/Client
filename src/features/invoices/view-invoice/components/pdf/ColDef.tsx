import { TableColDef } from "@/components/pdf/Table";
import { InvoiceConfig } from "@/constant/invoice-configs/inv-config";
import { numberWithCommas } from "@/utils/currency-formatter";
import { InvoiceItemType } from "@/zod-schemas/invoice";
import { Image, View } from "@react-pdf/renderer";

export const getInvoiceTablePDFColDef = (config: InvoiceConfig) => {
  const invoiceTablePDFColDef: TableColDef<InvoiceItemType>[] = [
    {
      field: "sl_no",
      headerName: config.fields.sl_no.label,
      width: 0,
    },
    {
      field: "order_name",
      headerName: config.fields.order_name.label,
      width: 120,
      textStyle: { textAlign: "left" },
      getViewStyle: ({ data }) => [
        data?.orderId == "Discount" ? { borderLeftWidth: 0 } : {},
        data?.orderId == "Total" ? { borderLeftWidth: 0 } : {},
      ],
      formatter: ({ value, data }) => {
        if (data?.orderId == "Total" || data?.orderId == "Discount") {
          return String(data.orderId);
        }
        return String(value);
      },
    },
    {
      field: "cover_photo",
      headerName: "Design",
      width: 55,
      getViewStyle: ({ data }) => [
        data?.orderId == "Discount" ? { borderLeftWidth: 0 } : {},
        data?.orderId == "Total" ? { borderLeftWidth: 0 } : {},
        { padding: 2 },
      ],
      cellRenderer: ({ value }) => {
        if (value) {
          return (
            <View style={{ width: 50 }}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image
                style={{
                  height: 25,
                  width: "100%",
                  marginVertical: "auto",
                  marginHorizontal: "auto",
                }}
                src={value as string}
              />
            </View>
          );
        }
      },
    },
    {
      field: "qty",
      formatter: ({ value }) => `${value == 0 ? "-" : value}`,
      headerName: "Qty/Pcs",
    },
    {
      field: "rate",
      textStyle: { textAlign: "right" },
      formatter: ({ data, value }) => {
        if (data?.orderId == "Total") {
          return "";
        }
        if (data?.orderId == "Discount") {
          return value + "%";
        }
        return `${data?.currency} ${numberWithCommas(data?.rate)}`;
      },
    },
    {
      field: "total",
      headerName: "Total(USD)",
      textStyle: { textAlign: "right" },
      getViewStyle: ({ data }) => [
        data?.orderId == "Discount" ? { borderLeftWidth: 0 } : {},
      ],

      formatter: ({ data }) => {
        if (data?.orderId == "Discount") {
          return "";
        }
        if (data?.orderId == "Total") {
          return data.currency == "USD"
            ? numberWithCommas(data.total / (data?.exchange_rate || 1))
            : "-";
        }

        return `${
          data?.currency == "USD"
            ? numberWithCommas(data.total / (data?.exchange_rate || 1))
            : data?.orderId == "Total"
              ? numberWithCommas(data.total)
              : "-"
        }`;
      },
    },
    {
      field: "total",
      width: 80,
      textStyle: { textAlign: "right" },
      headerName: "Total(BDT)",

      getTextStyle: ({ data }) => {
        if (data?.orderId == "Total") {
          return { fontWeight: "bold", fontFamily: "Roboto" };
        }
        return {};
      },
      formatter: ({ data }) => numberWithCommas(data?.total),
    },
  ];

  let arr = invoiceTablePDFColDef;
  if (!config.fields.design.visible) {
    arr = invoiceTablePDFColDef.filter((item) => item.field !== "cover_photo");
  }
  if (!config.fields.totalUSD.visible) {
    arr = arr.filter((item) => item.headerName !== "Total(USD)");
  }

  return arr;
};
