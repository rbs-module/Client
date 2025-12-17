import { z } from "zod";
import { ProductionItemSchema, ProductionSchema } from "./production";

export const createProductionDto = ProductionSchema.omit({
  created_by: true,
  organization_id: true,
}).extend({
  items: z.array(
    // ProductionItemSchema,
    ProductionItemSchema.omit({ order_data: true }).extend({
      order_data: z.string(),
      // .min(22, "Please Select One"),
    }),
  ),
});
export type CreateProductionDtoType = z.infer<typeof createProductionDto>;
