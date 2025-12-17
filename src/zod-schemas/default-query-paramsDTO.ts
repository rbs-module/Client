import { endOfDay, startOfDay, startOfMonth } from "date-fns";
import { z } from "zod";
export const df = "dd-MMM-yyyy";
const defaultQueryParamsDTO = z.object({
  page: z
    .string()
    .or(z.number())
    .optional()
    .default("1")
    .refine((val) => +val >= 1, {
      message: "Page must be greater than or equal to 1",
    })
    .transform((val) => parseInt(String(val))),

  limit: z
    .string()
    .or(z.number())
    .optional()
    .default("20")
    .refine((val) => +val >= 1, {
      message: "Limit must be greater than or equal to 1",
    })
    .transform((val) => parseInt(String(val))),

  sort_type: z.enum(["desc", "asc"]).optional().default("desc"),
  sort_key: z.string().optional().default("_id"),
  search: z.string().optional(),
  search_by: z.string().optional(),

  start_date: z
    .string()
    .optional()
    .default(startOfMonth(new Date()).toISOString())
    .transform((val) => startOfDay(val).toISOString()),

  end_date: z
    .string()
    .optional()
    .default(new Date().toISOString())
    .transform((val) => endOfDay(val).toISOString()),
  sort: z.string().optional(),

  date_format: z.string().optional().default(df),
  expand: z.enum(["yes", "no"]).optional(),
});
export default defaultQueryParamsDTO;
export type DefaultQueryParamsDTOType = z.infer<typeof defaultQueryParamsDTO>;
