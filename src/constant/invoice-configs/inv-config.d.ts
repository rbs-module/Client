type Labels = {
  subTitle: string;
  datePrefix: string;
  invoiceNoPrefix: string;
  billNoPrefix: string;
  remarks: string;
  totalInWordsPrefix: string;
  padTop?: string;
  slogan: string;
  contact_details: string;
  organization_name: string;
  organization_address: string;
  logo: string;
  sign?: string;
  mrcBase?: string;
  dVoucherBase?: string;
};

type Field = {
  visible: boolean;
  label: string;
  suffix?: string;
  prefix?: string;
  colSpan?: number;
};

type Fields = {
  sl_no: Field;
  order_name: Field;
  design: Field;
  qty: Field;
  rate: Field;
  totalUSD: Field;
  total: Field;
  discount: Field;
};

export type InvoiceConfig = {
  labels: Labels;
  fields: Fields;
};
