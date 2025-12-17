export const getSvgText = ({
  text,
  x = 10,
  y = 40,
}: {
  text: string | number;
  x?: number;
  y?: number;
}) => {
  return `<svg>
            <text
              transform="translate(${x}, ${y}) rotate(-90)"
              style="font-size: 8px;"
            >
            ${text}
            </text>
          </svg>`;
};

export const header1 = [
  { text: "SL", rowSpan: 2, alignment: "center", margin: [0, 30] },

  { text: "Personal Information", colSpan: 5, alignment: "center", bold: true },
  { text: "" },
  { text: "" },
  { text: "" },
  { text: "" },

  {
    text: "Attendance Information",
    colSpan: 6,
    alignment: "center",
    bold: true,
  },
  { text: "" },
  { text: "" },
  { text: "" },
  { text: "" },
  { text: "" },

  { text: "Wages Information", colSpan: 8, alignment: "center", bold: true },
  { text: "" },
  { text: "" },
  { text: "" },
  { text: "" },
  { text: "" },
  { text: "" },
  { text: "" },

  { text: "Overtime Work", colSpan: 3, alignment: "center", bold: true },

  { text: "" },
  { text: "" },

  {
    svg: `
          <svg>
            <text
              transform="translate(10, 50) rotate(-90)"
              style="font-size: 8px;"
            >
           Bonus /
            </text>
            <text
              transform="translate(20, 65) rotate(-90)"
              style="font-size: 8px;"
            >
           Other Allowance
            </text>
          </svg>
        `,
    rowSpan: 2,
  },
  {
    svg: getSvgText({ text: "Advance", x: 15, y: 52 }),
    rowSpan: 2,
  },

  {
    rowSpan: 2,
    svg: `
          <svg>
            <text
              transform="translate(18, 57) rotate(-90)"
              style="font-size: 8px;"
            >
            Net Payable
            </text>
            <text
              transform="translate(30, 48) rotate(-90)"
              style="font-size: 8px;"
            >
            Wages
            </text>
          </svg>
        `,
  },
  { text: "Signature", rowSpan: 2, alignment: "center", margin: [0, 30, 0, 0] },
];
export const header2 = [
  { text: "" },

  { text: "Name", alignment: "center", margin: [0, 20, 0, 0] },
  {
    svg: getSvgText({ text: "Card No", x: 18 }),
  },
  {
    svg: getSvgText({ text: "Designation", x: 25, y: 48 }),
  },
  {
    svg: getSvgText({ text: " Joining Date", x: 12, y: 48 }),
    height: 50,
  },

  { text: "Wages", alignment: "center", margin: [0, 20] },
  {
    svg: `
          <svg>
            <text
              transform="translate(8, 45) rotate(-90)"
              style="font-size: 8px;"
            >
            Total Days
            </text>
            <text
              transform="translate(18, 42) rotate(-90)"
              style="font-size: 8px;"
            >
            In Month
            </text>
          </svg>
        `,
  },
  {
    svg: getSvgText({ text: " Present Days", x: 12, y: 48 }),
  },
  {
    svg: getSvgText({ text: " Holiday", x: 12, y: 42 }),
  },

  { text: "C.L", alignment: "center", rotation: 90, margin: [0, 20, 0, 0] },
  { text: "S.L", alignment: "center", rotation: 90, margin: [0, 20, 0, 0] },
  { text: "E.L", alignment: "center", rotation: 90, margin: [0, 20, 0, 0] },

  {
    svg: getSvgText({ text: " Absent Days", x: 12, y: 49 }),
  },
  { text: "Basic", alignment: "center", margin: [0, 20, 0, 0] },
  {
    svg: getSvgText({ text: " House Rent", x: 12, y: 49 }),
  },
  {
    svg: getSvgText({ text: " Medical", x: 12, y: 40 }),
  },
  {
    svg: getSvgText({ text: " Food", x: 12, y: 35 }),
  },
  {
    svg: getSvgText({ text: "Conveyance", x: 12, y: 48 }),
  },

  {
    svg: `
          <svg>
            <text
              transform="translate(12, 40) rotate(-90)"
              style="font-size: 8px;"
            >
            Absent
            </text>
            <text
              transform="translate(20, 45) rotate(-90)"
              style="font-size: 8px;"
            >
            Deduction
            </text>
          </svg>
        `,
  },
  {
    // Total Wages As Per Attendence
    svg: `
          <svg>
            <text
              transform="translate(12, 49) rotate(-90)"
              style="font-size: 7px;"
            >
            Total Wages As
            </text>
            <text
              transform="translate(20, 48) rotate(-90)"
              style="font-size: 7px;"
            >
            Per Attendence
            </text>
          </svg>
        `,
  },

  {
    svg: getSvgText({ text: "O.T Hour", x: 15, y: 42 }),
  },
  {
    svg: getSvgText({ text: "O.T Rate", x: 15, y: 42 }),
  },
  {
    svg: getSvgText({ text: "O.T Amount", x: 15, y: 48 }),
  },
  {
    svg: getSvgText({ text: "Advance", x: 15, y: 42 }),
  },
  {
    svg: getSvgText({ text: "Advance", x: 15, y: 42 }),
  },

  {
    svg: `
          <svg>
            <text
              transform="translate(12, 49) rotate(-90)"
              style="font-size: 8px;"
            >
              Net Payable
            </text>
          </svg>
        `,
  },
  {
    text: "Signature",
    alignment: "center",
    rotation: 90,
    margin: [0, 6, 0, 0],
  },
];
