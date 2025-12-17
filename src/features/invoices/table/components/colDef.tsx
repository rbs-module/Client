import { Icons } from "@/components/icons";
import OrderStatusChip from "@/features/orders/components/status-chip";
import { numberWithCommas } from "@/utils/currency-formatter";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";
import { InvoiceType } from "@/zod-schemas/invoice";

import { Avatar, Box, Stack, Typography } from "@mui/material";

import { ColDef } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import { format } from "date-fns";

export const invoiceColDef: ColDef<InvoiceType>[] = [
  {
    field: "invoiceNo",
    headerName: "",
    flex: 1,
    resizable: false,
    headerClass: "flex w-full h-full",
    cellRenderer: ({ data }: CustomCellRendererProps<InvoiceType>) => (
      <Box>
        <Typography color="textSecondary">
          <Typography
            component={"strong"}
            color="textPrimary"
            sx={{ fontWeight: "550" }}
          >
            {data?.invoiceNo}
          </Typography>{" "}
          | {format(data?.date || Date.now(), "dd-MMM-yy")}
        </Typography>
        <Typography
          color="textSecondary"
          sx={{ fontSize: 12, letterSpacing: 1 }}
        >
          <Icons.PeopleIcon sx={{ height: 14 }} /> {data?.customer.name}
        </Typography>
        <Stack direction={"row"} spacing={2}>
          <OrderStatusChip value={data?.status || ""} />
          <Typography>{numberWithCommas(data?.amount)}</Typography>
        </Stack>
      </Box>
    ),
  },
  {
    field: "cover_photo",
    headerName: "",

    resizable: false,
    cellStyle: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    sortable: false,
    maxWidth: 85,
    cellRenderer: ({ value }: CustomCellRendererProps) => (
      <Avatar
        src={ImageUrlConfig(value, "w_60,h_60,r_max")}
        sx={{
          width: 60,
          height: 60,
          boxShadow: 2,
        }}
      />
    ),
  },
];
