import { Box, Stack, Typography } from "@mui/material";
import useCustomerDetails from "../../hooks/useCustomerDetails";
import LoadingText from "@/components/Loading/LoadingText";
import { numberWithCommas } from "@/utils/currency-formatter";
import CustomerTransactionsChart from "@/features/charts/customer-statement";
import CustomerBalanceChart from "@/features/charts/customer-balance";

function Details() {
  const { data, isLoading } = useCustomerDetails();
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={(theme) => ({ p: theme.spacing(2) })}>
        <Typography>Closing Amount</Typography>
        <LoadingText
          skeletonProps={{ height: 60 }}
          loading={isLoading}
          color="error"
          sx={{
            fontSize: 40,
            fontWeight: "bold",
            textShadow: "3px 2px #333",
          }}
        >
          {numberWithCommas(data?.balance)}
        </LoadingText>

        <Stack spacing={2}>
          <CustomerTransactionsChart />
          <CustomerBalanceChart />
        </Stack>
      </Box>
    </Box>
  );
}

export default Details;
