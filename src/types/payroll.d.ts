/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultQueryParamsDTOType } from "@/zod-schemas/default-query-paramsDTO";

export interface Employee {
  _id: string;
  gallery: string[]; // assuming gallery contains image URLs or IDs
  date_of_birth: string; // could be Date if you prefer
  department: string;
  designation: string;
  is_active: boolean;
  joining_date: string; // or Date
  name: string;
  nid_no: string;
  phone: string;
  salary: number;
  id_no: string;
  organization_id: string; // could be Types.ObjectId in Mongoose
  createdAt: string; // or Date
  updatedAt: string; // or Date
  image?: string | undefined;
  email?: string | undefined;
}

export type FindEmployeeQuery = Partial<DefaultQueryParamsDTOType> & {
  is_active?: "true" | "false";
  lastPayrollMonth?: string;
  lastPayrollMonthNaN?: string;
};

// ====== TypeScript Interfaces ======
export interface EmployeeInfo {
  _id: string;
  name: string;
  phone?: string;
  designation?: string;
  department?: string;
  id_no?: string;
  email?: string;
  joining_date?: string;
}

export type FindPayslipQuery = Partial<
  DefaultQueryParamsDTOType & { month: string }
>;
export interface PayslipData {
  _id: string;
  employee: EmployeeInfo;
  month: string;
  basic: number;
  working_days: number;
  present_days: number;
  absent_days: number;
  leave_days: number;
  overtime_hours: number;
  overtimePay: number;
  advanceDeduction: number;
  otherAllowances: number;
  otherDeductions: number;
  net_payable: number;
  absent_deduction: number;
  leave_amount: number;
  organization_id: string;
  createdAt?: string;
}

export type EmployeeHistoryType = {
  employeeId: string;
  organization_id: string;
  action:
    | "comments"
    | "created"
    | "updated"
    | "deleted"
    | "payslip_created"
    | "payslip_updated"
    | "salary_advance";
  changes: {
    field: string;
    oldValue?: any;
    newValue?: any;
  }[];
  message?: string | undefined;
  _id?: string | undefined;
  details?: string | undefined;
  modified_by?:
    | {
        id: string;
        name: string;
      }
    | undefined;
  createdAt?: Date | undefined;
  referenceId?: string | undefined;
};
