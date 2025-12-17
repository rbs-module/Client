import { BASE_URL } from "@/constant/base-url";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "./helpers/prepareHeaders";
import { TransactionFormatted } from "@/types/Transaction";
import { Pagination } from "@/types/pagination";
import { DefaultQueryParamsDTOType } from "@/zod-schemas/default-query-paramsDTO";
import { objToQueryString } from "@/utils/queryString";

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1/transactions`,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    getTransactions: builder.query<
      { transactions: TransactionFormatted[]; pagination: Pagination },
      Partial<DefaultQueryParamsDTOType>
    >({
      query: (query) => `/?${objToQueryString(query)}`,
    }),
    getTransactionById: builder.query<
      { transaction: TransactionFormatted },
      string
    >({
      query: (id) => `/${id}`,
    }),
  }),
});

export const {
  useGetTransactionByIdQuery,
  useLazyGetTransactionByIdQuery,
  useGetTransactionsQuery,
} = transactionApi;
