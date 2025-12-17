import { z } from "zod";

export const OrderCurrenciesEnum = ["USD", "EUR", "BDT"] as const;
export const OrderUnitEnum = [
  "Pcs",
  "Dzn",
  "Yards",
  "Cone",
  "Kg",
  "U",
] as const;
export const orderStatusEnum = [
  "Placed",
  "Develop",
  "Pending",
  "Processing",
  "Completed",
  "Shipped",
  "Invoiced",
] as const;

const BOMItemSchema = z.object({
  item_name: z.string().min(1, "Item name is required"),
  quantity: z.number().positive("Quantity must be a positive number"),
  unit: z.enum(OrderUnitEnum).default("Pcs"),
  description: z.string().optional(),
  cost: z.number().nonnegative().optional(),
});
export type BomItemType = z.infer<typeof BOMItemSchema>;

const OrderSchema = z.object({
  customer: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
  organization_id: z.string(),
  order_name: z.string().min(3).max(100),
  sl_no: z.string(),
  qty: z.number().positive(),
  rate: z.number().positive(),
  currency: z.enum(OrderCurrenciesEnum).default("BDT"),
  unit: z.enum(OrderUnitEnum).default("Pcs"),
  properties: z.any().optional(),
  tags: z.array(z.string().optional()),
  status: z.enum(orderStatusEnum).default("Placed"),
  description: z.string().optional(),
  cover_photo: z.string().url(),
  gallery: z.array(z.string().optional()).optional(),
  created_by: z.object({
    id: z.string(),
    name: z.string(),
  }),
  exchange_rate: z.number().optional().default(100),
  inventory: z
    .object({
      receive_qty: z.number().default(0),
      production_qty: z.number().default(0),
      finishing_qty: z.number().default(0),
      rejection_qty: z.number().default(0),
      delivery_qty: z.number().default(0),
    })
    .optional(),
  bom: z.array(BOMItemSchema).optional(),
  created_at: z.date().optional().default(new Date()),
});
export default OrderSchema;
