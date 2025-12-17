import { useGetExpenseByCategoryQuery } from "@/services/expenses";
import { useExpenseStore } from "@/store/expense/hooks";

function useExpenseByCategory() {
  const { expenseByCategoryQuery, setExpenseByCategoryQuery } =
    useExpenseStore();
  const { data, isFetching, isLoading, refetch } = useGetExpenseByCategoryQuery(
    expenseByCategoryQuery,
    { pollingInterval: 1000 * 30 },
  );

  return {
    data,
    isLoading: isFetching || isLoading,
    handleQueryChange: setExpenseByCategoryQuery,
    query: expenseByCategoryQuery,
    refetch,
  };
}

export default useExpenseByCategory;
