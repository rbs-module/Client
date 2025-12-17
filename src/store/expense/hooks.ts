import { FindTransactionsQueryType } from "@/zod-schemas/accounts/find-transactions";
import { useAppDispatch, useAppSelector } from "../hook";
import { FindAccountsQueryType } from "@/zod-schemas/accounts/find-accounts-schema";

function useExpenseStore() {
  const state = useAppSelector((state) => state.expenses);
  const dispatch = useAppDispatch();
  const setExpensesQuery = (payload: Partial<FindTransactionsQueryType>) => {
    dispatch({
      type: "expenses/setExpensesQuery",
      payload,
    });
  };
  const setExpenseByCategoryQuery = (
    payload: Partial<FindAccountsQueryType>,
  ) => {
    dispatch({
      type: "expenses/setExpenseByCategoryQuery",
      payload,
    });
  };
  return {
    setExpensesQuery,
    expenseQuery: state.query,
    expenseByCategoryQuery: state.expenseByCategoryQuery,
    setExpenseByCategoryQuery,
  };
}

export { useExpenseStore };
