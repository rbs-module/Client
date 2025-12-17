"use client";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";

import { useOrdersTable } from "../hooks/useOrdersTable";
import { getSideBarGridTheme } from "@/theme/ag-grid/grid-theme";

import { FormattedOrder } from "@/types/order";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";
import OrderStatusChip from "../components/status-chip";
import { useParams } from "next/navigation";
import { MiniNav } from "@/components/MiniNav";
import useSidebarSelection from "@/hooks/useSidebarSelection";
import { useRef } from "react";
import RefreshLoading from "@/components/Loading/RefreshLoading";
import { Icons } from "@/components/icons";
import { format } from "date-fns";
import getRelativeTime from "@/utils/relativeTime";

function OrdersMiniTable() {
  const activePage = useParams();
  const orderId = activePage.id as string;

  const { orders, handleQueryChange, loading, query, refetch } =
    useOrdersTable();

  const gridRef = useRef<AgGridReact<FormattedOrder> | null>(null);
  const { onRowSelected, onGridReady, onRowClicked } = useSidebarSelection({
    rowData: orders,
    id: orderId,
    gridRef,
    keyId: "_id",
    getPushLink: ({ _id }) => `/v1/orders/${_id}`,
  });

  const theme = useTheme();

  const handleSearch = (text: string = "") => {
    handleQueryChange({ search: text });
  };

  const ordersColDefMini: ColDef<FormattedOrder>[] = [
    {
      field: "order_name",
      headerName: "",
      flex: 1,
      resizable: false,
      headerClass: "flex w-full",
      cellRenderer: ({ data }: CustomCellRendererProps<FormattedOrder>) => (
        <Box>
          <Typography color="textPrimary" sx={{ fontWeight: "550" }}>
            # {data?.sl_no} {data?.order_name}
          </Typography>
          <Typography
            color="textSecondary"
            sx={{ fontSize: 11, letterSpacing: 1 }}
          >
            <Icons.PeopleIcon sx={{ height: 14 }} /> {data?.customer.name}
          </Typography>
          <Typography color="textSecondary">
            {format(data?.created_at || "", "dd-mm-yyyy")} | (
            {getRelativeTime(data?.created_at || "")} )
          </Typography>
          <OrderStatusChip value={data?.status || ""} />
        </Box>
      ),
    },
    {
      field: "cover_photo",
      headerName: "",
      resizable: false,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      sortable: false,
      maxWidth: 85,
      cellRenderer: ({ value }: CustomCellRendererProps<FormattedOrder>) => (
        <Avatar
          src={ImageUrlConfig(value, "w_60,h_60,r_max")}
          sx={{
            width: 60,
            height: 60,
            boxShadow: 2,
          }}
        />
      ),
    },
  ];
  return (
    <>
      <style>{`
      .ag-row-selected { border-left: 4px solid ${theme.palette.primary.main} } 
    `}</style>

      <Box
        sx={{
          position: "absolute",
          zIndex: 2,
          width: "100%",
          top: 0,
        }}
      >
        <MiniNav
          title="Orders"
          handleSearch={handleSearch}
          createLink="/v1/orders/create"
          handleRefresh={refetch}
          searchValue={query.search}
        />
      </Box>

      {loading ? <RefreshLoading /> : null}

      <AgGridReact
        ref={gridRef}
        onGridReady={onGridReady}
        theme={getSideBarGridTheme(theme)}
        rowData={[...orders]}
        onRowClicked={onRowClicked}
        onRowSelected={onRowSelected}
        rowHeight={95}
        columnDefs={ordersColDefMini}
        rowSelection={{ mode: "singleRow", checkboxes: false }}
      />
    </>
  );
}

export default OrdersMiniTable;
