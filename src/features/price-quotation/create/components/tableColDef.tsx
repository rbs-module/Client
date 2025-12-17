import { FormattedOrder } from "@/types/order";
import { numberWithCommas } from "@/utils/currency-formatter";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";
import type { InvoiceItemType } from "@/zod-schemas/invoice";
import { Box, IconButton, InputBase } from "@mui/material";
import type { ColDef } from "ag-grid-community";
import type { CustomCellRendererProps } from "ag-grid-react";
import Image from "next/image";
import { Icons } from "@/components/icons";

type Params = {
  remove: (x: FormattedOrder) => void;
  handleUpdateQty: ({ id, qty }: { id: string; qty: number }) => void;
};

export const getCreateInvoiceViewColDef = (params: Params) => {
  const createInvoiceViewColDef: ColDef<FormattedOrder>[] = [
    {
      field: "order_name",
      headerName: "Style",
      flex: 1.5,
      cellClass: ({ value }) => (!value ? "text-center " : ""),
      valueFormatter: ({ data }) => `# ${data?.sl_no} ${data?.order_name}`,
    },
    {
      field: "cover_photo",
      width: 70,
      headerName: "Design",
      cellRenderer: ({ value }: CustomCellRendererProps<InvoiceItemType>) =>
        value ? (
          <Image
            src={ImageUrlConfig(value, "w_70,h_40")}
            width={70}
            height={40}
            alt="Des"
          />
        ) : (
          ""
        ),
    },
    {
      field: "currency",
    },

    {
      field: "qty",
      cellRenderer: ({ value, data }: CustomCellRendererProps) => (
        <Box>
          <InputBase
            defaultValue={value}
            onChange={(e) => {
              params.handleUpdateQty({ id: data._id, qty: +e.target.value });
            }}
            sx={{ px: 2 }}
            fullWidth
            onFocus={(e) => {
              if (e?.target instanceof HTMLInputElement) {
                e.target.select();
              }
            }}
          />
        </Box>
      ),
    },
    {
      field: "rate",

      cellClass: "text-right",
      valueFormatter: ({ data, value }) => `${data?.currency} ${value}`,
    },
    {
      field: "_id",
      headerName: "Amount",
      cellClass: "text-right",
      valueFormatter: ({ data }) => {
        if (!data) {
          return "";
        }

        const exchangeRate = data.rate || 1;

        if (data?.currency == "USD") {
          return `${numberWithCommas((data.qty / 12) * data.rate * exchangeRate)}`;
        }
        if (data?.currency == "BDT") {
          return `${numberWithCommas(data.qty * data.rate * exchangeRate)}`;
        }
        return ``;
      },
    },
    {
      field: "_id",
      headerName: "Actions",
      cellClass: "text-right",
      cellRenderer: ({ data }: CustomCellRendererProps) => (
        <Box>
          <IconButton onClick={() => params.remove(data)}>
            <Icons.CloseIcon />
          </IconButton>
        </Box>
      ),
    },
  ];
  return createInvoiceViewColDef;
};
