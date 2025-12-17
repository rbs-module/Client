"use client";
import {
  Typography,
  Divider,
  Card,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell as Cell,
  TableCellProps,
  TableHead,
  ThemeProvider,
} from "@mui/material";

const TableCell = (props: TableCellProps) => {
  return (
    <Cell
      {...props}
      sx={{ border: 1, borderColor: "divider", py: 0.5, ...props.sx }}
    />
  );
};

import { useFetchMyOrganizationQuery } from "@/services/organization";
import { addDays, addMonths, format } from "date-fns";
import { numberWithCommas } from "@/utils/currency-formatter";
import { toWords } from "@/utils/to_words";
import Row from "@/components/Row";
import { PayslipData } from "@/types/payroll";
import { lightTheme } from "@/theme/lightTheme";
import { usePayrollStore } from "@/store/payroll/hooks";

export default function Payslip({ data }: { data?: Partial<PayslipData> }) {
  const { payrollCreationMonth } = usePayrollStore();

  const {
    // month = payrollCreationMonth,
    basic,
    absent_days,
    leave_days,
    overtime_hours,
    overtimePay,
    advanceDeduction,
    otherAllowances,
    otherDeductions,
    net_payable,
    absent_deduction,
    leave_amount,
  } = data || {};
  const { data: org } = useFetchMyOrganizationQuery(null);
  return (
    <ThemeProvider theme={lightTheme}>
      <Card sx={{ p: 2, px: 8, mx: "auto" }}>
        <Typography
          variant="h5"
          align="center"
          fontWeight={800}
          gutterBottom
          fontSize={20}
          sx={{ mt: 2 }}
        >
          {org?.organization_name}
        </Typography>
        <Typography align="center" gutterBottom sx={{ my: 0.5 }}>
          {org?.organization_address}
        </Typography>
        <Typography
          variant="h5"
          align="center"
          fontWeight={600}
          gutterBottom
          fontSize={14}
        >
          Salary Slip for the month of {payrollCreationMonth}
        </Typography>
        <Divider />
        <Box sx={{ mt: 3 }}>
          <Row sx={{ justifyContent: "space-between" }}>
            <table>
              <tbody>
                <tr>
                  <td className="p-[2px] px-2">
                    <b>Employee Name </b>
                  </td>
                  <td className="p-[2px] px-2">: {data?.employee?.name}</td>
                </tr>
                <tr>
                  <td className="p-[2px] px-2">
                    <b>Employee ID </b>
                  </td>
                  <td className="p-[2px] px-2">: {data?.employee?.id_no}</td>
                </tr>
                <tr>
                  <td className="p-[2px] px-2">
                    <b>Position </b>
                  </td>
                  <td className="p-[2px] px-2">
                    : {data?.employee?.designation}
                  </td>
                </tr>
              </tbody>
            </table>
            <table>
              <tbody>
                <tr>
                  <td className="p-[2px] px-2">
                    <b>Pay Period </b>
                  </td>
                  <td className="p-[2px] px-2">: {payrollCreationMonth}</td>
                </tr>
                <tr>
                  <td className="p-[2px] px-2">
                    <b>Pay Date </b>
                  </td>
                  <td className="p-[2px] px-2">
                    :
                    {format(
                      addDays(
                        addMonths(
                          new Date(payrollCreationMonth ?? new Date()),
                          1,
                        ),
                        6,
                      ),
                      "dd-MM-yyyy",
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </Row>
          <Table>
            <TableHead sx={{ bgcolor: "lightcyan" }}>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: 700, textAlign: "center", py: 0.2 }}
                >
                  Earnings
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, textAlign: "center", py: 0.2 }}
                >
                  Amount (৳)
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, textAlign: "center", py: 0.2 }}
                >
                  Deductions
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, textAlign: "center", py: 0.2 }}
                >
                  Amount (৳)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Basic Salary</TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  {numberWithCommas(basic)}
                </TableCell>
                <TableCell>Absences ({absent_days} days)</TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  {numberWithCommas(absent_deduction)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Overtime Pay ({overtime_hours} hrs)</TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  {numberWithCommas(overtimePay)}
                </TableCell>
                <TableCell>Advance Deduction</TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  {numberWithCommas(advanceDeduction)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Other Allowances</TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  {numberWithCommas(Number(otherAllowances))}
                </TableCell>
                <TableCell>Other Deduction</TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  {numberWithCommas(otherDeductions)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Leave ({leave_days} Days)</TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  {numberWithCommas(leave_amount)}
                </TableCell>
                <TableCell></TableCell>
                <TableCell sx={{ textAlign: "right" }}></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Gross Salary</TableCell>
                <TableCell sx={{ textAlign: "right", fontWeight: 700 }}>
                  {numberWithCommas(
                    basic! +
                      (overtimePay || 0) +
                      (otherAllowances || 0) +
                      (leave_amount || 0),
                  )}
                </TableCell>

                <TableCell>Total Deductions</TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  {numberWithCommas(
                    (absent_deduction || 0) +
                      (advanceDeduction || 0) +
                      (otherDeductions || 0),
                  )}
                </TableCell>
              </TableRow>
              <TableRow></TableRow>
              <TableRow>
                <TableCell colSpan={4} sx={{ fontWeight: 700 }}></TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} sx={{ fontWeight: 700 }}>
                  Net Payable
                </TableCell>
                <TableCell
                  colSpan={2}
                  sx={{ textAlign: "right", fontWeight: 800 }}
                >
                  {numberWithCommas(Number(net_payable?.toFixed(2)))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Typography>In Word: {toWords(net_payable || 0)}</Typography>
        </Box>

        <Row sx={{ justifyContent: "space-between", mt: 8 }}>
          <Typography sx={{ borderBottom: 1, px: 3 }}>
            Employee Signature
          </Typography>
          <Typography sx={{ borderBottom: 1, px: 3 }}>
            Authorized Signature
          </Typography>
        </Row>
      </Card>
    </ThemeProvider>
  );
}
