import { thisMonthRange } from "@/utils/date-ranges";
import { DefaultQueryParamsDTOType } from "@/zod-schemas/default-query-paramsDTO";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
  query: Partial<DefaultQueryParamsDTOType> & { label: string };
}

const initialState: State = {
  query: {
    page: 1,
    limit: 100,
    start_date: thisMonthRange.start_date,
    end_date: thisMonthRange.end_date,
    label: thisMonthRange.label,
  },
};

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setPaymentsQuery: (
      state,
      action: PayloadAction<
        Partial<Partial<DefaultQueryParamsDTOType> & { dateLabel: string }>
      >,
    ) => {
      state.query = { ...state.query, ...action.payload };
    },
  },
});

export const { setPaymentsQuery } = paymentSlice.actions;

const paymentsReducer = paymentSlice.reducer;
export default paymentsReducer;
