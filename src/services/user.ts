import { BASE_URL } from "@/constant/base-url";
import type { LoginBody, User } from "@/types/auth";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "./helpers/prepareHeaders";
import { Pagination } from "@/types/pagination";
import toast from "react-hot-toast";
type findUsersQuery = {
  page?: number;
  limit?: number;
  sort_type?: "desc" | "asc";
  sort_key?: string;
  search?: string;
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1/`,
    prepareHeaders: prepareHeaders,
  }), // Replace with your API base URL
  endpoints: (builder) => ({
    fetchMe: builder.query<User, "">({
      query: () => `auth/me`,
    }),

    login: builder.mutation({
      query: (formData: LoginBody) => ({
        url: "auth/login",
        method: "POST",
        body: formData,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (formData: LoginBody & { confirmPassword: string }) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: formData,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (formData: { email: string; code: string }) => ({
        url: "auth/verify-email",
        method: "POST",
        body: formData,
      }),
    }),
    GrantAccess: builder.mutation({
      query: (formData: { userId: string; path: string; access: boolean }) => ({
        url: "auth/grant-access/" + formData.userId,
        method: "PUT",
        body: formData,
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        const { data } = await queryFulfilled;
        toast.success(data.message || "Customer Update Success");
      },
    }),
    GetUsers: builder.query<
      { users: User[]; pagination: Pagination },
      findUsersQuery
    >({
      query: () => `auth/users`,
    }),
    getAccessControl: builder.query<
      {
        _id: string;
        userId: string;
        accessLinks: { path: string; access: boolean }[];
      },
      string
    >({
      query: (id) => `auth/access-control/${id}`,
    }),
  }),
});

export const {
  useFetchMeQuery,
  util,
  reducer,
  useLoginMutation,
  useLazyFetchMeQuery,
  useGetUsersQuery,
  useGrantAccessMutation,
  useGetAccessControlQuery,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
} = userApi;
