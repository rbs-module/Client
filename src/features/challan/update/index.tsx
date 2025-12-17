"use client";
import useUpdateChallan from "./useUpdateChallan";
import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableHead,
  TableRow,
  TextField,
  TableCellProps,
  InputBase,
  Stack,
  Button,
  Typography,
  TableContainer,
  Card,
} from "@mui/material";
import ToolBarStyled from "@/components/styled/ToolBar";
import { Controller } from "react-hook-form";
import { DatePicker } from "@/components/DatePicker";
import SearchCustomer from "@/features/search-customers/searchCustomers";
import { NumericFormat } from "react-number-format";
import { format } from "date-fns";
import controllerRoles from "@/utils/form-controller-roles";
import IconButtonStyled from "@/components/styled/IconButton";
import { Icons } from "@/components/icons";
import { SearchCustomerOrders } from "@/features/search-customer-orders";
import { _arrSum } from "@/utils/arrSum";
const TableCell = (props: TableCellProps) => {
  return (
    <MuiTableCell
      {...props}
      sx={{
        borderLeft: 1,
        borderLeftColor: "divider",
        width: "14%",
        ...props.sx,
      }}
    />
  );
};

function UpdateChallan() {
  const {
    control,
    onSubmit,
    handleAppend,
    handleRemove,
    selectedCustomer,
    items,
    itemsWatch,
  } = useUpdateChallan();
  return (
    <Box>
      <ToolBarStyled>Update Challan</ToolBarStyled>
      <Box
        height={"calc(100vh - 105px)"}
        overflow={"auto"}
        sx={{ border: 1, borderColor: "divider", borderTop: 0 }}
      >
        <Box p={2} pt={3} component={"form"} onSubmit={onSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Controller
                control={control}
                name="date"
                render={({ field }) => <DatePicker {...field} />}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <Controller
                control={control}
                name="challan_no"
                render={({ field, fieldState: { error } }) => (
                  <NumericFormat
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    value={field.value}
                    thousandSeparator
                    prefix={`CH-${format(new Date(), "yy")}-`}
                    customInput={TextField}
                    label="Challan No"
                    type="text"
                    onValueChange={({ floatValue }) =>
                      field.onChange(Number(floatValue))
                    }
                  />
                )}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Controller
                control={control}
                name="carrier_name"
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label={"Carrier"}
                    error={Boolean(error?.message)}
                    autoComplete="carrier"
                  />
                )}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Controller
                name="customer"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <SearchCustomer
                    setValue={field.onChange}
                    value={field.value}
                    error={error?.message}
                    inputProps={{ autoFocus: true }}
                  />
                )}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Controller
                name="type"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      {...field}
                      error={Boolean(error?.message)}
                      label="Type"
                    >
                      <MenuItem value={"Receive"}>Receive</MenuItem>
                      <MenuItem value={"Delivery"}>Delivery</MenuItem>
                    </Select>
                    <FormHelperText>{error?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid2>
          </Grid2>
          <Divider sx={{ my: 2 }} />
          <Box>
            <TableContainer component={Card}>
              <Table sx={{ minWidth: 700, overflow: "auto" }}>
                <TableHead>
                  <TableRow
                    sx={{
                      borderTop: 1,
                      borderColor: "divider",
                      bgcolor: "background.default",
                    }}
                  >
                    <TableCell sx={{ width: "25%", p: 1 }}>Orders</TableCell>
                    <TableCell sx={{ p: 1 }}>Color</TableCell>
                    <TableCell sx={{ p: 1 }}>Size</TableCell>
                    <TableCell sx={{ p: 1 }}>Qty</TableCell>
                    <TableCell sx={{ p: 1 }}>ER</TableCell>
                    <TableCell sx={{ p: 1 }}>FR</TableCell>

                    <TableCell
                      sx={{
                        borderLeft: 1,
                        borderRight: 1,
                        borderColor: "divider",
                        p: 1,
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, i) => (
                    <TableRow key={item.id + i}>
                      <TableCell sx={{ p: 0 }}>
                        <Controller
                          control={control}
                          rules={controllerRoles}
                          name={`items.${i}.order_data`}
                          render={({ field, fieldState: { error } }) => (
                            <Box sx={{ p: 0.5 }}>
                              <SearchCustomerOrders
                                label=""
                                value={field.value}
                                isDisabled={
                                  !Boolean(selectedCustomer?._id?.length)
                                }
                                customerId={selectedCustomer?._id || ""}
                                key={i}
                                error={error?.message}
                                onChange={field.onChange}
                              />
                            </Box>
                          )}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 0 }}>
                        <Controller
                          rules={controllerRoles}
                          control={control}
                          name={`items.${i}.color`}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <InputBase
                                placeholder="Color.."
                                autoComplete="color"
                                {...field}
                                onChange={field.onChange}
                                sx={{
                                  px: 2,
                                  border: Boolean(error?.message) ? 1 : 0,
                                  borderColor: "red",
                                }}
                                type="text"
                                fullWidth
                                onFocus={(e) => {
                                  if (e?.target instanceof HTMLInputElement) {
                                    e.target.select();
                                  }
                                }}
                              />
                              <FormHelperText>{error?.message}</FormHelperText>
                            </>
                          )}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 0 }}>
                        <Controller
                          control={control}
                          name={`items.${i}.size`}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <InputBase
                                {...field}
                                placeholder="Size.."
                                autoComplete="size"
                                onChange={field.onChange}
                                sx={{
                                  px: 2,
                                  border: Boolean(error?.message) ? 1 : 0,
                                  borderColor: "red",
                                }}
                                fullWidth
                                onFocus={(e) => {
                                  if (e?.target instanceof HTMLInputElement) {
                                    e.target.select();
                                  }
                                }}
                              />
                              <FormHelperText>{error?.message}</FormHelperText>
                            </>
                          )}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 0 }}>
                        <Controller
                          control={control}
                          name={`items.${i}.qty`}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <InputBase
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                sx={{
                                  px: 2,
                                  border: Boolean(error?.message) ? 1 : 0,
                                  borderColor: "red",
                                }}
                                type="number"
                                fullWidth
                                onFocus={(e) => {
                                  if (e?.target instanceof HTMLInputElement) {
                                    e.target.select();
                                  }
                                }}
                              />
                              <FormHelperText>{error?.message}</FormHelperText>
                            </>
                          )}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 0 }}>
                        <Controller
                          control={control}
                          name={`items.${i}.embroidery_reject`}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <InputBase
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                sx={{
                                  px: 2,
                                  border: Boolean(error?.message) ? 1 : 0,
                                  borderColor: "red",
                                }}
                                type="number"
                                fullWidth
                                onFocus={(e) => {
                                  if (e?.target instanceof HTMLInputElement) {
                                    e.target.select();
                                  }
                                }}
                              />
                              <FormHelperText>{error?.message}</FormHelperText>
                            </>
                          )}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 0 }}>
                        <Controller
                          control={control}
                          name={`items.${i}.fabric_reject`}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <InputBase
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                sx={{
                                  px: 2,
                                  border: Boolean(error?.message) ? 1 : 0,
                                  borderColor: "red",
                                }}
                                type="number"
                                fullWidth
                                onFocus={(e) => {
                                  if (e?.target instanceof HTMLInputElement) {
                                    e.target.select();
                                  }
                                }}
                              />
                              <FormHelperText>{error?.message}</FormHelperText>
                            </>
                          )}
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          borderLeft: 1,
                          borderRight: 1,
                          borderColor: "divider",
                          p: 0,
                        }}
                      >
                        <Stack
                          direction={"row"}
                          spacing={2}
                          sx={{
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {items.length - 1 == i && (
                            <IconButtonStyled
                              onClick={handleAppend}
                              disabled={items.length - 1 !== i}
                            >
                              <Icons.Add />
                            </IconButtonStyled>
                          )}
                          {items.length !== 1 && (
                            <IconButtonStyled onClick={() => handleRemove(i)}>
                              <Icons.RemoveRoundedIcon />
                            </IconButtonStyled>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box justifyContent={"flex-end"} display={"flex"} mt={2}>
            <Stack spacing={2}>
              <Typography variant="subtitle1">
                {_arrSum(itemsWatch, "qty") +
                  _arrSum(itemsWatch, "embroidery_reject") +
                  _arrSum(itemsWatch, "fabric_reject")}{" "}
                Pcs
              </Typography>
              <Button variant="outlined" type="submit">
                Save
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default UpdateChallan;
