"use client";
import ChartComponent from "@/components/charts/Carts";
import DateRangeSelector from "@/components/DateRangeSelector";
import ToolBarStyled from "@/components/styled/ToolBar";
import { Box, Divider, Paper, Stack, Typography } from "@mui/material";

import { useCustomerBalanceChart } from "./useCustomerBalanceChart";
import { RefreshButton } from "@/components/buttons/RefreshButton";

function CustomerBalanceChart() {
  const { isLoading, options, query, handleQueryChange, refetch } =
    useCustomerBalanceChart();

  return (
    <Box>
      <Paper sx={{ border: 1, borderColor: "divider" }}>
        <ToolBarStyled sx={{ border: 0 }}>
          <Typography variant="subtitle1">Balance</Typography>
          <Stack
            spacing={1}
            direction={"row"}
            sx={{ alignItems: "center" }}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <DateRangeSelector
              onChange={(params) => {
                handleQueryChange({ ...params, dateLabel: params.label });
              }}
              selected={query.label || ""}
              start_date={query.start_date}
              end_date={query.end_date}
            />
            <RefreshButton onClick={refetch} loading={isLoading} />
          </Stack>
        </ToolBarStyled>
        <Divider />
        <ChartComponent chartOptions={options} loading={isLoading} />
      </Paper>
    </Box>
  );
}

export default CustomerBalanceChart;
