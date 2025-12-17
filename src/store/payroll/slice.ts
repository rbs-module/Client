import { FindEmployeeQuery, FindPayslipQuery } from "@/types/payroll";
import { FindTransactionsQueryType } from "@/zod-schemas/accounts/find-transactions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { subMonths, format } from "date-fns";

interface State {
  findEmployeeQuery: Partial<FindEmployeeQuery>;
  payrollCreationMonth: string;
  FindPayslipQuery: Partial<FindPayslipQuery>;
}

const initialState: State = {
  findEmployeeQuery: {
    page: 1,
    limit: 1000,
    is_active: "true",
  },

  payrollCreationMonth: format(subMonths(new Date(), 1), "yyyy-MM"),
  FindPayslipQuery: {
    month: format(subMonths(new Date(), 1), "yyyy-MM"),
    expand: "yes",
    limit: 100,
    sort: `_id`,
  },
};

const payrollSlice = createSlice({
  name: "payroll",
  initialState,
  reducers: {
    setFindEmployeeQuery: (
      state,
      action: PayloadAction<Partial<FindTransactionsQueryType>>,
    ) => {
      state.findEmployeeQuery = {
        ...state.findEmployeeQuery,
        ...action.payload,
      };
    },
    setFindPayslipQuery: (
      state,
      action: PayloadAction<Partial<FindTransactionsQueryType>>,
    ) => {
      state.FindPayslipQuery = {
        ...state.FindPayslipQuery,
        ...action.payload,
      };
    },
    setPayrollCreationMonth: (state, action: PayloadAction<string>) => {
      state.payrollCreationMonth = action.payload;
    },
  },
});

export const { setFindEmployeeQuery } = payrollSlice.actions;

const payrollReducer = payrollSlice.reducer;
export default payrollReducer;
