import { numberWithCommas } from "@/utils/currency-formatter";
import getRelativeTime from "@/utils/relativeTime";
import { PaymentType } from "@/zod-schemas/Payment";
import { Box, Stack, Typography } from "@mui/material";

import { ColDef } from "ag-grid-community";
import { CustomCellEditorProps } from "ag-grid-react";
import { format } from "date-fns";

export const paymentsColDef: ColDef<PaymentType>[] = [
  {
    field: "customer.name",
    headerName: "",
    flex: 1.5,
    cellRenderer: ({ data }: CustomCellEditorProps<PaymentType>) => (
      <Stack className="h-full  justify-center" spacing={0.5}>
        <Typography variant="body1" fontSize={13}>
          {data.customer.name}
        </Typography>
        <Typography color="textSecondary" className="truncate">
          {data.voucher_no}
        </Typography>
        <Typography color="textSecondary" className="truncate">
          {format(data.date, "dd-MMM-yyyy")} | {getRelativeTime(data.date)}
        </Typography>
      </Stack>
    ),
  },
  {
    field: "amount",

    headerName: "",
    cellRenderer: ({ data }: CustomCellEditorProps<PaymentType>) => (
      <Box
        sx={{
          justifyContent: "flex-end",
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography fontWeight={"bold"}>
          {numberWithCommas(data.amount)}
        </Typography>
      </Box>
    ),
  },
];
