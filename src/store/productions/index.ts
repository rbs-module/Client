import { FindProductionsQueryType } from "@/types/production";
import { thisMonthRange } from "@/utils/date-ranges";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
  query: FindProductionsQueryType;
}

const initialState: State = {
  query: {
    page: 1,
    limit: 100,
    ...thisMonthRange,
  },
};

const productionSlice = createSlice({
  name: "production",
  initialState,
  reducers: {
    setProductionQuery: (
      state,
      action: PayloadAction<Partial<FindProductionsQueryType>>,
    ) => {
      state.query = { ...state.query, ...action.payload };
    },
  },
});

export const { setProductionQuery } = productionSlice.actions;

const productionReducer = productionSlice.reducer;
export default productionReducer;
