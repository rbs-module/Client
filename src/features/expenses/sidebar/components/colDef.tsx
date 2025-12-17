import { TransactionFormatted } from "@/types/Transaction";
import { Box, Stack, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import ImageIcon from "@mui/icons-material/Image";
export const expenseColDef: ColDef<TransactionFormatted>[] = [
  {
    field: "destination.account_name",
    flex: 1.5,
    cellRenderer: ({
      data,
      value,
    }: CustomCellRendererProps<TransactionFormatted>) => (
      <Box py={1}>
        <Typography fontSize={13} color="textPrimary" variant="body2">
          {value}
        </Typography>
        <Typography fontSize={11} variant="body2" color="textSecondary">
          {data?.voucher_no} | {data?.date_formatted}
        </Typography>
        <Typography fontSize={11} variant="body2" color="textSecondary">
          Source: {data?.source.account_name}
        </Typography>
        <div className="text-wrap">
          <Typography fontSize={10} variant="body2" color="textSecondary">
            {data?.description}
          </Typography>
        </div>
      </Box>
    ),
  },
  {
    field: "amount_formatted",
    flex: 1,
    cellClass: "flex items-center justify-end font-bold",
    cellRenderer: ({ value, data }: CustomCellRendererProps) =>
      data.image ? (
        <Stack direction={"row"} spacing={1}>
          <ImageIcon />
          <Typography>{value}</Typography>
        </Stack>
      ) : (
        value
      ),
  },
];
export const expenseDefaultColDef: ColDef<TransactionFormatted> = {
  headerName: "",
  resizable: false,
  flex: 1,
};
