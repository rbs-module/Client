import { CustomCellRendererProps } from "ag-grid-react";

import { ColDef } from "ag-grid-community";
import { Customer } from "@/types/customer";
import { Avatar, Box, Chip, IconButton, Typography } from "@mui/material";

import Link from "next/link";
import { Icons } from "@/components/icons";
import { numberWithCommas } from "@/utils/currency-formatter";

function customersColDef() {
  const colDef: ColDef<Customer>[] = [
    { field: "name", flex: 2, editable: true },
    { field: "email", sortable: false, flex: 2, editable: true },
    {
      field: "balance",
      cellClass: "text-right",
      headerName: "Balance",
      valueFormatter: ({ value }) => numberWithCommas(value),
    },
    {
      field: "is_active",
      editable: true,
      headerName: "Status",

      cellRenderer: ({ value }: CustomCellRendererProps) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Chip
            avatar={value ? <Icons.DoneAllIcon /> : <Icons.NotInterestedIcon />}
            size="small"
            color={value ? "success" : "error"}
            label={value ? "Active" : "Inactive"}
          />
        </Box>
      ),
    },
    {
      field: "_id",
      headerName: "Actions",
      cellRenderer: ({ value }: CustomCellRendererProps) => (
        <Link href={`/v1/sales/customers/${value}`}>
          <div className="flex justify-center items-center">
            <IconButton color="primary">
              <Icons.VisibilityIcon />
            </IconButton>
          </div>
        </Link>
      ),
    },
  ];
  return colDef;
}
function customersColDefMini() {
  const colDef: ColDef<Customer>[] = [
    {
      field: "name",
      headerName: "",
      maxWidth: 45,
      editable: false,
      resizable: false,
      cellRenderer: ({ value }: CustomCellRendererProps<Customer>) => (
        <div className="items-center flex justify-center h-full">
          <Avatar sx={{ width: 30, height: 30 }}>{value[0]}</Avatar>
        </div>
      ),
    },
    {
      field: "name",
      // flex: 1.5,
      editable: false,
      headerName: "",
      resizable: false,
      flex: 1,
      cellRenderer: ({ data }: CustomCellRendererProps<Customer>) => (
        <div className="py-1">
          <Typography color="textPrimary">{data?.name}</Typography>
          <Typography color="textSecondary">
            {numberWithCommas(data?.balance)}
          </Typography>
        </div>
      ),
    },
  ];
  return colDef;
}
export { customersColDefMini, customersColDef };
