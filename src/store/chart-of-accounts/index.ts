import { thisMonthRange } from "@/utils/date-ranges";
import findAccountsQuery, {
  FindAccountsQueryType,
} from "@/zod-schemas/accounts/find-accounts-schema";
import { FindTransactionsQueryType } from "@/zod-schemas/accounts/find-transactions";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { z } from "zod";

interface AccountState {
  query: Partial<FindAccountsQueryType>;
  transactionQuery: Partial<FindTransactionsQueryType>;
}

const initialState: AccountState = {
  query: findAccountsQuery.parse({
    limit: 100,
    sort_key: "balance",
    type: "asset",
  }),
  // transactionQuery: findAccountTransactionsQuery.parse({ limit: 100 }),
  transactionQuery: {
    page: 1,
    limit: 100,
    start_date: thisMonthRange.start_date,
    end_date: thisMonthRange.end_date,
    label: thisMonthRange.label,
    sort_type: "asc",
  },
};

const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    setAccountsQuery: (
      state,
      action: PayloadAction<Partial<FindAccountsQueryType>>,
    ) => {
      try {
        state.query = findAccountsQuery.parse({
          ...state.query,
          ...action.payload,
        });
      } catch (error) {
        console.log({ error });

        if (error instanceof z.ZodError) {
          error.errors.forEach((item) => {
            toast.error(item.message);
          });
        }
      }
    },
    setTransactionsQuery: (
      state,
      action: PayloadAction<Partial<FindTransactionsQueryType>>,
    ) => {
      try {
        state.transactionQuery = {
          ...state.transactionQuery,
          ...action.payload,
        };
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach((item) => {
            toast.error(item.message);
          });
        }
      }
    },
  },
});

export const { setAccountsQuery, setTransactionsQuery } = accountSlice.actions;

const accountReducer = accountSlice.reducer;
export default accountReducer;
