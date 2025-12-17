import { BASE_URL } from "@/constant/base-url";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "./helpers/prepareHeaders";
import { Pagination } from "@/types/pagination";
import { DefaultQueryParamsDTOType } from "@/zod-schemas/default-query-paramsDTO";
import { objToQueryString } from "@/utils/queryString";
import type {
  CreateCustomerBodyType,
  CreateSupplierPaymentBody,
  CustomerStatementQueryType,
  SupplierStatementType,
  SupplierType,
} from "@/types/customer";
import { RootState } from "@/store";
import toast from "react-hot-toast";
import { TransactionFormatted } from "@/types/Transaction";
import { FindTransactionsQueryType } from "@/zod-schemas/accounts/find-transactions";

export const supplierApi = createApi({
  reducerPath: "supplierApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1/suppliers`,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    getSuppliers: builder.query<
      { suppliers: SupplierType[]; pagination: Pagination },
      Partial<DefaultQueryParamsDTOType>
    >({
      query: (query) => `?${objToQueryString(query)}`,
    }),
    //
    //
    // >>=========create===========>>
    createSupplier: builder.mutation({
      query: (formData: CreateCustomerBodyType) => ({
        url: `/`,
        method: "POST",
        body: formData,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        try {
          const state = getState() as RootState;
          const query = state.customer.query;
          const { data } = await queryFulfilled;
          toast.success(data.message || "Supplier Create Success");
          dispatch(
            supplierApi.util.updateQueryData("getSuppliers", query, (draft) => {
              if (data.supplier) {
                draft.suppliers.unshift(data.supplier);
              }
            }),
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    // <<=========create===========<<
    // >>=========create payment===========>>
    createSupplierPayment: builder.mutation({
      query: (formData: CreateSupplierPaymentBody) => ({
        url: `/payment`,
        method: "POST",
        body: formData,
      }),
      async onQueryStarted({}, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data.message || "Supplier payment Create Success");
        } catch (error) {
          console.log(error);
        }
      },
    }),
    // <<=========create payment===========<<
    getSupplierTransactions: builder.query<
      {
        transactions: TransactionFormatted[];
        pagination: Pagination;
        supplier: SupplierType;
      },
      { query: Partial<FindTransactionsQueryType>; id: string }
    >({
      query: ({ query, id }) => {
        return `/${id}?${objToQueryString(query)}`;
      },
      keepUnusedDataFor: 300,
    }),
    // statements
    getSupplierStatement: builder.query<
      SupplierStatementType,
      { query: CustomerStatementQueryType; id: string }
    >({
      query: ({ query, id }) => {
        return `/${id}/statement?${objToQueryString(query)}`;
      },
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useLazyGetSuppliersQuery,
  useCreateSupplierMutation,
  useGetSupplierTransactionsQuery,
  useCreateSupplierPaymentMutation,
  useGetSupplierStatementQuery,
} = supplierApi;
