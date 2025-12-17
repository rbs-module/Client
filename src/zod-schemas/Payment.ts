import { z } from "zod";
export const PAYMENT_MODS_ENUM = [
  "Cash",
  "Cheque",
  "Mobile Banking",
  "Settlement",
] as const;

export const PaymentSchema = z.object({
  // client generated
  date: z.string().default(new Date().toISOString()),
  amount: z.number(),
  mode: z.enum(PAYMENT_MODS_ENUM).default("Cash"),
  description: z.string().default(""),
  organization_id: z.string(),
  cheque_info: z
    .object({
      date: z.string().optional(),
      bank_name: z.string().optional(),
      branch_name: z.string().optional(),
      cheque_no: z.string().optional(),
      image: z.string().optional(),
    })
    .optional(),

  // server generated
  voucher_no: z.string(), // PAY-25-001
  customer: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string().email(),
    address: z.string(),
  }),
  created_by: z.object({
    id: z.string(),
    name: z.string(),
  }),
  _id: z.string(),
});

export const CreatePaymentDTOSchema = PaymentSchema.pick({
  date: true,
  amount: true,
  mode: true,
  description: true,
  cheque_info: true,
}).extend({
  voucher_no: z.number().optional(),
  destination_account: z.string().optional(),
  customer: z.string(),
});
export type PaymentType = z.infer<typeof PaymentSchema>;
export type CreatePaymentDTOType = z.infer<typeof CreatePaymentDTOSchema>;
