import { z } from "zod";
import OrderSchema from "./orders/order";
import defaultQueryParamsDTO from "./default-query-paramsDTO";

const statusEnum = ["Created", "Send", "Received", "Approved", "Paid"] as const;

export const InvoiceItemSchema = OrderSchema.pick({
  cover_photo: true,
  currency: true,
  exchange_rate: true,
  order_name: true,
  qty: true,
  rate: true,
  sl_no: true,
  unit: true,
}).extend({ orderId: z.string(), total: z.number(), _id: z.string() });
export const InvoiceItemsSchema = z.object({
  invoiceId: z.string(),
  items: z.array(InvoiceItemSchema),
});

// Schema for invoices
export const InvoiceSchema = z.object({
  status: z.enum(statusEnum).default("Created"),
  date: z.date().default(new Date()),
  invoiceNo: z.string(), // INV-25-0010001 ==>> "INV is invoice" -  "{001 is customer bill no}{0001 is invoice sl}"
  customerBillNo: z.number(),
  customer: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string().email(),
    address: z.string(),
  }),
  amount: z.number(),
  discountPercent: z.number().default(0),
  discountAmount: z.number().default(0),

  remarks: z.string().optional(),
  cover_photo: z.string().url(),
  organization_id: z.string(),
  created_by: z.object({
    id: z.string(),
    name: z.string(),
  }),
  _id: z.string().optional(),
});

export const createInvoiceDTO = InvoiceSchema.omit({
  customer: true,
  invoiceNo: true,
  organization_id: true,
  created_by: true,
  customerBillNo: true,
  status: true,
  amount: true,
  _id: true,
}).extend({
  customer: z.string(),
  invoiceNo: z.string().optional(),
  items: z.array(InvoiceItemSchema),
});

export const findInvoiceQuerySchema = defaultQueryParamsDTO.extend({
  label: z.string().default("This Month"),
});
export type FindInvoicesQueryType = z.infer<typeof findInvoiceQuerySchema>;
export type InvoiceCreateDtoType = z.infer<typeof createInvoiceDTO>;
export type InvoiceItemsType = z.infer<typeof InvoiceItemsSchema>;

export type InvoiceType = z.infer<typeof InvoiceSchema>;
export type InvoiceItemType = z.infer<typeof InvoiceItemSchema>;
export type InvoiceFormattedType = InvoiceType & {
  item_data: InvoiceItemsType;
};

export default InvoiceSchema;
