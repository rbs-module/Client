import { defaultInvoiceConfig } from "./default";
import { InvoiceConfig } from "./inv-config";

export const embroArtInvoiceConfig: InvoiceConfig = {
  labels: {
    ...defaultInvoiceConfig.labels,
    subTitle: "Bill For Embroidery Works",
    logo: "https://res.cloudinary.com/dbu76a0wo/image/upload/v1755061353/zeh4lmcv494dbuyllqoj.png",
    padTop:
      "https://res.cloudinary.com/dbu76a0wo/image/upload/v1755061458/snrl3qenddiij3w6gmd7.png",
    slogan:
      "100% Export-Quality Computerized Embroidery  Crafted with Precision for Global Standards",
    contact_details: "",
    organization_name: "EmbroArt Fashion",
    organization_address:
      "655-BSCIC Shilpopark, Enayetnogor, Fatullah, Narayanganj.",
    sign: "https://res.cloudinary.com/dbu76a0wo/image/upload/v1754806221/z3fupb4dkms8e5uslmjl.png",
    mrcBase:
      "https://res.cloudinary.com/dbu76a0wo/image/upload/v1761744904/dysg00vaqvqnsohlbwbp.png",
    dVoucherBase:
      "https://res.cloudinary.com/dbu76a0wo/image/upload/v1763035047/eao2tasypyeunkwawqfz.png",
  },
  fields: {
    ...defaultInvoiceConfig.fields,
  },
};
