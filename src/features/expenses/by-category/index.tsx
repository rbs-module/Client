"use client";
import React, { useMemo } from "react";
import useExpenseByCategory from "./useExpenseByCategory";
import {
  Box,
  Grid2,
  Stack,
  Typography,
  useTheme,
  Link as MuiLink,
} from "@mui/material";
import ToolBarStyled from "@/components/styled/ToolBar";
import ExpenseByCategoryChart from "@/features/charts/expense-by-category";
import DateRangeSelector from "@/components/DateRangeSelector";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import { _arrSum } from "@/utils/arrSum";
import { numberWithCommas } from "@/utils/currency-formatter";
import DataTable from "@/components/Table";
import Link from "next/link";
import ExcelButton from "@/components/buttons/ExcellButton";
import exportFromJSON from "export-from-json";

function ExpenseByCategory() {
  const { data, query, handleQueryChange, refetch, isLoading } =
    useExpenseByCategory();
  const theme = useTheme();

  const rows = useMemo(() => {
    if (!data) {
      return [];
    }
    const footer = {
      account_name: "Total",
      amount_formatted: numberWithCommas(_arrSum(data, "amount")),
      _id: "",
    };

    const arr = [...data, footer];
    return arr;
  }, [data]);
  const handleExport = () => {
    const fileName = `Expense By Category`;
    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data: rows || [], fileName, exportType });
  };

  return (
    <Box sx={(theme) => ({ p: theme.spacing(1) })}>
      <title>Expense By Category </title>

      <ToolBarStyled>
        <Typography> Expense By Category</Typography>
        <Stack spacing={2} direction={"row"}>
          <ExcelButton onClick={handleExport} />

          <DateRangeSelector
            end_date={query.end_date}
            start_date={query.start_date}
            selected={query.label}
            onChange={handleQueryChange}
          />
          <RefreshButton onClick={refetch} loading={isLoading} />
        </Stack>
      </ToolBarStyled>
      <Grid2 p={1} container spacing={2}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              height: Number(data?.length) * 40 + 80,
              minHeight: 270,
            }}
          >
            <DataTable
              isFooter={({ account_name }) => account_name == "Total"}
              colDef={[
                {
                  field: "account_name",
                  headerName: "Account",
                  headerCellClass: "!text-left",
                  getViewStyle: () => ({
                    borderRight: 1,
                    borderColor: theme.palette.divider,
                  }),
                  cellRenderer: ({ value, data }) => {
                    if (data?.account_name == "Total") {
                      return (
                        <Typography fontWeight={"bold"}>{value}</Typography>
                      );
                    }
                    return (
                      <MuiLink
                        underline="hover"
                        component={Link}
                        href={`/v1/accounts/chart-of-accounts/${data?._id}`}
                      >
                        {value}
                      </MuiLink>
                    );
                  },
                },
                {
                  field: "amount_formatted",
                  textClass: "text-right",
                  headerCellClass: "!text-right",
                  headerName: "Amount",
                  getTextStyle: ({ data }) => ({
                    fontWeight:
                      data?.account_name == "Total" ? "bold" : undefined,
                  }),
                },
              ]}
              rowData={rows}
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <ExpenseByCategoryChart />
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default ExpenseByCategory;
