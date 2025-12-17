"use client";
import Tabs from "@/components/Tabs";
import React from "react";
import EmployeePayslipTable from "./employeePaySlip";
import EmployeeCard from "../EmployeeCard";
import { Box } from "@mui/material";
import ToolBarStyled from "@/components/styled/ToolBar";
import { EmployeeHistory } from "./History";

function EmployeeDetailsTab() {
  return (
    <Box>
      <ToolBarStyled></ToolBarStyled>
      <Tabs
        tabs={[
          {
            component: <EmployeeCard />,
            isDisabled: false,
            title: "Details",
          },
          {
            component: <EmployeePayslipTable />,
            isDisabled: false,
            title: "Payslips",
          },
          {
            component: <EmployeeHistory />,
            isDisabled: false,
            title: "History",
          },
        ]}
      />
    </Box>
  );
}

export default EmployeeDetailsTab;
