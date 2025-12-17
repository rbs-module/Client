"use client";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import DateRangeSelector from "@/components/DateRangeSelector";
import { Icons } from "@/components/icons";
import IconButtonStyled from "@/components/styled/IconButton";
import ToolBarStyled from "@/components/styled/ToolBar";
import DataTable from "@/components/Table";
import useGlobalSocket from "@/hooks/useGlobalSocket";
import { useGetOrderProductionsQuery } from "@/services/orders";
import { OrderProduction } from "@/types/production";
import { _arrSum } from "@/utils/arrSum";

import { last30days } from "@/utils/date-ranges";
import { df } from "@/zod-schemas/default-query-paramsDTO";
import { Box, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import Link from "next/link";

import { useMemo, useState } from "react";

function OrderProductions({ orderId }: { orderId: string }) {
  const [query, setQuery] = useState(last30days);
  const {
    data = [],
    isFetching,
    isLoading,
    refetch,
  } = useGetOrderProductionsQuery({
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

  const options: OrderProduction[] = useMemo(() => {
    const op = data;

    const totalRow: OrderProduction = {
      date: new Date(),
      qty: _arrSum(data, "qty"),
      shift: "Total",
      id: "",
    };
    // op.push(totalRow);
    return [...op, totalRow];
  }, [data]);

  const handleQueryChange = (data: typeof last30days) => {
    setQuery((p) => ({ ...p, ...data }));
  };

  return (
    <Box height={"calc(100vh - 215px)"} px={3}>
      <ToolBarStyled sx={{ my: 1 }}>
        <Typography>Productions</Typography>
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
        colDef={[
          {
            field: "date",
            formatter: ({ value, data }) =>
              data?.shift !== "Total" ? format(value, df) : "",
          },
          { field: "shift" },
          { field: "qty", formatter: ({ value }) => `${value} Pcs` },
          {
            field: "id",
            headerName: "Link",

            cellRenderer: ({ value, data }) => (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {data?.shift !== "Total" ? (
                  <IconButtonStyled
                    LinkComponent={Link}
                    href={`/v1/productions/${value}`}
                  >
                    <Icons.VisibilityIcon />
                  </IconButtonStyled>
                ) : null}
              </Box>
            ),
          },
        ]}
        defaultColDef={{ getTextStyle: () => ({ textAlign: "center" }) }}
        rowData={options}
        isFooter={({ shift }) => shift == "Total"}
      />
    </Box>
  );
}

export default OrderProductions;
