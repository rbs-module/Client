import { configureStore } from "@reduxjs/toolkit";

import { ordersApi } from "@/services/orders";
import userReducer from "./user";
import { userApi } from "@/services/user";

import orderReducer from "./orders";
import customerReducer from "./customers";
import { organizationApi } from "@/services/organization";
import globalReducer from "./global";
import invoiceReducer from "./invoice";
import { invoiceApi } from "@/services/invoice";
import accountReducer from "./chart-of-accounts";
import { accountsApi } from "@/services/accounts";
import productionReducer from "./productions";
import { productionApi } from "@/services/productions";
import paymentsReducer from "./payments";
import { paymentsApi } from "@/services/payments";
import expensesReducer from "./expense";
import { expenseApi } from "@/services/expenses";
import { supplierApi } from "@/services/suppliers";
import { customerApi } from "@/services/customers";
import { challanApi } from "./challan/api";
import challanReducer from "./challan";
import priceQuotationReducer from "./price-quotation";
import { priceQuotationApi } from "@/services/price-quotation";
import { transactionApi } from "@/services/transaction";
import { reportApi } from "./reports/api";
import { configsApi } from "@/services/configs";
import { payrollApi } from "./payroll";
import payrollReducer from "./payroll/slice";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    orders: orderReducer,
    user: userReducer,
    customer: customerReducer,
    invoice: invoiceReducer,
    accounts: accountReducer,
    productions: productionReducer,
    payments: paymentsReducer,
    expenses: expensesReducer,
    challan: challanReducer,
    priceQut: priceQuotationReducer,
    payroll: payrollReducer,

    [ordersApi.reducerPath]: ordersApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
    [accountsApi.reducerPath]: accountsApi.reducer,
    [productionApi.reducerPath]: productionApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [expenseApi.reducerPath]: expenseApi.reducer,
    [supplierApi.reducerPath]: supplierApi.reducer,
    [challanApi.reducerPath]: challanApi.reducer,
    [priceQuotationApi.reducerPath]: priceQuotationApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    [configsApi.reducerPath]: configsApi.reducer,
    [payrollApi.reducerPath]: payrollApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ordersApi.middleware,
      userApi.middleware,
      customerApi.middleware,
      organizationApi.middleware,
      invoiceApi.middleware,
      accountsApi.middleware,
      productionApi.middleware,
      paymentsApi.middleware,
      expenseApi.middleware,
      supplierApi.middleware,
      challanApi.middleware,
      priceQuotationApi.middleware,
      transactionApi.middleware,
      reportApi.middleware,
      configsApi.middleware,
      payrollApi.middleware,
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
