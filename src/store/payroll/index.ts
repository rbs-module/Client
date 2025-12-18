import { BASE_URL } from "@/constant/base-url";
import { Pagination } from "@/types/pagination";
import { objToQueryString } from "@/utils/queryString";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FindAccountsQueryType } from "@/zod-schemas/accounts/find-accounts-schema";
import { prepareHeaders } from "@/services/helpers/prepareHeaders";
import {
  Department,
  Employee,
  EmployeeHistoryType,
  FindPayslipQuery,
  PayslipData,
} from "@/types/payroll";
import { DefaultQueryParamsDTOType } from "@/zod-schemas/default-query-paramsDTO";

export const payrollApi = createApi({
  reducerPath: "payrollApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1/payroll/`,
    prepareHeaders: prepareHeaders,
  }),

  endpoints: (builder) => ({
    getEmployee: builder.query<
      { employee: Employee[]; pagination: Pagination },
      Partial<FindAccountsQueryType>
    >({
      query: (query) => `employees?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),
    getEmployeeById: builder.query<Employee, string>({
      query: (id) => `employees/${id}`,
      keepUnusedDataFor: 300,
    }),
    getPayslips: builder.query<
      { payslips: PayslipData[]; pagination: Pagination },
      FindPayslipQuery
    >({
      query: (query) => `payslips?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),
    getPayslipsByd: builder.query<PayslipData, string>({
      query: (id) => `payslips/${id}`,
      keepUnusedDataFor: 300,
    }),
    getPayslipsByEmployeeId: builder.query<
      { payslips: PayslipData[]; pagination: Pagination },
      { query: Partial<DefaultQueryParamsDTOType>; id: string }
    >({
      query: ({ id, query }) =>
        `employees/payslips/${id}?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),
    getEmployeeHistory: builder.query<
      {
        history: EmployeeHistoryType[];
        pagination: Pagination;
        employee: Employee;
      },
      { query: Partial<DefaultQueryParamsDTOType>; id: string }
    >({
      query: ({ id, query }) =>
        `employees/${id}/history?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),

    createEmployee: builder.mutation({
      query: (data: Partial<Employee>) => ({
        url: "/employees",
        method: "POST",
        body: data,
      }),
    }),
    getEmployeeId: builder.query<{ id_no: number }, void>({
      query: () => `employees/id`,
      keepUnusedDataFor: 60,
    }),

    getEmployeeAdvance: builder.query<number, string>({
      query: (id) => `employees/${id}/advance`,
      keepUnusedDataFor: 60,
    }),
    updateEmployeeAdvance: builder.query<number, string>({
      query: (id) => `employees/${id}/advance`,
      keepUnusedDataFor: 60,
    }),
    updateEmployee: builder.mutation({
      query: (data: { body: Partial<Employee>; id: string }) => ({
        url: `/employees/${data.id}`,
        method: "PUT",
        body: data.body,
      }),
    }),
    createPayslip: builder.mutation({
      query: ({ body, id }: { body: Partial<PayslipData>; id: string }) => ({
        url: `/employees/${id}`,
        method: "POST",
        body,
      }),
    }),
    updatePayslip: builder.mutation({
      query: ({ body, id }: { body: Partial<PayslipData>; id: string }) => ({
        url: `/payslips/${id}`,
        method: "PUT",
        body,
      }),
    }),
    // Department
    findDepartments: builder.query<
      { departments: Department[]; pagination: Pagination },
      Partial<DefaultQueryParamsDTOType>
    >({
      query: (query) => `/departments?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useGetEmployeeQuery,
  useGetEmployeeByIdQuery,
  useGetPayslipsByEmployeeIdQuery,
  useGetPayslipsQuery,
  useGetPayslipsBydQuery,
  useCreateEmployeeMutation,
  useGetEmployeeIdQuery,
  useUpdateEmployeeMutation,
  useGetEmployeeAdvanceQuery,
  useCreatePayslipMutation,
  useUpdatePayslipMutation,
  useLazyGetEmployeeQuery,
  useGetEmployeeHistoryQuery,

  useFindDepartmentsQuery,
} = payrollApi;
