import { z } from "zod";
import defaultQueryParamsDTO from "../default-query-paramsDTO";

const findAccountTransactionsQuery = defaultQueryParamsDTO
  .pick({
    page: true,
    limit: true,
    sort_type: true,
    sort_key: true,
    start_date: true,
    end_date: true,
    expand: true,
  })
  .extend({
    isDeu: z.enum(["true", "false"]).optional(),
    type: z.array(z.string().optional()).optional(),
  });

export default findAccountTransactionsQuery;
export type FindTransactionsQueryType = z.infer<
  typeof findAccountTransactionsQuery
> & { label: string };
