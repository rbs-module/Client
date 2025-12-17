import { FormattedOrder } from "@/types/order";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { format } from "date-fns";
import { numberWithCommas } from "@/utils/currency-formatter";
import Image from "next/image";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";

import { orderStatusEnum } from "@/constant/order";
import OrderStatusChip from "./status-chip";
import { CustomCellRendererProps } from "ag-grid-react";
import { Icons } from "@/components/icons";
import Link from "next/link";
import IconButtonStyled from "@/components/styled/IconButton";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number; qty: string; status: string },
) {
  const { status, qty, value, ...rest } = props;

  const getProgressColor = (value: number) => {
    if (value >= 110) return "error"; // 110+ % -> Red (Error)
    if (value >= 105) return "warning"; // 105 - 110 % -> Orange (Warning)
    if (value >= 100) return "success"; // 100 - 105 % -> Green (Success)
    return "info"; // Below 100% -> Blue (Info)
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Stack sx={{ width: "100%" }} spacing={0.3}>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: 11,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {qty}
        </Typography>
        <LinearProgress
          variant={
            value <= 95 && status == "Processing"
              ? "indeterminate"
              : "determinate"
          }
          color={getProgressColor(value)}
          value={value >= 100 ? 100 : value}
          {...rest}
        />
        <Typography
          sx={{ color: "text.secondary", fontSize: 8, textAlign: "center" }}
        >{`${Math.round(value)}%`}</Typography>
      </Stack>
    </Box>
  );
}

export const ordersColDef: ColDef<FormattedOrder>[] = [
  {
    field: "created_at",
    headerName: "Date",
    editable: true,
    sortable: true,
    valueFormatter: ({ value }) => format(value, "dd-MMM-yy"),
    minWidth: 100,
  },
  {
    field: "sl_no",
    headerName: "#",
    minWidth: 70,
    cellClass: "justify-center",
    filter: true,
  },
  {
    field: "customer.name",
    filter: true,
    cellClass: "px-0",
    cellRenderer: ({ value }: CustomCellRendererProps) => (
      <span className="truncate px-0">{value}</span>
    ),
    flex: 1.6,
  },

  {
    field: "order_name",
    headerName: "Order Name",
    editable: true,
    cellRenderer: ({ value }: CustomCellRendererProps) => (
      <span className="truncate px-0">{value}</span>
    ),
    flex: 1.2,
    filter: true,
  },
  {
    field: "qty",
    headerName: "Qty",
    editable: true,
    cellClass: "justify-end",
    valueFormatter: ({ value, data }) =>
      `${numberWithCommas(value, 0)} ${data?.unit}`,
  },
  {
    field: "rate",
    headerName: "Rate",
    editable: true,
    cellClass: "justify-end font-bold",
    valueFormatter: ({ value, data }) =>
      `${data?.currency == "USD" ? "$" : "৳"} ${numberWithCommas(value)}`,
  },
  {
    editable: true,
    field: "inventory.receive_qty",
    headerName: "Rec Qty",
    cellClass: "justify-end",

    valueFormatter: ({ value, data }) =>
      `${numberWithCommas(value, 0)} ${data?.unit}`,
  },
  {
    field: "inventory.production_qty",
    headerName: "Production Qty",
    cellStyle: { padding: 5 },
    valueFormatter: ({ value, data }) =>
      `${numberWithCommas(value, 0)} ${data?.unit}`,
    cellRenderer: ({
      value,
      data,
    }: CustomCellRendererProps<FormattedOrder>) => {
      const qty = data?.qty || 0;
      const percent = (+value / +qty) * 100;
      return (
        <LinearProgressWithLabel
          qty={`${value} ${data?.unit}`}
          value={percent}
          status={data?.status || ""}
        />
      );
    },
  },

  {
    field: "inventory.finishing_qty",
    headerName: "Finishing Qty",
    cellClass: "justify-end",
    valueFormatter: ({ value, data }) =>
      `${numberWithCommas(value, 0)} ${data?.unit}`,
  },

  {
    field: "inventory.delivery_qty",
    headerName: "Delivery Qty",
    cellClass: "justify-end",
    valueFormatter: ({ value, data }) =>
      `${numberWithCommas(value, 0)} ${data?.unit}`,
  },
  {
    field: "cover_photo",
    headerName: "Image",
    cellStyle: { padding: 2 },
    minWidth: 100,
    cellRenderer: ({ value }: ICellRendererParams) => (
      <Box
        sx={(theme) => ({
          // m: 0.7,
          borderRadius: theme.shape.borderRadius + "px",
          outlineOffset: 1,
          outlineWidth: 2,
          outlineColor: "#8493ff9e",
          boxShadow: 1,
          overflow: "hidden",
        })}
      >
        <Image
          onDoubleClick={() => {
            window.open(value, "_blank");
          }}
          priority={true}
          src={ImageUrlConfig(value, "w_100,h_45,r_5")}
          width={100}
          height={50}
          alt=""
        />
      </Box>
    ),
  },
  {
    field: "status",
    editable: true,
    filter: true,
    cellEditor: "agSelectCellEditor",
    minWidth: 120,
    cellClass: "justify-center",
    cellEditorParams: {
      values: orderStatusEnum,
    },
    cellRenderer: ({ value }: ICellRendererParams) => (
      <OrderStatusChip value={value} />
    ),
  },
  {
    field: "_id",
    headerName: "Actions",
    cellRenderer: ({ value }: CustomCellRendererProps) => (
      <Stack direction={"row"} spacing={0.5}>
        <Tooltip title="Edit" placement="top" arrow>
          <IconButtonStyled size="xs" color="warning">
            <Icons.DesignServices />
          </IconButtonStyled>
        </Tooltip>
        <Tooltip title="Details" placement="top" arrow>
          <IconButtonStyled
            size="xs"
            LinkComponent={Link}
            href={`/v1/orders/${value}`}
            color="info"
          >
            <Icons.VisibilityIcon />
          </IconButtonStyled>
        </Tooltip>
      </Stack>
    ),
  },
];
