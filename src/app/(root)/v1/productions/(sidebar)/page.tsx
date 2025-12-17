"use client";
import ProductionsChart from "@/features/charts/productions";
import { last1year, last30days } from "@/utils/date-ranges";
import { Box, Stack } from "@mui/material";
import React from "react";
import SimpleBar from "simplebar-react";

function Page() {
  return (
    <Box>
      <SimpleBar style={{ height: "calc(100vh  - 50px" }}>
        <Stack spacing={1}>
          <ProductionsChart
            queryParams={{
              group_by: "day",
              ...last30days,
            }}
          />
          <ProductionsChart
            queryParams={{
              group_by: "month",
              ...last1year,
            }}
          />

          <ProductionsChart queryParams={{ group_by: "year" }} />
        </Stack>
      </SimpleBar>
    </Box>
  );
}

export default Page;
