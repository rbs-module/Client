"use client";
import React from "react";
import usePriceQuotationForm from "../hooks/usePriceQuotForm";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid2,
  // InputBase,
  InputLabel,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  // Stack,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableHead,
  TableRow,
  TextField,
  TableCellProps,
  InputBase,
  // useTheme,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import SearchCustomer from "@/features/search-customers/searchCustomers";
import controllerRoles from "@/utils/form-controller-roles";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";
import { Icons } from "@/components/icons";
import ToolBarStyled from "@/components/styled/ToolBar";
import IconButtonStyled from "@/components/styled/IconButton";
import { numberWithCommas } from "@/utils/currency-formatter";
import ImagePicker from "./imagePicker";
const TableCell = (props: TableCellProps) => {
  return (
    <MuiTableCell
      {...props}
      sx={{
        borderLeft: 1,
        borderLeftColor: "divider",
        width: "14%",
        padding: 1,
        ...props.sx,
      }}
    />
  );
};
function CreatePriceQuotationForm() {
  // const theme = useTheme();
  const {
    control,
    orders,
    handleRemove,
    handleSelectOrder,
    handleSubmit,
    submit,
    isLoading,
    items,
    selectedItems,
    appendDefault,
  } = usePriceQuotationForm();

  const calculateAmount = (i: number) => {
    const qty = selectedItems?.[i]?.qty;
    const rate = selectedItems?.[i]?.rate;
    const currency = selectedItems?.[i]?.currency;
    const exchange_rate = selectedItems?.[i]?.exchange_rate ?? 1;
    return currency == "BDT"
      ? numberWithCommas(qty * rate * exchange_rate)
      : numberWithCommas((qty / 12) * rate * exchange_rate);
  };

  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit(submit)}
      sx={{
        bgcolor: "background.default",
      }}
    >
      <ToolBarStyled
        sx={{
          bgcolor: "transparent",
          position: "sticky",
          width: "100%",
          zIndex: 10,
          top: 0,
          px: 1,
        }}
        variant="dense"
      >
        Create Price Quotation
      </ToolBarStyled>
      <Box
        sx={(theme) => ({
          p: theme.spacing(2),
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
        })}
      >
        <Grid2 container spacing={2}>
          <Grid2 size={12}>
            <Controller
              rules={controllerRoles}
              control={control}
              name="customer"
              render={({ field, fieldState: { error } }) => (
                <SearchCustomer
                  setValue={field.onChange}
                  value={field.value}
                  error={error?.message}
                />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="date"
              render={({ field, fieldState: { error } }) => (
                <FormControl error fullWidth>
                  <DatePicker {...field} />
                  <FormHelperText>{error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="invoiceNo"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  label="Quotation NO"
                />
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="remarks"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  label="Remarks"
                />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Select Orders {orders.length}</InputLabel>
              <Select
                disabled={Boolean(orders.length == 0)}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Select Orders 4"
              >
                {orders.map((order) => (
                  <ListItemButton
                    key={order._id}
                    selected={false}
                    onClick={() => handleSelectOrder(order)}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={ImageUrlConfig(
                          order.cover_photo,
                          "w_50,h_50,r_max",
                        )}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`#${order.sl_no} ${order.order_name}`}
                      secondary={`Delivery-${order.inventory?.delivery_qty} Pcs`}
                    />
                  </ListItemButton>
                ))}
                {Boolean(orders.length == 0) && (
                  <MenuItem>Data Not Found</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={12}>
            <Table style={{ tableLayout: "fixed", minWidth: 700 }}>
              <TableHead>
                <TableRow
                  sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    boxShadow: 1,
                  }}
                >
                  <TableCell sx={{ textAlign: "center" }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Design</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Currency</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Qty</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Rate</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Amount</TableCell>
                  <TableCell
                    sx={{
                      borderLeft: 1,
                      borderRight: 1,
                      borderColor: "divider",
                      textAlign: "center",
                    }}
                  >
                    Actions
                    <IconButtonStyled
                      onClick={appendDefault}
                      disabled={isLoading}
                      sx={{ ml: 2 }}
                      size="xs"
                      color="success"
                    >
                      <Icons.Add />
                    </IconButtonStyled>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((_item, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Controller
                        control={control}
                        rules={controllerRoles}
                        name={`items.${i}.order_name`}
                        render={({ field }) => (
                          <InputBase
                            placeholder="Descriptions"
                            autoFocus
                            {...field}
                            sx={{ px: 2 }}
                            fullWidth
                            onFocus={(e) => {
                              if (e?.target instanceof HTMLInputElement) {
                                e.target.select();
                              }
                            }}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        p: 0,
                        px: 0.5,
                        justifyContent: "center",
                      }}
                    >
                      <Controller
                        control={control}
                        rules={controllerRoles}
                        name={`items.${i}.cover_photo`}
                        render={({ field }) => <ImagePicker {...field} />}
                      />
                    </TableCell>
                    <TableCell sx={{ p: 0, px: 0.5 }}>
                      <Controller
                        control={control}
                        rules={controllerRoles}
                        name={`items.${i}.currency`}
                        render={({ field: { value } }) => <p>{value}</p>}
                      />
                    </TableCell>
                    <TableCell sx={{ p: 0, px: 0.5 }}>
                      <Controller
                        control={control}
                        rules={controllerRoles}
                        name={`items.${i}.qty`}
                        render={({ field }) => (
                          <InputBase
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            sx={{ px: 2 }}
                            type="number"
                            fullWidth
                            onFocus={(e) => {
                              if (e?.target instanceof HTMLInputElement) {
                                e.target.select();
                              }
                            }}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell sx={{ p: 0, px: 0.5 }}>
                      <Controller
                        control={control}
                        rules={controllerRoles}
                        name={`items.${i}.rate`}
                        render={({ field }) => (
                          <InputBase
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            sx={{ px: 2 }}
                            type="number"
                            fullWidth
                            onFocus={(e) => {
                              if (e?.target instanceof HTMLInputElement) {
                                e.target.select();
                              }
                            }}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell sx={{ p: 0, px: 0.5 }}>
                      {calculateAmount(i)}
                    </TableCell>
                    <TableCell
                      sx={{
                        p: 0,
                        px: 0.5,
                        borderRight: 1,
                        borderRightColor: "divider",
                        justifyItems: "center",
                      }}
                    >
                      <div className="mx-auto">
                        <IconButtonStyled
                          size="xs"
                          onClick={() => handleRemove(i)}
                        >
                          <Icons.RemoveRoundedIcon />
                        </IconButtonStyled>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid2>
        </Grid2>
        <Divider />
        <Box sx={{ justifyContent: "flex-end", display: "flex", mt: 1 }}>
          <Button
            type="submit"
            disabled={Boolean(items.length == 0) || isLoading}
            variant="contained"
          >
            {isLoading && <Icons.RefreshIcon className="animate-spin" />} Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default CreatePriceQuotationForm;
