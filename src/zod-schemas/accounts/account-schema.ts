import { z } from "zod";
export const ACCOUNT_TYPES = [
  // "cash",
  // "receivable",
  // "payable",
  "expense",
  "income",
  "loss",
  "asset",
  "liability",
  "other_asset",
] as const;

const AccountSchema = z.object({
  account_name: z.string().min(3).max(50),
  account_type: z.enum(ACCOUNT_TYPES).default("asset"),
  is_system_account: z.boolean().default(false),
  is_active: z.boolean().default(true),
  is_debit: z.boolean().default(true),
  organization_id: z.string(),
  createdBy: z.string(),
  parentId: z.string().optional(),
  description: z.string().optional(),
  balance: z.number().default(0),
  _id: z.string(),
});
export default AccountSchema;
export type AccountType = z.infer<typeof AccountSchema>;
