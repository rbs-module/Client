/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import RefreshLoading from "@/components/Loading/RefreshLoading";
import { header1, header2 } from "./tableHeader";
import { useGetPayslipsQuery } from "@/store/payroll";
import { Box, Stack, Typography } from "@mui/material";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { useEffect, useState } from "react";
import ToolBarStyled from "@/components/styled/ToolBar";
import { MonthPicker } from "@/components/MonthPicker";
import IconButtonStyled from "@/components/styled/IconButton";
import { Icons } from "@/components/icons";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import Link from "next/link";
import { PaginationBar } from "@/components/pagination/paginationBar";
import { getPayslipPdfBOdy } from "./body";
import { getPayslipPdfTotalRow } from "./totalRow";
import { payslipFooter } from "./footer";
import { usePayrollStore } from "@/store/payroll/hooks";
import { NoData } from "@/components/no-data/NoData";
import { useFetchMyOrganizationQuery } from "@/services/organization";
import { format } from "date-fns";

export default function PayslipsPDF() {
  const tableBody: any[] = [];

  // HEADER ROW 1 (group headings + rowSpan/colSpans)
  tableBody.push(header1);

  // HEADER ROW 2 (actual column labels). Note rotations for narrow vertical labels.
  tableBody.push(header2);

  const { setFindPayslipQuery: handleQueryChange, findPayslipQuery: query } =
    usePayrollStore();

  const { data, refetch, isLoading, isFetching } = useGetPayslipsQuery(query);

  const { data: org } = useFetchMyOrganizationQuery();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (
      // (data?.payslips?.length ?? 0) <= 0 ||
      !data ||
      data.payslips.length == 0 ||
      !org
    ) {
      setPdfUrl(null);
      return;
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, org]);

  // BODY ROWS (ensure ordering is exactly same number of columns)
  data?.payslips
    .filter((item) => item._id)
    .forEach((e, i) => {
      tableBody.push(getPayslipPdfBOdy(e, i));
    });

  const totalRow = data?.payslips.find((item) => !item._id);
  if (totalRow) {
    tableBody.push(getPayslipPdfTotalRow(totalRow));
  }

  // BUILD DOC DEFINITION
  const docDefinition: TDocumentDefinitions = {
    pageOrientation: "landscape",
    pageSize: "LEGAL",
    pageMargins: [15, 30, 15, 30],
    defaultStyle: {
      fontSize: 8,
    },

    footer: payslipFooter,
    content: [
      {
        stack: [
          {
            text: `${org?.organization_name}`,
            alignment: "center",
            bold: true,
            fontSize: 16,
          },
          {
            text: `${org?.organization_address}`,
            alignment: "center",
            fontSize: 10,
          },
          {
            text: `Worker Salary Advance, ${format(new Date(String(query.month)), "MMM-yyyy")}.`,
            alignment: "center",
            fontSize: 11,
            margin: [0, 2, 0, 0],
          },

          {
            columns: [
              {
                text: `SECTION: ${data?.payslips[0]?.employee.department?.toUpperCase()}`,
                bold: true,
                fontSize: 12,
              },
              { text: "Date : 7-NOV-25", alignment: "right", fontSize: 12 },
            ],
            margin: [0, 10, 0, 0],
          },
        ],
      },
      {
        table: {
          headerRows: 2,
          dontBreakRows: true, // <--- IMPORTANT
          // keepWithHeaderRows: true, // <--- keeps rows with header
          // header + body
          body: tableBody,
          // you can set heights per row by using `heights` below:

          // widths must match number of columns. Adjust to taste.
          widths: [
            10, // SL
            80, // Name
            30, // Card
            40, // Designation
            20, // Joining (rotated)
            35, // Wages
            20, // Working Days (rotated)
            20, // Present Days (rotated)
            20, // Holiday
            15, // C.L
            15, // S.L
            15, // E.L
            20, // Absent Days
            30, // Basic
            20, // House Rent
            20, // Medical
            20, // Food
            20, // Conveyance
            25, // Absent Deduction
            30, // Total Wages
            25, // O.T Hour
            25, // O.T Rate
            25, // O.T Total
            25, // others (rotated)
            25, // Advance (rotated)
            45, // Net Payable Wages
            "*", // Signature (rotated)
          ],
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
      },
    ],
  };

  return (
    <Box
      mx={1}
      mt={1}
      maxHeight={"calc(100vh - 150px)"}
      minHeight={`calc(100vh - 150px)`}
      height={Number(data?.payslips.length) * 25 + 80}
      minWidth={"1000px"}
    >
      <RefreshLoading isLoading={isFetching || isLoading} />
      <ToolBarStyled sx={{ my: 1 }}>
        <Typography variant="h6">Payslips</Typography>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <MonthPicker value={query.month} onChange={handleQueryChange} />
          <IconButtonStyled component={Link} href="/v1/payroll/payslips/create">
            <Icons.Add />
          </IconButtonStyled>
          <RefreshButton onClick={refetch} />
        </Stack>
      </ToolBarStyled>
      <div style={{ height: "100%" }}>
        {pdfUrl ? (
          <iframe
            src={pdfUrl || ""}
            title="Payslip"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        ) : (
          <NoData />
        )}
      </div>

      <PaginationBar
        onLimitChange={handleQueryChange}
        onPageChange={handleQueryChange}
        pagination={data?.pagination}
      />
    </Box>
  );
}
