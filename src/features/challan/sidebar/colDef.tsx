import { Icons } from "@/components/icons";
import { ChallanFormatted } from "@/types/challan";
import { Avatar, Stack, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";

export const challanColDef: ColDef<ChallanFormatted>[] = [
  {
    field: "type",
    maxWidth: 45,
    cellClass: "!pl-0 !pr-0",
    cellRenderer: ({ value }: CustomCellRendererProps) => (
      <div className="items-center flex justify-end h-full w-full ">
        <Avatar sx={{ width: 30, height: 30 }}>
          <Icons.DownloadIcon
            className={value == "Receive" ? "" : "rotate-180"}
          />
        </Avatar>
      </div>
    ),
  },
  {
    field: "date_formatted",
    flex: 1.5,
    cellRenderer: ({
      data,
      value,
    }: CustomCellRendererProps<ChallanFormatted>) => (
      <Stack py={0.5}>
        <Typography fontSize={11} color="textPrimary">
          {value}
        </Typography>

        <Typography fontSize={11} color="textSecondary">
          Challan NO: {data?.challan_no}
        </Typography>
        <Typography fontSize={11} color="textSecondary">
          <Icons.PeopleIcon /> {data?.customer.name}
        </Typography>
      </Stack>
    ),
  },
  {
    field: "total_qty",
    cellClass: "text-right",
    valueFormatter: ({ value }) => `${value} Pcs`,
  },
];
export const challanDefaultColDef: ColDef<ChallanFormatted> = {
  headerName: "",
  resizable: false,
  flex: 1,
};
