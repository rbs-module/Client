"use client";
import ChartComponent from "@/components/charts/Carts";
import DateRangeSelector from "@/components/DateRangeSelector";
import ToolBarStyled from "@/components/styled/ToolBar";
import {
  Box,
  Button,
  Divider,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { useCustomerChart } from "./useCustomerChart";
import { useMenu } from "@/hooks/useMenu";
import { Icons } from "@/components/icons";
import { CustomerChartQueryType } from "@/types/customer";
import { RefreshButton } from "@/components/buttons/RefreshButton";

function CustomerTransactionsChart({
  queryParams,
}: {
  queryParams?: Partial<CustomerChartQueryType>;
}) {
  const { isLoading, options, query, handleQueryChange, refetch } =
    useCustomerChart(queryParams);
  const { open, handleClose, handleOpen, anchorEl } = useMenu();

  return (
    <Box>
      <Paper sx={{ border: 1, borderColor: "divider" }}>
        <ToolBarStyled sx={{ border: 0 }}>
          <Typography variant="subtitle1">Transactions</Typography>
          <Stack
            spacing={1}
            direction={"row"}
            sx={{ alignItems: "center" }}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Button onMouseEnter={handleOpen} onClick={handleOpen}>
              {query.group_by}
            </Button>

            <DateRangeSelector
              onChange={(params) => {
                handleQueryChange({ ...params, dateLabel: params.label });
              }}
              selected={query.dateLabel || ""}
              start_date={query.start_date}
              end_date={query.end_date}
            />
            <RefreshButton onClick={refetch} loading={isLoading} />
          </Stack>
        </ToolBarStyled>
        <Divider />
        <ChartComponent chartOptions={options} loading={isLoading} />
      </Paper>
      <Menu onClose={handleClose} open={open} anchorEl={anchorEl}>
        <Box onMouseLeave={handleClose}>
          <MenuItem
            onClick={() => {
              handleQueryChange({ group_by: "day" });
              handleClose();
            }}
            selected={query.group_by == "day"}
          >
            <ListItemText>Day</ListItemText>

            <Typography variant="body2" sx={{ color: "text.secondary", ml: 3 }}>
              {query.group_by == "day" ? <Icons.DoneAllIcon /> : " "}
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleQueryChange({ group_by: "month" });
              handleClose();
            }}
            selected={query.group_by == "month"}
          >
            <ListItemText>Month</ListItemText>

            <Typography variant="body2" sx={{ color: "text.secondary", ml: 3 }}>
              {query.group_by == "month" ? <Icons.DoneAllIcon /> : " "}
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleQueryChange({ group_by: "year" });
              handleClose();
            }}
            selected={query.group_by == "year"}
          >
            <ListItemText>Year</ListItemText>

            <Typography variant="body2" sx={{ color: "text.secondary", ml: 3 }}>
              {query.group_by == "year" ? <Icons.DoneAllIcon /> : " "}
            </Typography>
          </MenuItem>
        </Box>
      </Menu>
    </Box>
  );
}

export default CustomerTransactionsChart;
