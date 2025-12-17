/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// ====== mui components===============>>
import { useTheme } from "@mui/material";

// ====== grid module==================>>
import { AgGridReact } from "ag-grid-react";
import { getSideBarGridTheme } from "@/theme/ag-grid/grid-theme";

import { useRef } from "react";
import { useParams } from "next/navigation";

import useSidebarSelection from "@/hooks/useSidebarSelection";
import RefreshLoading from "@/components/Loading/RefreshLoading";
import { MiniNav } from "@/components/MiniNav";

import { useGetUsersQuery } from "@/services/user";
import { User } from "@/types/auth";
import { usersColDef } from "./colDef";

function Users() {
  const activePage = useParams();
  const customerId = activePage.id as string;
  const query = {
    search: "",
    limit: 100,
    page: 1,
    sort_key: "createdAt",
    sort_type: "desc" as any,
  };

  const { isFetching, isLoading, data, refetch } = useGetUsersQuery(query);
  console.log({ data });
  const gridRef = useRef<AgGridReact<User> | null>(null);
  const { onRowSelected, onGridReady, onRowClicked } = useSidebarSelection({
    rowData: data?.users || [],
    id: customerId,
    gridRef,
    keyId: "_id",
    getPushLink: ({ _id }) => `/v1/admin/users/${_id}`,
  });
  const theme = useTheme();

  return (
    <>
      <title>RBS | Users</title>
      <style>{`
      .ag-row-selected { border-left: 4px solid ${theme.palette.primary.main} } 
    `}</style>

      <MiniNav
        title="Users"
        handleSearch={() => {}}
        // createLink="/v1/purchase/suppliers/create"
        searchValue={query.search}
        handleRefresh={refetch}
        // extendItem={<ExcelButton onClick={handleExport} />}
        searchAble={false}
      />
      <RefreshLoading isLoading={isLoading || isFetching} />
      <AgGridReact
        theme={getSideBarGridTheme(theme)}
        ref={gridRef}
        rowData={data?.users ?? []}
        columnDefs={usersColDef}
        onGridReady={onGridReady}
        rowHeight={45}
        onRowClicked={onRowClicked}
        onRowSelected={onRowSelected}
        rowSelection={{
          mode: "singleRow",
          checkboxes: false,
        }}
      />
    </>
  );
}

export default Users;
