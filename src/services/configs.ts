import { BASE_URL } from "@/constant/base-url";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "./helpers/prepareHeaders";

export type ApiRoutes = {
  name: string;
  path?: string;
  method?: "get" | "post" | "put" | "delete" | "patch";
  descriptions?: string;
  id: string;
  access?: string[]; // roles that can access this route
};

export const configsApi = createApi({
  reducerPath: "configsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1/`,
    prepareHeaders: prepareHeaders,
  }), // Replace with your API base URL
  endpoints: (builder) => ({
    routes: builder.query<ApiRoutes[], null>({
      query: () => `configs/routes`,
    }),
  }),
});

export const { useRoutesQuery } = configsApi;
