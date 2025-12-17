import {
  findInvoiceQuerySchema,
  FindInvoicesQueryType,
} from "@/zod-schemas/invoice";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { z } from "zod";
import { thisYearRange } from "@/utils/date-ranges";

interface PriceQuotationState {
  query: Partial<FindInvoicesQueryType>;
}

const initialState: PriceQuotationState = {
  query: { ...findInvoiceQuerySchema.parse({}), limit: 100, ...thisYearRange },
};

const priceQuotationSlice = createSlice({
  name: "priceQut",
  initialState,
  reducers: {
    setPriceQuotationQuery: (
      state,
      action: PayloadAction<Partial<FindInvoicesQueryType>>,
    ) => {
      try {
        state.query = findInvoiceQuerySchema.parse({
          ...state.query,
          ...action.payload,
        });
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

export const { setPriceQuotationQuery } = priceQuotationSlice.actions;

const priceQuotationReducer = priceQuotationSlice.reducer;
export default priceQuotationReducer;
