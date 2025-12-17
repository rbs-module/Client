import { DynamicContent } from "pdfmake/interfaces";

export const payslipFooter: DynamicContent = (
  currentPage: number,
  pageCount: number,
) => {
  return {
    columns: [
      { text: "Prepared By", alignment: "left", margin: [20, 0, 0, 0] },
      {
        text: `PAGE - ${currentPage} OF ${pageCount} `,
        alignment: "center",
      },
      {
        text: "Authorized By",
        alignment: "right",
        margin: [30, 0, 30, 30],
      },
    ],
    margin: [0, 0, 0, 30],
    fontSize: 10,
  };
};
