import { z } from "zod";
import TransactionSchema from "./transaction-schema";

const createTransactionDTOSchema = TransactionSchema.omit({
  source: true,
  destination: true,
})
  .extend({
    source: z.string(),
    destination: z.string(),
    due: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.source.toString() === data.destination.toString()) {
      return ctx.addIssue({
        code: "custom",
        message: "source and destination should not be same",
      });
    }
  });
export default createTransactionDTOSchema;

export type CreateTransactionBody = z.infer<typeof createTransactionDTOSchema>;
