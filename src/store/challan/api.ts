import { BASE_URL } from "@/constant/base-url";
import { prepareHeaders } from "@/services/helpers/prepareHeaders";
import {
  ChallanFormatted,
  ChallanOutput,
  CreateChallanBody,
  FindChallanQuery,
} from "@/types/challan";
import { Pagination } from "@/types/pagination";
import { objToQueryString } from "@/utils/queryString";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "..";
import toast from "react-hot-toast";

export const challanApi = createApi({
  reducerPath: "challanApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1/challan`,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    findChallan: builder.query<
      { challans: ChallanFormatted[]; pagination: Pagination },
      FindChallanQuery
    >({
      query: (query) => `?${objToQueryString(query)}`,
    }),
    getChallanById: builder.query<ChallanOutput, string>({
      query: (id) => `${id}`,
    }),

    getChallanByIdFormatted: builder.query<ChallanOutput, string>({
      query: (id) => `${id}?formatted=true`,
    }),
    createChallan: builder.mutation({
      query: (formData: CreateChallanBody) => ({
        url: "/",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        try {
          const state = getState() as RootState;
          const query = state.challan.query;

          const { data } = await queryFulfilled;

          toast.success(data.message || "Challan Create Success");
          dispatch(
            challanApi.util.updateQueryData("findChallan", query, (draft) => {
              if (data.challan) {
                draft.challans.unshift(data.challan);
              }
            }),
          );
        } catch (error) {
          console.log({ error });
        }
      },
    }),
    updateChallan: builder.mutation({
      query: ({
        formData,
        id,
      }: {
        formData: Partial<CreateChallanBody>;
        id: string;
      }) => ({
        url: `/${id}`,
        method: "PUT",
        body: formData,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        try {
          const state = getState() as RootState;
          const query = state.challan.query;

          const { data } = await queryFulfilled;

          toast.success(data.message || "Challan Create Success");
          dispatch(
            challanApi.util.updateQueryData("findChallan", query, (draft) => {
              if (data.challan) {
                const updateToChallan = draft.challans.find(
                  (item) => item._id == data.challan._id,
                );
                if (updateToChallan) {
                  Object.assign(updateToChallan, data.challan);
                }
              }
            }),
          );
        } catch (error) {
          console.log({ error });
        }
      },
    }),
  }),
});

export const {
  useFindChallanQuery,
  useGetChallanByIdQuery,
  useGetChallanByIdFormattedQuery,
  useCreateChallanMutation,
  useUpdateChallanMutation,
} = challanApi;
