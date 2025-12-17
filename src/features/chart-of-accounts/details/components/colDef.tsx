import { Icons } from "@/components/icons";
import type { TransactionFormatted } from "@/types/Transaction";
import { ColDef } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";

export const getTransactionColDef = ({
  account_name,
}: {
  account_name: string;
}) => {
  const TransactionColDef: ColDef<TransactionFormatted>[] = [
    {
      field: "date_formatted",
      headerName: "Date",
    },
    {
      field: "source.account_name",
      headerName: "Source",
      // valueFormatter: ({ value }) => `${value} ==>`,
      cellRenderer: ({ value, data }: CustomCellRendererProps) => {
        if (data.type == "custom") {
          return value;
        }
        return (
          <div className="flex justify-between items-center h-full">
            <p>{value}</p>
            <Icons.KeyboardTabIcon />
          </div>
        );
      },
    },
    {
      field: "destination.account_name",
      headerName: "Destination",
    },
    {
      field: "type",
      valueFormatter: ({ value }) =>
        value == "custom" ? "" : String(value).toUpperCase(),
    },
    {
      field: "description",
    },
    {
      field: "amount_formatted",
      headerName: "Amount",

      cellRenderer: ({ data, value }: CustomCellRendererProps) => (
        <div className="w-full text-right">
          <span>
            {data.type == "custom"
              ? value
              : `${data?.destination.account_name == account_name ? "+ " : "- "} ${value}`}
          </span>
        </div>
      ),
      // cellClass: "text-right font-bold",
    },
  ];
  return TransactionColDef;
};
export const TransactionDefaultColDef: ColDef<TransactionFormatted> = {
  flex: 1,
  resizable: false,
  cellClass: ({ data }) => [
    "text-center",
    data?.description == "Closing Balance" ? "font-bold" : "",
  ],
  sortable: false,
};
