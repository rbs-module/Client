import type {
  CustomerStatementQueryType,
  FindCustomersQuery,
} from "@/types/customer";
import { thisYearRange } from "@/utils/date-ranges";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomerState {
  query: FindCustomersQuery;
  statementQuery: CustomerStatementQueryType;
}

const initialState: CustomerState = {
  query: {
    limit: 100,
    search: "",
    page: 1,
    active: true,
    sort_key: "balance",
  },
  statementQuery: {
    page: 1,
    limit: 100,
    start_date: thisYearRange.start_date,
    end_date: thisYearRange.end_date,
    label: thisYearRange.label,
    expand: "yes",
  },
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomersQuery: (
      state,
      action: PayloadAction<Partial<FindCustomersQuery>>,
    ) => {
      state.query = action.payload;
    },
    setStatementQuery: (
      state,
      action: PayloadAction<Partial<FindCustomersQuery>>,
    ) => {
      state.statementQuery = { ...state.statementQuery, ...action.payload };
    },
  },
});

export const { setCustomersQuery } = customerSlice.actions;

const customerReducer = customerSlice.reducer;
export default customerReducer;
