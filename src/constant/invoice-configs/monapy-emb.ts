import { defaultInvoiceConfig } from "./default";
import { InvoiceConfig } from "./inv-config";

export const monapyEMBInvoiceConfig: InvoiceConfig = {
  labels: {
    ...defaultInvoiceConfig.labels,
    subTitle: "Bill For Embroidery Works",
    padTop:
      "https://res.cloudinary.com/dbu76a0wo/image/upload/v1663769776/padTop_yluxqh.png",
    slogan: "Your Perfect Partner in Premium Embroidery Solutions!",
    contact_details: "Head office & Factory Tel. +880247670731-2",
    organization_name: "Monapy Embroidery",
    organization_address: "A-149, A-150, BSCIC I/A, Fatullah, Narayanganj-1420",
    sign: "https://res.cloudinary.com/dbu76a0wo/image/upload/v1754806221/z3fupb4dkms8e5uslmjl.png",
    mrcBase:
      "https://res.cloudinary.com/dbu76a0wo/image/upload/v1761804261/naogb3z2ipjqhuxrwh2j.png",
    dVoucherBase:
      "https://res.cloudinary.com/dbu76a0wo/image/upload/v1763035092/h5jfoxjlpfwtsrfykq6v.png",
  },
  fields: {
    ...defaultInvoiceConfig.fields,
  },
};
