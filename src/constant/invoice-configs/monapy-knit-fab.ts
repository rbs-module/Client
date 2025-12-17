import { defaultInvoiceConfig } from "./default";
import { InvoiceConfig } from "./inv-config";

export const monapyKnitInvoiceConfig: InvoiceConfig = {
  labels: {
    ...defaultInvoiceConfig.labels,
    subTitle: "Sub Bill For Knitting Charge",
    slogan: "Your Perfect Partner in Premium Knitting Solutions!",
    contact_details: "Head office & Factory Tel. +880247670731-2",
    organization_name: "Monapy Knit Fabrics",
    organization_address:
      "A-149, A-150, BSCIC I/A, Fatullah, Narayanganj-1420.",
  },
  fields: {
    ...defaultInvoiceConfig.fields,
    design: { visible: false, label: "Design" },
    totalUSD: { visible: false, label: "Total(USD)" },
    total: { visible: true, label: "Total(BDT)", colSpan: 1 },
    discount: { visible: true, label: "Discount", colSpan: 1 },
  },
};
