"use client";
import ToolBarStyled from "@/components/styled/ToolBar";

import { usePayrollStore } from "@/store/payroll/hooks";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid2,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { getDaysInMonth } from "date-fns";
import { useEffect } from "react";
import SimpleBar from "simplebar-react";
import useCreatePayslip from "./useCreatePayslip";
import { Controller } from "react-hook-form";
import { MonthPicker } from "@/components/MonthPicker";
import Payslip from "./PayslipView";
import { payrollConfig } from "./config";

function CreatePayslip() {
  const {
    setFindEmployeeQuery,
    findEmployeeQuery,
    payrollCreationMonth,
    setPayrollCreationMonth,
  } = usePayrollStore();

  const {
    control,
    setValue,
    calculatedData,
    employee,
    formValue,
    onSubmit,
    next,
    handleSubmit,
    handleUpdateEmployee,
  } = useCreatePayslip();
  useEffect(() => {
    setFindEmployeeQuery({
      is_active: "true",
      sort_key: "createdAt",
      sort_type: "asc",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <ToolBarStyled>
        <Typography variant="h6">Create Payslip</Typography>
        <Stack>
          <MonthPicker
            value={payrollCreationMonth}
            onChange={({ month }) => {
              setFindEmployeeQuery({ lastPayrollMonthNaN: month });
              setPayrollCreationMonth(month);
              setValue("month", month);
              setValue("working_days", getDaysInMonth(new Date(month)));
              setValue("present_days", getDaysInMonth(new Date(month)));
            }}
          />
        </Stack>
      </ToolBarStyled>
      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          borderTop: 0,
        }}
      >
        <Grid2 padding={2} container spacing={2}>
          <Grid2 size={{ sm: 4 }}>
            <Card>
              <CardHeader title={employee?.name + " - " + employee?.id_no} />
              <Divider />
              <CardContent>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ sm: 6 }}>
                    <Controller
                      control={control}
                      name="present_days"
                      render={({ field }) => (
                        <TextField
                          variant="standard"
                          {...field}
                          onChange={(e) => {
                            field.onChange(+e.target.value);
                            setValue(
                              "absent_days",
                              formValue.workingDays - +e.target.value,
                            );
                          }}
                          type="number"
                          label={`Present Days (${getDaysInMonth(new Date(findEmployeeQuery.lastPayrollMonthNaN || ""))})`}
                        />
                      )}
                    />
                  </Grid2>

                  <Grid2 size={{ sm: 6 }}>
                    <Controller
                      control={control}
                      disabled
                      name="absent_days"
                      render={({ field }) => (
                        <TextField
                          variant="standard"
                          {...field}
                          onChange={(e) => {
                            field.onChange(+e.target.value);
                          }}
                          type="number"
                          label={`Absent Days`}
                        />
                      )}
                    />
                  </Grid2>
                  <Grid2 size={{ sm: 6 }}>
                    <Controller
                      control={control}
                      name="overtime_hours"
                      render={({ field }) => (
                        <TextField
                          variant="standard"
                          {...field}
                          onChange={(e) => {
                            field.onChange(+e.target.value);
                          }}
                          type="number"
                          label={`Overtime Hours`}
                        />
                      )}
                    />
                  </Grid2>
                  <Grid2 size={{ sm: 6 }}>
                    <Controller
                      control={control}
                      name="leave_days"
                      render={({ field }) => (
                        <TextField
                          variant="standard"
                          {...field}
                          onChange={(e) => {
                            field.onChange(+e.target.value);
                          }}
                          type="number"
                          label={`Leave Days`}
                        />
                      )}
                    />
                  </Grid2>

                  <Grid2 size={{ sm: 6 }}>
                    <Controller
                      control={control}
                      name="otherAllowances"
                      render={({ field }) => (
                        <TextField
                          variant="standard"
                          {...field}
                          onChange={(e) => {
                            field.onChange(+e.target.value);
                          }}
                          type="number"
                          label={`other Allowances`}
                        />
                      )}
                    />
                  </Grid2>
                  <Grid2 size={{ sm: 6 }}>
                    <Controller
                      control={control}
                      name="otherDeductions"
                      render={({ field }) => (
                        <TextField
                          variant="standard"
                          {...field}
                          onChange={(e) => {
                            field.onChange(+e.target.value);
                          }}
                          type="number"
                          label={`other Deduction`}
                        />
                      )}
                    />
                  </Grid2>
                </Grid2>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: "space-between" }}>
                <Button
                  onClick={() => {
                    handleUpdateEmployee({ is_active: false });
                  }}
                  color="error"
                  variant="outlined"
                >
                  Out
                </Button>
                <Button type="submit" variant="outlined" sx={{ ml: "auto" }}>
                  Save {next ? `and Next` : ""}
                </Button>
              </CardActions>
            </Card>
          </Grid2>
          <Grid2 size={{ sm: 8 }}>
            <SimpleBar style={{ height: "calc(100vh  - 118px" }}>
              <Payslip
                data={{
                  ...formValue,
                  ...calculatedData,
                  absent_deduction: payrollConfig.getAbsenceDeduction({
                    absent_days: formValue.workingDays - formValue.present_days,
                    basic: employee?.salary ?? 0,
                  }),
                  employee: {
                    _id: employee?._id ?? "",
                    name: employee?.name ?? "",
                    id_no: employee?.id_no,
                    designation: employee?.designation,
                  },
                  basic: employee?.salary ?? 0,
                }}
              />
            </SimpleBar>
            {/* <EmployeeCard /> */}
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
}

export default CreatePayslip;
