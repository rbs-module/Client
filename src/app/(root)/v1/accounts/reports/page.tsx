"use client";
import { Icons } from "@/components/icons";
import { Container, Grid2, Stack, Typography } from "@mui/material";
import Link from "next/link";

const items = [
  { link: "reports/expense-by-category", title: "Expense By Category" },
  { link: "reports/bill-payment", title: "Bill & Payment" },
  { link: "reports/expense", title: "Expenditure" },
];

function Page() {
  return (
    <Container sx={{ pt: 5 }}>
      <title>Reports </title>
      <Grid2 container spacing={10}>
        <Grid2 size={6}>
          <Typography variant="subtitle1">Purchase and Expenses</Typography>
          <Stack mt={5} spacing={5}>
            {items.map((item) => (
              <Stack key={item.title} direction={"row"} spacing={2}>
                <Icons.StarIcon />
                <Link
                  href={item.link}
                  className="text-blue-400 hover:underline underline-offset-4"
                >
                  {item.title}
                </Link>
              </Stack>
            ))}
          </Stack>
        </Grid2>
      </Grid2>
    </Container>
  );
}

export default Page;
