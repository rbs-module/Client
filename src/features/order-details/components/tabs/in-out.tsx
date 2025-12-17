"use client";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import DateRangeSelector from "@/components/DateRangeSelector";
import ToolBarStyled from "@/components/styled/ToolBar";
import DataTable from "@/components/Table";
import useGlobalSocket from "@/hooks/useGlobalSocket";
import { useGoodsInOutQuery } from "@/services/orders";

import { last30days } from "@/utils/date-ranges";
import { Box, Stack, Typography } from "@mui/material";

import { useState } from "react";

function GoodsInout({ orderId }: { orderId: string }) {
  const [query, setQuery] = useState(last30days);
  const {
    data = [],
    isFetching,
    isLoading,
    refetch,
  } = useGoodsInOutQuery({
    id: orderId,
    query,
  });

  useGlobalSocket({
    path: "/orders",
    events: {
      "order-changes": (data) => {
        if (orderId !== data._id) {
          return;
        }
        Object.keys(data).forEach((key) => {
          if (key.includes("inventory")) {
            refetch();
          }
        });
      },
    },
  });

  const handleQueryChange = (data: typeof last30days) => {
    setQuery((p) => ({ ...p, ...data }));
  };

  return (
    <Box height={"calc(100vh - 215px)"} px={3}>
      <ToolBarStyled sx={{ my: 1 }}>
        <Typography>Inventory</Typography>
        <Stack direction={"row"} spacing={2}>
          <DateRangeSelector
            start_date={query.start_date}
            end_date={query.end_date}
            selected={query.label}
            onChange={handleQueryChange}
          />
          <RefreshButton onClick={refetch} loading={isLoading || isFetching} />
        </Stack>
      </ToolBarStyled>

      <DataTable
        isFooter={({ color }) => color == "Grand Total"}
        defaultHeaderCellClass="!text-center"
        defaultColDef={{
          getTextStyle: () => ({ textAlign: "center" }),
          getHeaderStyle: () => ({ borderRight: 1, borderColor: "divider" }),
          getViewStyle: () => ({ borderRight: 1, borderColor: "divider" }),
        }}
        colDef={[
          {
            field: "color",
          },
          {
            field: "total_received",
            headerName: "Received",
            formatter: ({ value }) => `${value} Pcs`,
          },
          {
            field: "total_fabric_reject_receive",
            headerName: "FR",
            getTextStyle: () => ({ color: "GrayText" }),
          },
          {
            field: "total_embroidery_reject_receive",
            headerName: "ER",
            getTextStyle: () => ({ color: "GrayText" }),
          },
          {
            field: "total_delivered",
            headerName: "Delivered",
            formatter: ({ value }) => `${value} Pcs`,
          },
          {
            field: "total_fabric_reject_delivery",
            headerName: "FR",
            getTextStyle: () => ({ color: "GrayText" }),
          },
          {
            field: "total_embroidery_reject_delivery",
            headerName: "ER",
            getTextStyle: () => ({ color: "GrayText" }),
          },
          {
            field: "total_remaining",
            headerName: "Remaining",
            formatter: ({ value }) => `${value} Pcs`,
            getViewStyle: () => ({ borderRight: 0, borderColor: "divider" }),
            getHeaderStyle: () => ({ borderRight: 0, borderColor: "divider" }),
          },
        ]}
        rowData={data}
      />
    </Box>
  );
}

export default GoodsInout;
