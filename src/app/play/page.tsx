/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TDocumentDefinitions } from "pdfmake/interfaces";
import { useEffect, useState } from "react";
import { header1, header2 } from "./header";

const employees = [
  {
    slNo: "01",
    name: "MD. Sojib Mia-(1)",
    card: "90069",
    designation: "Gn. Em.\nOperator",
    joining: "Mar-22",
    wages: "15,800",
    workingDays: 31,
    present: 27,
    cl: "-",
    sl: "-",
    el: "-",
    absent: 4,
    basic: "10,500",
    houseRent: "4,200",
    medical: "250",
    food: "650",
    conveyance: "200",
    absentDeduction: "2,108.87",
    totalWages: "13,693",
    otHour: "-",
    otRate: "-",
    otTotal: "-",
    advance: "",
    netPayable: "13,693",
  },
  {
    slNo: "02",
    name: "MD Sojib (2)",
    card: "298",
    designation: "Gn. Em.\nOperator",
    joining: "1-Sep-22",
    wages: "14,500",
    workingDays: 31,
    present: 24,
    cl: "-",
    sl: "-",
    el: "-",
    absent: 7,
    basic: "9,571",
    houseRent: "3,829",
    medical: "250",
    food: "650",
    conveyance: "200",
    absentDeduction: "3,383.33",
    totalWages: "11,117",
    otHour: "-",
    otRate: "-",
    otTotal: "-",
    advance: "",
    netPayable: "11,117",
  },
];

const tableBody: any[] = [];

// HEADER ROW 1 (group headings + rowSpan/colSpans)
tableBody.push(header1);

// HEADER ROW 2 (actual column labels). Note rotations for narrow vertical labels.
tableBody.push(header2);

// BODY ROWS (ensure ordering is exactly same number of columns)
employees.forEach((e) => {
  tableBody.push([
    { text: e.slNo },

    { text: e.name },
    { text: e.card, alignment: "center" },
    { text: e.designation, alignment: "center" },
    {
      svg: `
          <svg>
            <text
              transform="translate(12, 35) rotate(-90)"
              style="font-size: 8px;"
            >
            ${e.joining}
            </text>
          </svg>
        `,
      height: 40,
    },
    { text: e.wages },

    { text: e.workingDays },
    { text: e.present },
    { text: "-" },
    { text: e.cl },
    { text: e.sl },
    { text: e.el },
    { text: e.absent },

    { text: e.basic },
    { text: e.houseRent },
    { text: e.medical },
    { text: e.food },
    { text: e.conveyance },
    { text: e.absentDeduction },
    { text: e.totalWages },

    { text: e.otHour },
    { text: e.otRate },
    { text: e.otTotal },

    // Advance, Net Payable, Signature — keep signature empty object (not plain "")
    { text: e.advance || "" },
    { text: e.netPayable || "", bold: true, alignment: "right" },
    // Signature cell: give empty text but enough minHeight via header heights below
    { text: "" },
  ]);
});

// BUILD DOC DEFINITION
const docDefinition: TDocumentDefinitions = {
  pageOrientation: "landscape",
  pageSize: "LEGAL",
  pageMargins: [15, 60, 15, 30],
  defaultStyle: {
    fontSize: 8,
  },

  header: {
    margin: [20, 20, 20, 0],
    stack: [
      {
        text: "Prominent Apparels Ltd.",
        alignment: "center",
        bold: true,
        fontSize: 16,
      },
      {
        text: "A-149/150, Bscic I/E, Fatullah, Narayanganj-1400.",
        alignment: "center",
        fontSize: 10,
      },
      {
        text: "Worker Salary Advance, Oct-2025.",
        alignment: "center",
        fontSize: 11,
        margin: [0, 2, 0, 0],
      },

      {
        columns: [
          { text: "SECTION: EMBROIDERY", bold: true, fontSize: 12 },
          { text: "Date : 7-NOV-25", alignment: "right", fontSize: 12 },
        ],
        margin: [0, 10, 0, 0],
      },
    ],
  },

  footer: function (currentPage: number, pageCount: number) {
    return {
      columns: [
        { text: "Prepared By", alignment: "left", margin: [20, 0, 0, 0] },
        { text: `PAGE - ${currentPage} OF ${pageCount}`, alignment: "center" },
        { text: "Authorized By", alignment: "right", margin: [0, 0, 20, 0] },
      ],
      margin: [0, 10],
    };
  },

  content: [
    {
      table: {
        headerRows: 2,

        // widths must match number of columns. Adjust to taste.
        widths: [
          10, // SL
          80, // Name
          30, // Card
          40, // Designation
          20, // Joining (rotated)
          38, // Wages
          20, // Working Days (rotated)
          20, // Present Days (rotated)
          20, // Holiday
          15, // C.L
          15, // S.L
          15, // E.L
          20, // Absent Days
          35, // Basic
          20, // House Rent
          20, // Medical
          20, // Food
          20, // Conveyance
          35, // Absent Deduction
          30, // Total Wages
          25, // O.T Hour
          25, // O.T Rate
          25, // O.T Total
          25, // Advance (rotated)
          56, // Net Payable Wages
          "*", // Signature (rotated)
        ],

        // header + body
        body: tableBody,
        // you can set heights per row by using `heights` below:
      },

      // layout controls padding and borders
      layout: {
        // increase vertical padding so rotated text isn't clipped
        paddingTop: () => 6,
        paddingBottom: () => 6,
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        // optionally reduce left/right padding to squeeze table
        paddingLeft: () => 4,
        paddingRight: () => 4,
      },

      // explicit heights for rows — header rows  get taller so rotated labels are visible.
      // heights takes a number[] or function. We'll pass function to set first two rows higher.
    },
  ],
};

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      const pdfMakeModule = await import("pdfmake/build/pdfmake");
      const pdfFontsModule = await import("pdfmake/build/vfs_fonts");

      const pdfMake: any = pdfMakeModule.default || pdfMakeModule;
      const pdfFonts: any = pdfFontsModule.default || pdfFontsModule;

      pdfMake.vfs = pdfFonts.pdfMake?.vfs || pdfFonts.vfs;

      const pdf = pdfMake.createPdf(docDefinition);
      pdf.getBlob((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      });
    };

    loadPdf().catch((err) => console.error("PDFMake load error:", err));
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      {pdfUrl ? (
        <iframe
          src={pdfUrl || ""}
          title="PDF Preview"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      ) : (
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          Generating PDF...
        </p>
      )}
    </div>
  );
}
