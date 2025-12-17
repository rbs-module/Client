import { z } from "zod";
import { ACCOUNT_TYPES } from "./account-schema";
import defaultQueryParamsDTO from "../default-query-paramsDTO";

const findAccountsQuery = defaultQueryParamsDTO.merge(
  z.object({
    active: z.string().optional().default("true"),

    is_debit: z.string().optional(),

    type: z
      .enum([...ACCOUNT_TYPES, "all"])
      .optional()
      .default("all"),
    have_balance: z.enum(["yes", "no"]).optional().default("no"),
  }),
);
export default findAccountsQuery;
export type FindAccountsQueryType = z.infer<typeof findAccountsQuery>;
