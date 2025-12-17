import { z } from "zod";

export const TRANSACTION_TYPE = [
  "invoice",
  "payment",
  "settlement",
  "purchase",
  "expense",
  "custom",
  "opening-balance",
  "transfer",
  "supplier_payment",
  "salary_advance",
] as const;
const TransactionSchema = z.object({
  date: z.string().default(new Date().toISOString()).optional(),
  destination: z.object({
    _id: z.string(),
    account_name: z.string(),
  }),
  source: z.object({
    _id: z.string(),
    account_name: z.string(),
  }),
  type: z.enum(TRANSACTION_TYPE),
  amount: z
    .number()
    .refine((val) => val > 0, { message: "amount should be less than 0" }),

  description: z.string().optional(),
  createdBy: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  organization_id: z.string().optional(),
  reference: z.array(z.string()).optional(),
  voucher_no: z.string().optional(),
  sl_no: z.string().optional(),
  image: z.string().optional(),
  customer: z.string().optional(),
  supplier: z.string().optional(),
  employee: z.string().optional(),
  isDeu: z.boolean().optional(),
});
export default TransactionSchema;
export type TransactionType = z.infer<typeof TransactionSchema> & {
  _id: string;
};
