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

export const priceQuotationApi = createApi({
  reducerPath: "priceQuotationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1/price-quotation/`,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    // get list of invoices ==========>>
    getPriceQuotations: builder.query<
      { quotations: InvoiceType[]; pagination: Pagination },
      Partial<FindInvoicesQueryType>
    >({
      query: (query) => `?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),
    getQuotationById: builder.query<InvoiceFormattedType, string>({
      query: (id) => `/${id}`,
      keepUnusedDataFor: 300,
    }),
    createQuotation: builder.mutation({
      query: (data: InvoiceCreateDtoType) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
    }),
    updatePriceQuotation: builder.mutation({
      query: ({
        formData,
      }: {
        formData: Omit<InvoiceItemsType, "invoiceId"> & { quotationId: string };
      }) => ({
        url: `/${formData.quotationId}`,
        method: "PUT",
        body: formData,
      }),

      async onQueryStarted({ formData }, { dispatch, queryFulfilled }) {
        const {
          data,
        }: { data: { data: InvoiceFormattedType; message: string } } =
          await queryFulfilled;
        toast.success(data.message || "Quotation Update Success");
        dispatch(
          priceQuotationApi.util.updateQueryData(
            "getQuotationById",
            formData.quotationId,
            (draft) => {
              Object.assign(draft, data.data);
            },
          ),
        );
      },
    }),

    getQuotationNo: builder.query<{ data: string }, string>({
      query: (customer_id: string) => `/quotation-no/${customer_id}`,
    }),
  }),
});

export const {
  util,
  reducer,
  useGetPriceQuotationsQuery,
  useGetQuotationByIdQuery,
  useUpdatePriceQuotationMutation,
  useCreateQuotationMutation,
  useLazyGetQuotationNoQuery,
} = priceQuotationApi;
