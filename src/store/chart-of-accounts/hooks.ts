import { FindTransactionsQueryType } from "@/zod-schemas/accounts/find-transactions";
import { useAppDispatch, useAppSelector } from "../hook";
import { FindAccountsQueryType } from "@/zod-schemas/accounts/find-accounts-schema";

function useAccountsStore() {
  const state = useAppSelector((state) => state.accounts);
  const dispatch = useAppDispatch();
  const handleTransactionsQueryChange = (
    payload: Partial<FindTransactionsQueryType>,
  ) => {
    dispatch({
      type: "accounts/setTransactionsQuery",
      payload,
    });
  };
  const handleAccountsQueryChange = (
    payload: Partial<FindAccountsQueryType>,
  ) => {
    dispatch({
      type: "accounts/setAccountsQuery",
      payload,
    });
  };
  return {
    accountsQuery: state.query,
    transactionsQuery: state.transactionQuery,
    handleTransactionsQueryChange,
    handleAccountsQueryChange,
  };
}

export { useAccountsStore };
