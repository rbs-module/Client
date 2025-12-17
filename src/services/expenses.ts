import { BASE_URL } from "@/constant/base-url";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "./helpers/prepareHeaders";
import { Pagination } from "@/types/pagination";
import { objToQueryString } from "@/utils/queryString";
import type { CreateTransactionBody } from "@/zod-schemas/accounts/create-transaction";
import { RootState } from "@/store";
import toast from "react-hot-toast";
import type { TransactionFormatted } from "@/types/Transaction";
import type { ExpenseByCategory } from "@/types/expenses";
import { FindTransactionsQueryType } from "@/zod-schemas/accounts/find-transactions";

export const expenseApi = createApi({
  reducerPath: "expenseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1/expenses`,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    getExpenses: builder.query<
      { transactions: TransactionFormatted[]; pagination: Pagination },
      Partial<FindTransactionsQueryType>
    >({
      query: (query) => `?${objToQueryString(query)}`,
    }),
    createExpanse: builder.mutation({
      query: (formData: CreateTransactionBody) => ({
        url: "/create-expense",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        try {
          const state = getState() as RootState;
          const query = state.expenses.query;

          const { data } = await queryFulfilled;

          toast.success(data.message || "Transaction Create Success");
          dispatch(
            expenseApi.util.updateQueryData("getExpenses", query, (draft) => {
              if (data.transaction) {
                draft.transactions.unshift(data.transaction);
              }
            }),
          );
        } catch (error) {
          console.log({ error });
        }
      },
    }),
    updateExpanse: builder.mutation({
      query: ({
        formData,
        id,
      }: {
        formData: CreateTransactionBody;
        id: string;
      }) => ({
        url: `/${id}`,
        method: "PUT",
        body: formData,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        try {
          const state = getState() as RootState;
          const query = state.expenses.query;

          const {
            data,
          }: {
            data: {
              message: string;
              transaction: TransactionFormatted;
            };
          } = await queryFulfilled;

          toast.success(data.message || "Transaction Create Success");
          dispatch(
            expenseApi.util.updateQueryData("getExpenses", query, (draft) => {
              if (data.transaction) {
                const updateToExpense = draft.transactions.find(
                  (tr) => tr._id == data.transaction._id,
                );
                if (updateToExpense) {
                  Object.assign(updateToExpense, data.transaction);
                }
              }
            }),
          );
        } catch (error) {
          console.log({ error });
        }
      },
    }),
    getExpenseByCategory: builder.query<
      ExpenseByCategory[],
      { start_date: string; end_date: string }
    >({
      query: (query) => `/by-category?${objToQueryString(query)}`,
    }),
    getExpenseVoucherNo: builder.query<{ voucher_no: number }, null>({
      query: () => `/voucher-no`,
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useCreateExpanseMutation,
  useUpdateExpanseMutation,
  useGetExpenseByCategoryQuery,
  useGetExpenseVoucherNoQuery,
} = expenseApi;
