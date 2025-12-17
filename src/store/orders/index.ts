import { orderStatusEnum } from "@/constant/order";

import type { OrdersQuery } from "@/types/order";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
  query: OrdersQuery;
}

const remove = ["Invoiced", "Develop", "Cancelled"];

const fixedStatus = orderStatusEnum
  .map((status) => {
    if (remove.includes(status)) {
      return null;
    }
    return status;
  })
  .join(" ");

let savedStatus = "";
if (typeof window !== "undefined") {
  const value = localStorage.getItem("x-status");
  if (value) {
    savedStatus = value;
  }
}
const initialState: OrderState = {
  query: {
    limit: 100,
    search: "",
    page: 1,
    status: savedStatus || fixedStatus,
  },
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrdersQuery: (state, action: PayloadAction<Partial<OrdersQuery>>) => {
      state.query = action.payload;
    },
  },
});

export const { setOrdersQuery } = orderSlice.actions;

const orderReducer = orderSlice.reducer;
export default orderReducer;
