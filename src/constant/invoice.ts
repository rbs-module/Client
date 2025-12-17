import { defaultInvoiceConfig } from "./invoice-configs/default";
import { embroArtInvoiceConfig } from "./invoice-configs/embroArt";
import { InvoiceConfig } from "./invoice-configs/inv-config";
import { monapyEMBInvoiceConfig } from "./invoice-configs/monapy-emb";
import { monapyKnitInvoiceConfig } from "./invoice-configs/monapy-knit-fab";

export const invoiceConfig = {
  padTop:
    "https://res.cloudinary.com/dbu76a0wo/image/upload/v1663769776/padTop_yluxqh.png",
  organization_name: "Ibnur Fashion Embroidery",
  slogan: "Your Perfect Partner in Premium Embroidery Solutions!",
  contact_details: "Head office & Factory Tel. +880247670731-2",
};

export const getInvoiceConfig = (id: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config: any = {
    "6741b5a8cb322d875319e788": monapyEMBInvoiceConfig,
    "67ac1a9d166dfe9c6e6e1f09": monapyEMBInvoiceConfig,
    "686ba5338782e1563f7ee830": monapyKnitInvoiceConfig,
    "68931f4fdbee966f7b8ad63a": embroArtInvoiceConfig,
  };

  if (config[id]) {
    return config[id] as InvoiceConfig;
  } else {
    return defaultInvoiceConfig;
  }
};
