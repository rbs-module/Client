import { PayslipData } from "@/types/payroll";
import { numberWithCommas } from "@/utils/currency-formatter";
import { TDocumentDefinitions } from "pdfmake/interfaces";

export const getPayslipPdfTotalRow = (data: PayslipData) => {
  return [
    // sl no
    { text: "Total", alignment: "center", colSpan: 5, bold: true },

    { text: "" },
    { text: "" },
    { text: "" },
    { text: "" },

    // basic
    {
      text: numberWithCommas(data.basic, 0),
      alignment: "right",
      bold: true,
      colSpan: 2,
    },

    // working days
    {
      text: "",
      alignment: "center",
    },
    // present days
    {
      text: "-",
      alignment: "center",
    },

    { text: "-", alignment: "center" },
    {
      text: "-",
      alignment: "center",
    },
    {
      text: data.leave_days == 0 ? "-" : data.leave_days,
      alignment: "center",
    },
    { text: "-", alignment: "center" },
    {
      text: data.absent_days == 0 ? "-" : data.absent_days,
      alignment: "center",
    },

    {
      text: numberWithCommas(data.basic - 1100 / 1.4, 0),
      colSpan: 2,
      alignment: "center",
      bold: true,
    },
    { text: "-" },
    { text: "-" },
    { text: "-" },
    { text: "-" },
    { text: data.absent_deduction.toFixed() },
    {
      text: (
        data.net_payable -
        data.overtimePay -
        data.advanceDeduction
      ).toFixed(),
    },
    { text: data.overtime_hours, alignment: "center" },
    { text: "-", alignment: "center" },
    { text: data.overtimePay, bold: true, alignment: "center" },

    // Advance, Net Payable, Signature — keep signature empty object (not plain "")
    { text: data.otherAllowances || "" },
    { text: data.advanceDeduction || "" },
    {
      text: numberWithCommas(data.net_payable, 0) || "",
      bold: true,
      alignment: "right",
      fontSize: 10,
    },
    // Signature cell: give empty text but enough minHeight via header heights below
    { text: "" },
  ] as TDocumentDefinitions["content"];
};
