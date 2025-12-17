import { BASE_URL } from "@/constant/base-url";
import { prepareHeaders } from "@/services/helpers/prepareHeaders";
import { RootState } from "@/store";
import type {
  CreateCustomerBodyType,
  Customer,
  CustomerChart,
  CustomerChartQueryType,
  CustomerStatementQueryType,
  CustomerStatementType,
  FindCustomersQuery,
  SearchedCustomer,
} from "@/types/customer";
import { Pagination } from "@/types/pagination";

import { objToQueryString } from "@/utils/queryString";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1/customer/`,
    prepareHeaders: prepareHeaders,
  }), // Replace with your API base URL
  endpoints: (builder) => ({
    search: builder.query<
      SearchedCustomer[],
      { limit?: number; search?: string }
    >({
      query: (query) => `search?${objToQueryString(query)}`,
    }),
    getCustomers: builder.query<
      { customers: Customer[]; pagination: Pagination },
      FindCustomersQuery
    >({
      query: (query) => `?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),
    getCustomerById: builder.query<Customer, string>({
      query: (id) => `/${id}`,
      keepUnusedDataFor: 300,
    }),
    // update customer =======================>>
    updateCustomer: builder.mutation({
      query: ({
        formData,
        id,
      }: {
        formData: Partial<Customer>;
        id: string;
      }) => ({
        url: `/${id}`,
        method: "PUT",
        body: formData,
      }),
      async onQueryStarted(
        { id, formData },
        { dispatch, queryFulfilled, getState },
      ) {
        const state = getState() as RootState;
        const query = state.customer.query;

        const { data } = await queryFulfilled;
        toast.success(data.message || "Customer Update Success");
        dispatch(
          customerApi.util.updateQueryData("getCustomers", query, (draft) => {
            const customerToUpdate = draft.customers.find(
              (customers) => customers._id == id,
            );
            if (customerToUpdate) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              Object.keys(formData).forEach((key: any) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (customerToUpdate as any)[key] =
                  formData[key as keyof Customer];
              });
            } else {
              console.log("notfound");
            }
          }),
        );
      },
    }),

    // <<=====update customer =======================<<
    //
    //
    // >>=========create===========>>
    createCustomer: builder.mutation({
      query: (formData: CreateCustomerBodyType) => ({
        url: `/create`,
        method: "POST",
        body: formData,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        try {
          const state = getState() as RootState;
          const query = state.customer.query;
          const { data } = await queryFulfilled;
          toast.success(data.message || "Customer Create Success");
          dispatch(
            customerApi.util.updateQueryData("getCustomers", query, (draft) => {
              if (data.customer) {
                draft.customers.unshift(data.customer);
              }
            }),
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    // <<=========create===========<<

    getCustomerChart: builder.query<
      CustomerChart,
      { query: Partial<CustomerChartQueryType>; id: string }
    >({
      query: ({ query, id }) =>
        `/${id}/statement/chart?${objToQueryString(query)}`,
    }),

    // statements
    getCustomerStatement: builder.query<
      CustomerStatementType,
      { query: CustomerStatementQueryType; id: string }
    >({
      query: ({ query, id }) => `/${id}/statement?${objToQueryString(query)}`,
    }),
  }),
});

export const {
  util,
  reducer,
  useSearchQuery,
  useLazySearchQuery,
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
  useGetCustomerChartQuery,
  useCreateCustomerMutation,
  useGetCustomerStatementQuery,
} = customerApi;
