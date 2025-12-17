import { BASE_URL } from "@/constant/base-url";
import { Pagination } from "@/types/pagination";

import { objToQueryString } from "@/utils/queryString";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "./helpers/prepareHeaders";
import { AccountType } from "@/zod-schemas/accounts/account-schema";
import { FindAccountsQueryType } from "@/zod-schemas/accounts/find-accounts-schema";
import { RootState } from "@/store";
import toast from "react-hot-toast";
import { FindTransactionsQueryType } from "@/zod-schemas/accounts/find-transactions";
import { TransactionFormatted } from "@/types/Transaction";
import type { CreateTransactionBody } from "@/zod-schemas/accounts/create-transaction";

export const accountsApi = createApi({
  reducerPath: "accountsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1/accounts/`,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    getAccounts: builder.query<
      { accounts: AccountType[]; pagination: Pagination },
      Partial<FindAccountsQueryType>
    >({
      query: (query) => `?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),
    getAccountTransactions: builder.query<
      {
        data: AccountType & { transactions: TransactionFormatted[] };
        pagination: Pagination;
      },
      { query: Partial<FindTransactionsQueryType>; id: string }
    >({
      query: ({ query, id }) => {
        console.log({ query });

        return `transactions/${id}?${objToQueryString(query)}`;
      },
      keepUnusedDataFor: 300,
    }),
    getAccountById: builder.query<AccountType, string>({
      query: (id) => `/${id}`,
    }),

    createAccount: builder.mutation({
      query: (newOrder: Partial<AccountType>) => ({
        url: "/create",
        method: "POST",
        body: newOrder,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        const state = getState() as RootState;
        const query = state.accounts.query;
        const { data } = await queryFulfilled;
        toast.success(data.message || "Account Create Success");
        dispatch(
          accountsApi.util.updateQueryData("getAccounts", query, (draft) => {
            if (data.account) {
              draft.accounts.unshift(data.account);
            }
          }),
        );
      },
    }),
    createManualJournal: builder.mutation({
      query: (data: Partial<CreateTransactionBody>) => ({
        url: "/create-transaction",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  util,
  reducer,
  useGetAccountsQuery,
  useGetAccountByIdQuery,
  useLazyGetAccountByIdQuery,
  useLazyGetAccountsQuery,
  useCreateAccountMutation,
  useCreateManualJournalMutation,
  useGetAccountTransactionsQuery,
} = accountsApi;
