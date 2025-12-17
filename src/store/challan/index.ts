import { FindChallanQuery } from "@/types/challan";
import { last30days } from "@/utils/date-ranges";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomerState {
  query: FindChallanQuery;
}

const initialState: CustomerState = {
  query: {
    limit: 100,
    page: 1,
    ...last30days,
  },
};

const challanSlice = createSlice({
  name: "challan",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<FindChallanQuery>) => {
      state.query = { ...state.query, ...action.payload };
    },
  },
});

const challanReducer = challanSlice.reducer;
export default challanReducer;
