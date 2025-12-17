import { thisMonthRange } from "@/utils/date-ranges";
import { FindTransactionsQueryType } from "@/zod-schemas/accounts/find-transactions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
  query: Partial<FindTransactionsQueryType>;
  expenseByCategoryQuery: typeof thisMonthRange;
}

const initialState: State = {
  query: {
    page: 1,
    limit: 1000,
    start_date: thisMonthRange.start_date,
    end_date: thisMonthRange.end_date,
    sort_key: "_id",
    sort_type: "desc",
    label: thisMonthRange.label,
  },
  expenseByCategoryQuery: {
    ...thisMonthRange,
  },
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setExpensesQuery: (
      state,
      action: PayloadAction<Partial<FindTransactionsQueryType>>,
    ) => {
      state.query = { ...state.query, ...action.payload };
    },
    setExpenseByCategoryQuery: (
      state,
      action: PayloadAction<Partial<typeof thisMonthRange>>,
    ) => {
      state.expenseByCategoryQuery = {
        ...state.expenseByCategoryQuery,
        ...action.payload,
      };
    },
  },
});

export const { setExpensesQuery, setExpenseByCategoryQuery } =
  expenseSlice.actions;

const expensesReducer = expenseSlice.reducer;
export default expensesReducer;
