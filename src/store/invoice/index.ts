import {
  findInvoiceQuerySchema,
  FindInvoicesQueryType,
} from "@/zod-schemas/invoice";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { z } from "zod";

interface InvoiceState {
  query: Partial<FindInvoicesQueryType>;
}

const initialState: InvoiceState = {
  query: { ...findInvoiceQuerySchema.parse({}), limit: 100 },
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    setInvoiceQuery: (
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

export const { setInvoiceQuery } = invoiceSlice.actions;

const invoiceReducer = invoiceSlice.reducer;
export default invoiceReducer;
