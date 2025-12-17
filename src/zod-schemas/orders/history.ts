import { z } from "zod";

export const orderHistoryActionsEnum = [
  "created",
  "updated",
  "deleted",
  "invoice_created",
  "comments",
  "production",
] as const;

export const orderHistoryReferenceModelEnum = ["Invoice"] as const;

// Define the Zod schema
export const OrderHistoryZodSchema = z.object({
  order_id: z.string(),

  organization_id: z.string(),

  // filter by action type
  action: z.enum(orderHistoryActionsEnum),

  // massage for comments
  message: z.string().optional(),
  // write a description for generate invoices , payment_made and settlement_recorded
  details: z.string().optional(),

  // take user info
  modified_by: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),

  createdAt: z.date().default(new Date()).optional(),

  // reference id for invoice , payment , settlement transactions
  referenceId: z.string().optional(),

  referenceModel: z.enum(orderHistoryReferenceModelEnum).optional(),
  changes: z.array(
    z.object({
      field: z.string(),
      oldValue: z.any(),
      newValue: z.any(),
    }),
  ),
  _id: z.string().optional(),
});

// Define the TypeScript type for the Zod schema
export type OrderHistoryType = z.infer<typeof OrderHistoryZodSchema>;
