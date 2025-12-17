"use client";
import ChartComponent from "@/components/charts/Carts";
import { Divider, Paper, Stack, Typography } from "@mui/material";

import { useExpenseByCategoryChart } from "./useExpenseByCetegoryChart";
import ToolBarStyled from "@/components/styled/ToolBar";
import DateRangeSelector from "@/components/DateRangeSelector";

function ExpenseByCategoryChart() {
  const { options, isLoading } = useExpenseByCategoryChart();

  return (
    <Paper>
      <ChartComponent chartOptions={options} loading={isLoading} />
    </Paper>
  );
}

export default ExpenseByCategoryChart;

export function ExpenseByCategoryChartWithNav() {
  const { options, isLoading, query, handleQueryChange } =
    useExpenseByCategoryChart();

  return (
    <Paper>
      <ToolBarStyled>
        <Typography variant="subtitle1">Expenses</Typography>
        <Stack
          spacing={1}
          direction={"row"}
          sx={{ alignItems: "center" }}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <DateRangeSelector
            onChange={handleQueryChange}
            selected={query.label || "custom"}
            start_date={query.start_date}
            end_date={query.end_date}
          />
        </Stack>
      </ToolBarStyled>
      <ChartComponent chartOptions={options} loading={isLoading} />
    </Paper>
  );
}
