import { BASE_URL } from "@/constant/base-url";
import { Pagination } from "@/types/pagination";

import { objToQueryString } from "@/utils/queryString";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { prepareHeaders } from "./helpers/prepareHeaders";
import type {
  FindProductionsQueryType,
  ProductionDetailsType,
  ProductionPdfDataType,
  ProductionsChartQueryType,
  ProductionsChartType,
  ProductionType,
} from "@/types/production";
import { CreateProductionDtoType } from "@/zod-schemas/productions/create-schema";
import { RootState } from "@/store";
import toast from "react-hot-toast";

export const productionApi = createApi({
  reducerPath: "productionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1/productions/`,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    // get list of productions ==========>>
    getProductions: builder.query<
      { productions: ProductionType[]; pagination: Pagination },
      Partial<FindProductionsQueryType>
    >({
      query: (query) => `?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),
    // get list of productions group by date ==========>>
    getProductionsReport: builder.query<
      ProductionPdfDataType[],
      Partial<FindProductionsQueryType>
    >({
      query: (query) => `report?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),
    // getProductionsReportPDF: builder.query<
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   any,
    //   Partial<FindProductionsQueryType>
    // >({
    //   query: (query) => `report-pdf?${objToQueryString(query)}`,
    //   keepUnusedDataFor: 300,
    // }),
    getProductionsReportPDF: builder.query<
      Blob,
      Partial<FindProductionsQueryType>
    >({
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const queryString = objToQueryString(arg || {});
          const res = await fetchWithBQ(`report-pdf?${queryString}`);

          if ("error" in res && res.error) {
            return { error: res.error };
          }

          // Convert the response to Blob
          const blob = await (res.data as Response).blob?.();
          console.log({ blob });
          if (!blob) {
            return {
              error: { status: "CUSTOM_ERROR", error: "Failed to fetch blob" },
            };
          }

          return { data: blob };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          return { error: { status: "CUSTOM_ERROR", error: err.message } };
          console.log({ err });
        }
      },
      keepUnusedDataFor: 0,
    }),
    getProductionsChart: builder.query<
      ProductionsChartType[],
      Partial<ProductionsChartQueryType>
    >({
      query: (query) => `/chart?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),
    getProductionById: builder.query<ProductionDetailsType, string>({
      query: (id) => `/${id}`,
      keepUnusedDataFor: 300,
    }),

    createProduction: builder.mutation({
      query: (newOrder: CreateProductionDtoType) => ({
        url: "/",
        method: "POST",
        body: newOrder,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        try {
          const state = getState() as RootState;
          const query = state.productions.query;

          const { data } = await queryFulfilled;

          toast.success(data.message || "Production Create Success");
          dispatch(
            productionApi.util.updateQueryData(
              "getProductions",
              query,
              (draft) => {
                if (data.production) {
                  draft.productions.unshift(data.production);
                }
              },
            ),
          );
        } catch (error) {
          console.log({ error });
        }
      },
    }),
    updateProduction: builder.mutation({
      query: ({
        formData,
        id,
      }: {
        formData: CreateProductionDtoType;
        id: string;
      }) => ({
        url: `/${id}`,
        method: "PUT",
        body: formData,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        try {
          const state = getState() as RootState;
          const query = state.productions.query;

          const {
            data,
          }: { data: { production: ProductionType; message: string } } =
            await queryFulfilled;

          toast.success(data.message || "Production Update Success");
          dispatch(
            productionApi.util.updateQueryData(
              "getProductions",
              query,
              (draft) => {
                if (data.production) {
                  const productionToUpdate = draft.productions.find(
                    (item) => item._id == data.production._id,
                  );

                  if (productionToUpdate) {
                    Object.assign(productionToUpdate, data.production);
                  }
                  draft.productions.unshift(data.production);
                }
              },
            ),
          );
        } catch (error) {
          console.log({ error });
        }
      },
    }),
  }),
});

export const {
  useGetProductionsQuery,
  useGetProductionsReportQuery,
  useGetProductionsChartQuery,
  useGetProductionByIdQuery,
  useLazyGetProductionByIdQuery,
  useCreateProductionMutation,
  useUpdateProductionMutation,
  useGetProductionsReportPDFQuery,
} = productionApi;
