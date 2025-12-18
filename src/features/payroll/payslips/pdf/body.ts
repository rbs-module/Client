import { PayslipData } from "@/types/payroll";
import { numberWithCommas } from "@/utils/currency-formatter";
import { format } from "date-fns";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { payrollConfig } from "../../employee/createPayslip/config";

export const getPayslipPdfBOdy = (payslip: PayslipData, i: number) => {
  return [
    // sl no
    { text: i + 1, margin: [0, 15, 0, 0], alignment: "center" },

    // name
    {
      text: payslip.employee?.name,
      margin: [0, payslip.employee?.name.length > 13 ? 8 : 15, 0, 0],
      bold: true,
      fontSize: 10,
    },

    // id no
    {
      text: payslip.employee?.id_no,
      alignment: "center",
      margin: [0, 15, 0, 0],
    },

    // designation
    {
      text: payslip.employee?.designation,
      alignment: "center",
      margin: [0, 15, 0, 0],
    },

    // joining date
    {
      svg: `
              <svg>
                <text
                  transform="translate(12, 35) rotate(-90)"
                  style="font-size: 8px;"
    
                >
                ${payslip.employee?.joining_date ? format(String(payslip.employee?.joining_date ?? new Date()) || "", "dd-MM-yy") : ""}
                </text>
              </svg>
            `,
      height: payslip._id ? 40 : undefined,
    },

    // basic
    {
      text: numberWithCommas(payslip.basic, 0),
      margin: [0, 15, 0, 0],
      alignment: "right",
    },

    // working days
    { text: payslip.working_days, margin: [0, 15, 0, 0], alignment: "center" },

    // present days
    { text: payslip.present_days, margin: [0, 15, 0, 0], alignment: "center" },

    { text: "-", margin: [0, 15, 0, 0], alignment: "center" },
    { text: "-", margin: [0, 15, 0, 0], alignment: "center" },
    {
      text: payslip.leave_days == 0 ? "-" : payslip.leave_days,
      margin: [0, 15, 0, 0],
      alignment: "center",
    },
    { text: "-", margin: [0, 15, 0, 0], alignment: "center" },
    {
      text: payslip.absent_days == 0 ? "-" : payslip.absent_days,
      margin: [0, 15, 0, 0],
      alignment: "center",
    },

    {
      text: numberWithCommas(payslip.basic - 1100 / 1.4, 0),
      margin: [0, 15, 0, 0],
      alignment: "right",
    },
    {
      text: numberWithCommas(4200, 0),
      margin: [0, 15, 0, 0],
      alignment: "center",
    },
    {
      text: numberWithCommas(250, 0),
      margin: [0, 15, 0, 0],
      alignment: "center",
    },
    {
      text: numberWithCommas(650, 0),
      margin: [0, 15, 0, 0],
      alignment: "center",
    },
    {
      text: numberWithCommas(200, 0),
      margin: [0, 15, 0, 0],
      alignment: "center",
    },
    {
      text:
        payslip.absent_deduction == 0
          ? "-"
          : numberWithCommas(payslip.absent_deduction, 0),
      margin: [0, 15, 0, 0],
      alignment: "center",
    },

    {
      text: numberWithCommas(
        payslip.net_payable - payslip.overtimePay - payslip.advanceDeduction,
        0,
      ),
      margin: [0, 15, 0, 0],
      alignment: "center",
    },

    {
      text: payslip.overtime_hours,
      margin: [0, 15, 0, 0],
      alignment: "center",
    },
    {
      text: numberWithCommas(payrollConfig.getHourlyOTRate(payslip.basic), 2),
      margin: [0, 15, 0, 0],
      alignment: "center",
    },
    {
      text: numberWithCommas(payslip.overtimePay, 0),
      margin: [0, 15, 0, 0],
      alignment: "center",
    },

    // Advance, Net Payable, Signature — keep signature empty object (not plain "")
    {
      text: payslip.otherAllowances
        ? numberWithCommas(payslip.otherAllowances, 0)
        : "-",
      alignment: "center",
      margin: [0, 15, 0, 0],
    },

    {
      text: payslip.advanceDeduction
        ? numberWithCommas(payslip.advanceDeduction, 0)
        : "-",
      alignment: "center",
      margin: [0, 15, 0, 0],
    },
    {
      text: numberWithCommas(payslip.net_payable, 0) || "",
      bold: true,
      alignment: "right",
      fontSize: 11,
      margin: [0, 15, 0, 0],
    },
    // Signature cell: give empty text but enough minHeight via header heights below
    { text: "" },
  ] as TDocumentDefinitions["content"];
};
