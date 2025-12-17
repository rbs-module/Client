import {
  Box,
  Divider,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableRow,
  styled,
  Typography,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import React, { useRef } from "react";
import useOrderDetails from "../../hooks/useOrderDetails";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";
import { format } from "date-fns";
import getRelativeTime from "@/utils/relativeTime";
import { numberWithCommas } from "@/utils/currency-formatter";
import { FormattedOrder } from "@/types/order";
import { Icons } from "@/components/icons";
import AdjustInventory from "../AdjustInventory";
import { useFetchMeQuery } from "@/services/user";

const TableCell = styled(MuiTableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: 3,
  paddingBottom: 3,
  borderStyle: "none",
}));

const LoadingTableCell = ({
  value,
  children,
}: {
  value?: string | number;
  children?: React.ReactNode;
}) => (
  <TableCell>
    {value ? (
      children ? (
        children
      ) : (
        <strong>{value}</strong>
      )
    ) : (
      <Skeleton width={100} />
    )}
  </TableCell>
);

const getInvoiceAmount = (item: FormattedOrder) => {
  const unitQty = item.currency !== "USD" ? 1 : 12;
  const amm = (item.qty / unitQty) * item.rate * (item.exchange_rate || 1);
  return Number(amm.toFixed(2));
};

function Details() {
  const adjustInventoryDialogRef = useRef<{ open: () => void }>(null);
  const { order } = useOrderDetails();
  const { data: user } = useFetchMeQuery("");

  const visibleRate = user?.role.some((role) =>
    ["admin", "user"].includes(role),
  );

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={2}>
        {order ? (
          <Image
            className="border-[1px] border-[divider]"
            src={ImageUrlConfig(order?.cover_photo, "w_250,h_200") || ""}
            width={250}
            height={200}
            alt=""
          />
        ) : (
          <Skeleton variant="rectangular" width={250} height={200} />
        )}
        <Typography>
          Est: Inv Value = {order && numberWithCommas(getInvoiceAmount(order))}
        </Typography>
        <Divider />
        <Box>
          <Table
            sx={{
              width: "auto",
            }}
          >
            <TableBody>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>:</TableCell>
                <LoadingTableCell value={order?.status} />
              </TableRow>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>:</TableCell>
                <LoadingTableCell value={order?.customer.name} />
              </TableRow>
              <TableRow>
                <TableCell>Sl No </TableCell>
                <TableCell>:</TableCell>
                <LoadingTableCell value={order?.sl_no} />
              </TableRow>
              <TableRow>
                <TableCell>Style</TableCell>
                <TableCell>:</TableCell>
                <LoadingTableCell value={order?.order_name} />
              </TableRow>

              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>:</TableCell>
                <LoadingTableCell
                  value={
                    order
                      ? `${format(order?.created_at || "", "dd-MMM-yy")} | ${getRelativeTime(order?.created_at || "")}`
                      : undefined
                  }
                />
              </TableRow>
              {visibleRate && (
                <TableRow>
                  <TableCell>Rate</TableCell>
                  <TableCell>:</TableCell>
                  <LoadingTableCell
                    value={
                      order
                        ? `${order.currency} ${numberWithCommas(order.rate)}`
                        : undefined
                    }
                  />
                </TableRow>
              )}
              <TableRow sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TableCell>Qty</TableCell>
                <TableCell>:</TableCell>
                <LoadingTableCell value={order?.qty + " " + order?.unit} />
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Inventory</b>
                  <IconButton
                    onClick={() => adjustInventoryDialogRef.current?.open()}
                  >
                    <Icons.EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Receive Qty</TableCell>
                <TableCell>:</TableCell>
                <LoadingTableCell value={order?._id}>
                  {order && (
                    <p>
                      <strong>
                        {`${order.inventory.receive_qty} ${order.unit}`}{" "}
                      </strong>
                      <Typography component={"span"} color="textSecondary">
                        | ({order.qty - order.inventory.receive_qty})
                      </Typography>
                    </p>
                  )}
                </LoadingTableCell>
              </TableRow>
              <TableRow>
                <TableCell>Production Qty</TableCell>
                <TableCell>:</TableCell>
                <LoadingTableCell value={order?._id}>
                  {order && (
                    <p>
                      <strong>
                        {`${order.inventory.production_qty} ${order.unit}`}{" "}
                      </strong>
                      <Typography component={"span"} color="textSecondary">
                        | (
                        {order.inventory.receive_qty -
                          order.inventory.production_qty}
                        )
                      </Typography>
                    </p>
                  )}
                </LoadingTableCell>
              </TableRow>
              <TableRow>
                <TableCell>Finishing Qty</TableCell>
                <TableCell>:</TableCell>
                <LoadingTableCell value={order?._id}>
                  {order && (
                    <p>
                      <strong>
                        {`${order.inventory.finishing_qty} ${order.unit}`}{" "}
                      </strong>
                      <Typography component={"span"} color="textSecondary">
                        | (
                        {order.inventory.production_qty -
                          order.inventory.finishing_qty}
                        )
                      </Typography>
                    </p>
                  )}
                </LoadingTableCell>
              </TableRow>
              <TableRow sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TableCell>Delivery Qty</TableCell>
                <TableCell>:</TableCell>
                <LoadingTableCell value={order?._id}>
                  {order && (
                    <p>
                      <strong>
                        {`${order.inventory.delivery_qty} ${order.unit}`}{" "}
                      </strong>
                      <Typography component={"span"} color="textSecondary">
                        | (
                        {order.inventory.production_qty -
                          order.inventory.delivery_qty}
                        )
                      </Typography>
                    </p>
                  )}
                </LoadingTableCell>
              </TableRow>

              {Array.isArray(order?.properties) &&
                order.properties.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.key}</TableCell>
                    <TableCell>:</TableCell>
                    <LoadingTableCell value={item.value} />
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </Stack>
      <AdjustInventory
        orderId={order?._id || ""}
        ref={adjustInventoryDialogRef}
      />
    </Box>
  );
}

export default Details;
