import { z } from "zod";

import TransactionSchema from "./transaction-schema";

export const UpdateTransactionDTO = TransactionSchema.omit({
  createdBy: true,
  organization_id: true,
})
  .extend({
    source: z.string(),
    destination: z.string(),
  })
  .partial();

export type UpdateTransactionBodyType = z.infer<typeof UpdateTransactionDTO>;
