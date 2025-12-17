"use client";
import RefreshLoading from "@/components/Loading/RefreshLoading";
import { MiniNav } from "@/components/MiniNav";
import { getSideBarGridTheme } from "@/theme/ag-grid/grid-theme";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import React, { useRef } from "react";

import useSidebarSelection from "@/hooks/useSidebarSelection";

import { PaginationBarMini } from "@/components/pagination/paginationBarMini";
import { useParams } from "next/navigation";
import { useGetEmployeeQuery } from "@/store/payroll";
import { Employee, FindEmployeeQuery } from "@/types/payroll";
import Row from "@/components/Row";
import { format } from "date-fns";
import getRelativeTime from "@/utils/relativeTime";
import { usePayrollStore } from "@/store/payroll/hooks";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";

function EmployeeSideTable({
  query,
  pushUrl,
}: {
  query?: FindEmployeeQuery;
  pushUrl?: string;
}) {
  const { findEmployeeQuery, setFindEmployeeQuery } = usePayrollStore();

  const { data, isFetching, isLoading, refetch } = useGetEmployeeQuery({
    ...findEmployeeQuery,
    ...query,
  });

  const gridRef = useRef<AgGridReact<Employee> | null>(null);
  const activePage = useParams();
  const employeeId = activePage.id as string;

  const { onGridReady, onRowClicked, onRowSelected } = useSidebarSelection({
    rowData: data?.employee || [],
    gridRef,
    id: employeeId,
    keyId: "_id",
    getPushLink: ({ _id }) => `${pushUrl ?? "/v1/payroll/employee"}/${_id}`,
  });
  const theme = useTheme();

  const handleSearch = (search: string) => {
    setFindEmployeeQuery({ search });
  };

  return (
    <>
      <title>Employee</title>
      <style>{`
      .ag-row-selected { border-left: 4px solid ${theme.palette.primary.main} } 
    `}</style>

      <MiniNav
        isRefreshing={isFetching || isLoading}
        title="Employee"
        handleSearch={handleSearch}
        createLink="/v1/payroll/employee/create"
        searchValue={findEmployeeQuery.search}
        handleRefresh={refetch}
      />

      <RefreshLoading isLoading={isLoading || isFetching} />
      <AgGridReact
        theme={getSideBarGridTheme(theme)}
        ref={gridRef}
        rowData={data?.employee || []}
        columnDefs={[
          {
            field: "name",
            flex: 1,
            cellRenderer: ({
              data,
              value,
            }: CustomCellRendererProps<Employee>) => {
              return (
                <Row alignItems={"center"} height={"100%"}>
                  <Avatar
                    sx={{ width: 40, height: 40 }}
                    src={ImageUrlConfig(data?.image || "", "w_40,h_40,r_max")}
                  />
                  <Box ml={1}>
                    <Typography fontSize={13} variant="h6">
                      {value}
                    </Typography>
                    <Typography>
                      {data?.id_no} {` | `} {data?.department} {" | "}{" "}
                      {data?.designation}
                    </Typography>
                    <Typography>
                      J/D: {format(data?.joining_date || "", "dd-MMM-yy")}
                      {` | `} {getRelativeTime(data?.joining_date || "")}
                    </Typography>
                  </Box>
                </Row>
              );
            },
          },
        ]}
        onGridReady={onGridReady}
        rowHeight={75}
        onRowClicked={onRowClicked}
        onRowSelected={onRowSelected}
        rowSelection={{
          mode: "singleRow",
          checkboxes: false,
        }}
        defaultColDef={{ headerName: "", resizable: false }}
      />
      <PaginationBarMini
        pagination={data?.pagination}
        onPageChange={setFindEmployeeQuery}
      />
    </>
  );
}

export default EmployeeSideTable;
