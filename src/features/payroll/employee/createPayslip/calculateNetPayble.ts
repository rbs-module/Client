// import { payrollConfig } from "./config";

// type Data = {
//   basic: number;
//   advanceDeduction: number;
//   otherAllowances: number;
//   otherDeductions: number;
//   overtime_hours: number;
//   working_days: number;
//   leave_days: number;
//   absent_days: number;
// };
// export const calculateMonthlyPayroll = (data: Data) => {
//   const {
//     basic,
//     advanceDeduction,
//     otherAllowances,
//     otherDeductions,
//     overtime_hours,
//     working_days,
//     leave_days,
//     absent_days,
//   } = data;

//   // 1. Daily basic salary
//   const dailySalary = basic / working_days;
//   const hourlyRate = payrollConfig.getHourlyOTRate(basic); // assuming 8 working hours per day

//   //   overtimePay = overtime_hours * hourlyRate * 2; // double rate for overtime
//   const overtimePay = overtime_hours * hourlyRate;

//   // 2. Basic earned according to present days
//   const absent_deduction = payrollConfig.getAbsenceDeduction({
//     absent_days,
//     basic,
//   });

//   //  leave earnings
//   const leave_amount = dailySalary * leave_days;

//   // 3. Total earnings
//   const totalEarnings = +overtimePay + +otherAllowances + +leave_amount + basic;

//   // 4. Total deductions
//   const totalDeductions = advanceDeduction + otherDeductions + absent_deduction;

//   // 5. Net payable salary
//   const net_payable = Number((totalEarnings - totalDeductions).toFixed(2));

//   return {
//     overtimePay: Number(overtimePay.toFixed(2)),
//     dailySalary: Number(dailySalary.toFixed(2)),
//     totalEarnings: Number(totalEarnings.toFixed(2)),
//     totalDeductions: Number(totalDeductions.toFixed(2)),
//     leave_amount,
//     net_payable,
//     advanceDeduction,
//   };
// };

import { getDaysInMonth } from "date-fns";
import { payrollConfig } from "./config";
import { Employee, PayslipData } from "@/types/payroll";

type Input = {
  employee?: Employee;
  otherAllowances: number;
  otherDeductions: number;
  overtime_hours: number;
  month: string;
  present_days: number;
  leave_days: number;
  advanceDeduction: number;
};

export const calculateMonthlyPayroll = (data: Input): PayslipData => {
  const {
    employee,
    otherAllowances,
    otherDeductions,
    overtime_hours,
    present_days,
    leave_days,
    month,
    advanceDeduction,
  } = data;

  const working_days = getDaysInMonth(new Date(month));
  const absent_days = working_days - present_days;

  const basic = employee?.salary || 0;

  // 1. Daily basic salary
  const dailySalary = basic / working_days;
  const hourlyRate = payrollConfig.getHourlyOTRate(basic); // assuming 8 working hours per day

  //   overtimePay = overtime_hours * hourlyRate * 2; // double rate for overtime
  const overtimePay = overtime_hours * hourlyRate;

  // 2. Basic earned according to present days
  const absent_deduction = payrollConfig.getAbsenceDeduction({
    absent_days,
    basic,
  });

  //  leave earnings
  const leave_amount = dailySalary * leave_days;

  // 3. Total earnings
  const totalEarnings = +overtimePay + +otherAllowances + +leave_amount + basic;

  // 4. Total deductions
  const totalDeductions = advanceDeduction + otherDeductions + absent_deduction;

  // 5. Net payable salary
  const net_payable = Number((totalEarnings - totalDeductions).toFixed(2));

  return {
    overtimePay: Number(overtimePay.toFixed(2)),
    leave_amount,
    net_payable,
    advanceDeduction,
    absent_days,
    absent_deduction,
    basic,
    employee: {
      _id: employee?._id || "",
      name: employee?.name || "",
      department: employee?.department,
      designation: employee?.designation,
      email: employee?.email,
      id_no: employee?.id_no || "",
    },
    leave_days,
    month,
    organization_id: employee?.organization_id || "",
    otherAllowances,
    otherDeductions,
    overtime_hours,
    present_days,
    working_days,
    _id: "",
  };
};
