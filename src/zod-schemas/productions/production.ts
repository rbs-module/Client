import { z } from "zod";
import OrderSchema from "../orders/order";

export const shiftEnum = [
  "1st Shift",
  "2nd Shift",
  "3rd Shift",
  "Day Shift",
  "Night Shift",
] as const;

export const ProductionOrderSchema = OrderSchema.pick({
  cover_photo: true,
  currency: true,
  exchange_rate: true,
  order_name: true,
  rate: true,
  sl_no: true,
  unit: true,
}).extend({ _id: z.string() });

export const ProductionItemSchema = z.object({
  order_data: ProductionOrderSchema,
  machine_no: z.number(),
  qty: z.number(),
  amount: z.number().optional(),
  operator: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  remarks: z.string().optional(),
});
export type ProductionItemSchemaType = z.infer<typeof ProductionItemSchema>;

// Schema for Productions
export const ProductionSchema = z.object({
  date: z.string().default(new Date().toISOString()),
  shift: z.enum(shiftEnum).default("Day Shift"),
  amount: z.number().optional(),
  items: z.array(ProductionItemSchema),
  created_by: z.object({
    id: z.string(),
    name: z.string(),
  }),
  organization_id: z.string(),
});
