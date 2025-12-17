import { BASE_URL } from "@/constant/base-url";
import type { Organization, OrganizationAccounts } from "@/types/organization";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "./helpers/prepareHeaders";

export const organizationApi = createApi({
  reducerPath: "organizationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1/organization/`,
    prepareHeaders: prepareHeaders,
  }), // Replace with your API base URL
  endpoints: (builder) => ({
    fetchMyOrganization: builder.query<Organization, null | void>({
      query: () => `my-organization`,
    }),
    fetchMyOrganizationAccounts: builder.query<OrganizationAccounts, null>({
      query: () => `my-organization/accounts`,
    }),
  }),
});

export const {
  useFetchMyOrganizationQuery,
  useFetchMyOrganizationAccountsQuery,
} = organizationApi;
