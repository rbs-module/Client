import DateRangeSelector from "@/components/DateRangeSelector";
import ConfirmationDialog from "@/components/dialog/confirmation";
import { Icons } from "@/components/icons";
import IconButtonStyled from "@/components/styled/IconButton";
import {
  useLazyGetInventoryQtyQuery,
  useSetInventoryQtyMutation,
} from "@/services/orders";
import { thisMonthRange } from "@/utils/date-ranges";
import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableRow,
  Typography,
  styled,
  InputBase,
} from "@mui/material";
import React, { Ref, useEffect, useImperativeHandle, useState } from "react";

type Props = {
  ref?: Ref<{ open: () => void }>;
  orderId: string;
};

type Body = {
  delivery_qty: number;
  receive_qty: number;
  production_qty: number;
};

const TableCell = styled(MuiTableCell)(() => ({ padding: 3 }));

function AdjustInventory({ ref, orderId }: Props) {
  const [get, { data }] = useLazyGetInventoryQtyQuery();

  const [isEditable, setIsEditable] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [body, setBody] = useState<Body>({
    delivery_qty: 0,
    receive_qty: 0,
    production_qty: 0,
  });

  const [dateRange, setDateRange] =
    useState<typeof thisMonthRange>(thisMonthRange);

  const handleClose = () => {
    setIsOpen(false);
    setIsEditable(false);
  };

  useEffect(() => {
    if (data) {
      setBody(data);
    }
  }, [data]);

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        setIsOpen(true);
        get({ orderId, query: dateRange });
      },
    };
  }, [dateRange, get, orderId]);

  const handleDateChange = (date: typeof thisMonthRange) => {
    setDateRange(date);
    get({ orderId, query: date });
  };
  const [update] = useSetInventoryQtyMutation();
  const handleConfirm = async () => {
    await update({ orderId, formData: body });
  };

  return (
    <Box>
      <ConfirmationDialog
        title="Update Inventory"
        onClose={handleClose}
        onConfirm={handleConfirm}
        open={isOpen}
        content={
          <Box sx={{ minWidth: 300 }}>
            <Typography>
              Please Select Date Range For Get Calculation
            </Typography>
            <DateRangeSelector
              start_date={dateRange.start_date}
              end_date={dateRange.end_date}
              selected={dateRange.label}
              onChange={handleDateChange}
            />

            <Divider sx={{ my: 2 }} />

            <IconButtonStyled onClick={() => setIsEditable((p) => !p)}>
              <Icons.EditIcon />
            </IconButtonStyled>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Receive Qty</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    {isEditable ? (
                      <InputBase
                        value={body.receive_qty}
                        onChange={(e) =>
                          setBody((p) => ({
                            ...p,
                            receive_qty: Number(e.target.value),
                          }))
                        }
                        placeholder="Delivery"
                      />
                    ) : (
                      `${data?.receive_qty} Pcs`
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Production Qty</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    {isEditable ? (
                      <InputBase
                        value={body.production_qty}
                        onChange={(e) =>
                          setBody((p) => ({
                            ...p,
                            production_qty: Number(e.target.value),
                          }))
                        }
                        placeholder="Delivery"
                      />
                    ) : (
                      `${data?.production_qty} Pcs`
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Delivery Qty</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    {isEditable ? (
                      <InputBase
                        value={body.delivery_qty}
                        onChange={(e) =>
                          setBody((p) => ({
                            ...p,
                            delivery_qty: Number(e.target.value),
                          }))
                        }
                        placeholder="Delivery"
                      />
                    ) : (
                      `${data?.delivery_qty} Pcs`
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        }
      />
    </Box>
  );
}

export default AdjustInventory;
