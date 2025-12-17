import { ExpenseByCategoryChartWithNav } from "@/features/charts/expense-by-category";
import InvoiceChart from "@/features/charts/invoice";
import PaymentChart from "@/features/charts/payments";
import ProductionsChart from "@/features/charts/productions";
import { last1year } from "@/utils/date-ranges";
import { Grid2 } from "@mui/material";
import React from "react";

function Page() {
  return (
    <div className="p-3">
      <title>Dashboard</title>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <ProductionsChart queryParams={{ group_by: "month", ...last1year }} />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <ExpenseByCategoryChartWithNav />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <InvoiceChart queryParams={{ ...last1year, group_by: "month" }} />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <PaymentChart queryParams={{ ...last1year, group_by: "month" }} />
        </Grid2>
      </Grid2>
    </div>
  );
}

export default Page;
