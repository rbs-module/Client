import AccountSchema from "./account-schema";
import createTransactionDTOSchema from "./create-transaction";
import findAccountsQuery from "./find-accounts-schema";
import findAccountTransactionsQuery from "./find-transactions";
import TransactionSchema from "./transaction-schema";
import { UpdateTransactionDTO } from "./update-transaction";

export const Schemas = {
  accounts: {
    account: AccountSchema,
    create: AccountSchema,
    update: AccountSchema,
    find_accounts_query: findAccountsQuery,
  },
  transactions: {
    transaction: TransactionSchema,
    create: createTransactionDTOSchema,
    update: UpdateTransactionDTO,
    findQuery: findAccountTransactionsQuery,
  },
};
