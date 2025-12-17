import { BASE_URL } from "@/constant/base-url";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "./helpers/prepareHeaders";
import { CreatePaymentDTOType, PaymentType } from "@/zod-schemas/Payment";
import { Pagination } from "@/types/pagination";
import { DefaultQueryParamsDTOType } from "@/zod-schemas/default-query-paramsDTO";
import { objToQueryString } from "@/utils/queryString";
import { RootState } from "@/store";
import toast from "react-hot-toast";
import { ChartDataType, ChatDataQuery } from "@/types/global";

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1/payments`,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    getPayments: builder.query<
      { payments: PaymentType[]; pagination: Pagination },
      Partial<DefaultQueryParamsDTOType & { label: string }>
    >({
      query: (query) => `?${objToQueryString(query)}`,
    }),
    getPaymentById: builder.query<PaymentType, string>({
      query: (id) => `/${id}`,
    }),
    getPaymentVoucherNo: builder.query<{ voucher_no: number }, string>({
      query: () => `/voucher-no`,
    }),
    createPayment: builder.mutation({
      query: (formData: CreatePaymentDTOType) => ({
        url: "/",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        try {
          const state = getState() as RootState;
          const query = state.payments.query;

          const { data } = await queryFulfilled;

          toast.success(data.message || "Payment Create Success");
          dispatch(
            paymentsApi.util.updateQueryData("getPayments", query, (draft) => {
              if (data.payment) {
                draft.payments.unshift(data.payment);
              }
            }),
          );
        } catch (error) {
          console.log({ error });
        }
      },
    }),
    getPaymentChart: builder.query<ChartDataType[], Partial<ChatDataQuery>>({
      query: (query) => `/chart?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetPaymentVoucherNoQuery,
  useCreatePaymentMutation,
  useGetPaymentChartQuery,
} = paymentsApi;
