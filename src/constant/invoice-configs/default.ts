import { InvoiceConfig } from "./inv-config";

export const defaultInvoiceConfig: InvoiceConfig = {
  labels: {
    subTitle: "Sub Bill For Embroidery Works",
    datePrefix: "Invoice Date",
    invoiceNoPrefix: "Invoice No",
    billNoPrefix: "Bill No",
    remarks: "Remarks:",
    totalInWordsPrefix: "In Word :",
    slogan: "Your Perfect Partner in Premium Embroidery Solutions!",
    contact_details: "Head office & Factory Tel. +880247670731-2",
    organization_name: "Organization Name",
    logo: "https://res.cloudinary.com/dbu76a0wo/image/upload/v1739199765/ukxgrcsvtwy947fufkda.png",
    organization_address: "Address: ",
  },
  fields: {
    sl_no: { visible: true, label: "SL No" },
    order_name: { visible: true, label: "Descriptions" },
    design: { visible: true, label: "Design" },
    qty: { visible: true, label: "Qty", suffix: "Pcs", prefix: "" },
    rate: { visible: true, label: "Rate", suffix: "", prefix: "auto" },
    totalUSD: { visible: true, label: "Total(USD)" },
    total: { visible: true, label: "Total(BDT)", colSpan: 3 },
    discount: { visible: true, label: "Total(BDT)", colSpan: 4 },
  },
};
