import { BASE_URL } from "@/constant/base-url";
import { prepareHeaders } from "@/services/helpers/prepareHeaders";
import { BillPaymentReport } from "@/types/reports";
import { objToQueryString } from "@/utils/queryString";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1/reports`,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    billPayment: builder.query<
      BillPaymentReport,
      { start_date: string; end_date: string }
    >({
      query: (query) => `bill-payment?${objToQueryString(query)}`,
    }),
  }),
});

export const { useBillPaymentQuery } = reportApi;
