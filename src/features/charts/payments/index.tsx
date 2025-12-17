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
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { usePaymentChart } from "./usePaymentChart";
import { useMenu } from "@/hooks/useMenu";
import { Icons } from "@/components/icons";
import { ChatDataQuery } from "@/types/global";

function PaymentChart({
  queryParams,
}: {
  queryParams?: Partial<ChatDataQuery>;
}) {
  const { isLoading, options, query, handleQueryChange } =
    usePaymentChart(queryParams);
  const { open, handleClose, handleOpen, anchorEl } = useMenu();

  if (isLoading) {
    return (
      <Paper>
        <Skeleton variant="rectangular" height={300} />
      </Paper>
    );
  }

  return (
    <Box>
      <Paper sx={{ border: 1, borderColor: "divider" }}>
        <ToolBarStyled sx={{ border: 0 }}>
          <Typography variant="subtitle1">Payments</Typography>
          <Stack
            spacing={1}
            direction={"row"}
            sx={{ alignItems: "center" }}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Button onClick={handleOpen}>{query.group_by}</Button>

            <DateRangeSelector
              onChange={handleQueryChange}
              selected={query.label || ""}
              start_date={query.start_date}
              end_date={query.end_date}
            />
          </Stack>
        </ToolBarStyled>
        <Divider />
        <ChartComponent chartOptions={options} />
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

export default PaymentChart;
