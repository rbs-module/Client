"use client";
import { useRef } from "react";
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
  Stack,
  Button,
  CardContent,
  CardActions,
} from "@mui/material";

const TableCell = (props: TableCellProps) => {
  return (
    <Cell
      {...props}
      sx={{ border: 1, borderColor: "divider", py: 0.5, ...props.sx }}
    />
  );
};

import {
  useGetEmployeeAdvanceQuery,
  useGetPayslipsBydQuery,
  useUpdatePayslipMutation,
} from "@/store/payroll";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import { useFetchMyOrganizationQuery } from "@/services/organization";
import { addDays, addMonths, format } from "date-fns";
import { numberWithCommas } from "@/utils/currency-formatter";
import { toWords } from "@/utils/to_words";
import ToolBarStyled from "@/components/styled/ToolBar";
import Row from "@/components/Row";
import { useParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import useTriggerPrint from "@/hooks/useTriggerPrint";
import { Icons } from "@/components/icons";
import toast from "react-hot-toast";

export default function Payslip() {
  const activePage = useParams();
  const id = activePage.id;
  const { data, refetch } = useGetPayslipsBydQuery(id as string);

  const {
    month,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const componentRef = useRef<any>(null);

  // const { data: organization } = useFetchMyOrganizationQuery(null);
  const reactToPrintFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Payslip",
  });
  const {
    data: advance,
    refetch: refetchAdvance,
    isFetching: isFetchingAdvance,
  } = useGetEmployeeAdvanceQuery(String(data?.employee._id));
  const needAdvanceSettle = Boolean(
    advance && advance !== data?.advanceDeduction,
  );
  const [updatePayslip] = useUpdatePayslipMutation();
  const updateAdvance = async () => {
    try {
      const { data: res } = await updatePayslip({
        body: {
          advanceDeduction: (advance ?? 0) + (data?.advanceDeduction ?? 0),
        },
        id: String(id),
      });
      if (res) {
        toast.success("Updated");
        refetch();
        setTimeout(() => {
          refetchAdvance();
        }, 200);
      }
    } catch (error) {
      console.log({ error });
    }
  };
  useTriggerPrint(reactToPrintFn);
  if (!data) {
    return <RefreshButton onClick={refetch} />;
  }

  return (
    <Box mx={2} mt={2}>
      <ToolBarStyled
        style={{ position: "sticky", backgroundColor: "transparent" }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
          {data.employee.name}
        </Typography>
      </ToolBarStyled>
      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          p: 1,
          borderTop: 0,
          height: `calc(100vh - 120px)`,
          overflow: "auto",
        }}
      >
        <Stack sx={{ position: "fixed", right: 30 }}>
          {needAdvanceSettle ? (
            <Card>
              <CardContent>
                <Row sx={{ justifyContent: "center", alignItems: "center" }}>
                  <Typography color="error" align="center" fontWeight={700}>
                    <Icons.ReportProblemIcon />
                  </Typography>
                  <Typography
                    color="error"
                    align="center"
                    fontWeight={700}
                    fontSize={14}
                  >
                    Advance
                  </Typography>
                </Row>
                <Divider sx={{ my: 1 }} />
                <table>
                  <tbody>
                    <tr>
                      <td>Advance Deduction </td>
                      <td>: {numberWithCommas(data.advanceDeduction, 0)}</td>
                    </tr>
                    <tr>
                      <td>New Advance</td>
                      <td>: {numberWithCommas(advance, 0)}</td>
                    </tr>
                    <tr className="border-t-2">
                      <td>Total Advance</td>
                      <td>
                        :{" "}
                        {numberWithCommas(
                          (advance ?? 0) + data.advanceDeduction,
                          0,
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
              <Divider />
              <CardActions>
                <Button
                  size="small"
                  color="inherit"
                  sx={{ mr: "auto" }}
                  variant="outlined"
                  onClick={refetchAdvance}
                >
                  <Icons.RefreshIcon
                    className={isFetchingAdvance ? `animate-spin` : ""}
                  />
                </Button>
                <Button
                  size="small"
                  color="error"
                  sx={{ ml: "auto" }}
                  variant="outlined"
                  onClick={updateAdvance}
                >
                  Submit
                </Button>
              </CardActions>
            </Card>
          ) : null}
        </Stack>
        <Card
          ref={componentRef}
          sx={{ p: 2, px: 8, width: "21cm", height: "14.5cm", mx: "auto" }}
        >
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
            Salary Slip for the month of {month}
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
                    <td className="p-[2px] px-2">: {data.employee.name}</td>
                  </tr>
                  <tr>
                    <td className="p-[2px] px-2">
                      <b>Employee ID </b>
                    </td>
                    <td className="p-[2px] px-2">: {data.employee.id_no}</td>
                  </tr>
                  <tr>
                    <td className="p-[2px] px-2">
                      <b>Position </b>
                    </td>
                    <td className="p-[2px] px-2">
                      : {data.employee.designation}
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
                    <td className="p-[2px] px-2">: {month}</td>
                  </tr>
                  <tr>
                    <td className="p-[2px] px-2">
                      <b>Pay Date </b>
                    </td>
                    <td className="p-[2px] px-2">
                      :
                      {format(
                        addDays(addMonths(month || "", 1), 6),
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
                    {numberWithCommas(otherAllowances)}
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
      </Box>
    </Box>
  );
}
