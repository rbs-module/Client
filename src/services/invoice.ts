import { BASE_URL } from "@/constant/base-url";
import { Pagination } from "@/types/pagination";

import { objToQueryString } from "@/utils/queryString";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { prepareHeaders } from "./helpers/prepareHeaders";
import {
  FindInvoicesQueryType,
  InvoiceCreateDtoType,
  InvoiceFormattedType,
  InvoiceItemsType,
  InvoiceType,
} from "@/zod-schemas/invoice";

import toast from "react-hot-toast";
import { RootState } from "@/store";
import { ChartDataType, ChatDataQuery } from "@/types/global";

export const invoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1/invoice/`,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    // get list of invoices ==========>>
    getInvoices: builder.query<
      { invoices: InvoiceType[]; pagination: Pagination },
      Partial<FindInvoicesQueryType>
    >({
      query: (query) => `?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),
    getInvoiceById: builder.query<InvoiceFormattedType, string>({
      query: (id) => `/${id}`,
      keepUnusedDataFor: 300,
    }),
    createInvoice: builder.mutation({
      query: (newOrder: InvoiceCreateDtoType) => ({
        url: "/",
        method: "POST",
        body: newOrder,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        const state = getState() as RootState;
        const query = state.invoice.query;

        const { data } = await queryFulfilled;
        console.log({ data });

        toast.success(data.message || "Invoice Create Success");
        dispatch(
          invoiceApi.util.updateQueryData("getInvoices", query, (draft) => {
            if (data.invoice) {
              draft.invoices.unshift(data.invoice);
            }
          }),
        );
      },
    }),
    updateInvoice: builder.mutation({
      query: ({ formData }: { formData: InvoiceItemsType }) => ({
        url: `/${formData.invoiceId}`,
        method: "PUT",
        body: formData,
      }),

      async onQueryStarted({ formData }, { dispatch, queryFulfilled }) {
        const {
          data,
        }: { data: { data: InvoiceFormattedType; message: string } } =
          await queryFulfilled;
        toast.success(data.message || "Invoice Update Success");
        dispatch(
          invoiceApi.util.updateQueryData(
            "getInvoiceById",
            formData.invoiceId,
            (draft) => {
              Object.assign(draft, data.data);
            },
          ),
        );
      },
    }),
    getInvoiceChart: builder.query<ChartDataType[], Partial<ChatDataQuery>>({
      query: (query) => `/chart?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),
    getInvoiceNo: builder.query<
      { data: { customerBillNo: string; invoiceNo: string } },
      string
    >({
      query: (customer_id: string) => `/invoice-no/${customer_id}`,
    }),
  }),
});

export const {
  util,
  reducer,
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useUpdateInvoiceMutation,
  useCreateInvoiceMutation,
  useGetInvoiceChartQuery,
  useLazyGetInvoiceNoQuery,
} = invoiceApi;
