import { User } from "@/types/auth";
import { Avatar, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";

export const usersColDef: ColDef<User>[] = [
  {
    field: "name",
    headerName: "",
    maxWidth: 45,
    editable: false,
    resizable: false,
    cellRenderer: ({ value }: CustomCellRendererProps<User>) => (
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
    cellRenderer: ({ data }: CustomCellRendererProps<User>) => (
      <div className="py-1">
        <Typography>{data?.name}</Typography>
        <Typography color="textSecondary">
          Role : {data?.role.join(", ")}
        </Typography>
      </div>
    ),
  },
];
