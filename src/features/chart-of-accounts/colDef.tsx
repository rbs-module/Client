import { numberWithCommas } from "@/utils/currency-formatter";
import { AccountType } from "@/zod-schemas/accounts/account-schema";

import { Avatar, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import { Icons } from "@/components/icons";

export const accountsColDef: ColDef<AccountType>[] = [
  {
    field: "is_debit",
    headerName: "",
    width: 55,
    editable: false,
    resizable: false,

    cellRenderer: ({ value, data }: CustomCellRendererProps<AccountType>) => (
      <div className="items-center flex justify-center h-full px-2">
        {data?.account_name == "Total" ? null : (
          <Avatar sx={{ width: 30, height: 30 }}>
            {value ? <Icons.LockOpenIcon /> : <Icons.LockIcon />}
          </Avatar>
        )}
      </div>
    ),
  },
  {
    field: "account_name",
    flex: 1.5,
    editable: false,
    headerName: "",
    resizable: false,

    cellRenderer: ({ data }: CustomCellRendererProps<AccountType>) =>
      data?.account_name !== "Total" ? (
        <div className="py-1">
          <Typography>{data?.account_name}</Typography>
          <Typography color="textSecondary">{data?.account_type}</Typography>
        </div>
      ) : (
        <p style={{ fontSize: 12, fontWeight: "bold" }}>Total</p>
      ),
  },
  {
    field: "balance",
    editable: false,
    headerName: "",
    resizable: false,
    flex: 1,
    cellRenderer: ({ value, data }: CustomCellRendererProps<AccountType>) => (
      <div className="h-full w-full flex justify-end items-center">
        <p
          style={{
            fontWeight: data?.account_name == "Total" ? "bold" : undefined,
            fontSize: data?.account_name == "Total" ? 12 : undefined,
          }}
        >
          {numberWithCommas(value)}
        </p>
      </div>
    ),
  },
];
