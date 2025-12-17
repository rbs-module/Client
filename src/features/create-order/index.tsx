"use client";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Controller } from "react-hook-form";
import useCreateOrder from "./useCreateOrder";
import controllerRoles from "@/utils/form-controller-roles";

import { OrderCurrenciesEnum, OrderUnitEnum } from "@/constant/order";

import { NumericFormat } from "react-number-format";

import IconButtonStyled from "@/components/styled/IconButton";

import SearchCustomer from "../search-customers/searchCustomers";
import FileUploader from "../upload-img";

import React from "react";
import SimpleBar from "simplebar-react";
import Link from "next/link";
import { Icons } from "@/components/icons";
import ToolBarStyled from "@/components/styled/ToolBar";

export const OrderForm = () => {
  const { control, currency, handleSubmit, onSubmit, append, fields, remove } =
    useCreateOrder();
  return (
    <Box>
      <SimpleBar style={{ height: "calc(100vh  - 106px)" }}>
        <ToolBarStyled
          sx={{
            bgcolor: "transparent",
            position: "sticky",
            width: "100%",
            zIndex: 10,
            top: 0,
            pl: 3,
            pr: 1,
          }}
        >
          <Typography>Create New</Typography>
          <Link href={"/v1/ord/orders"}>
            <IconButtonStyled>
              <Icons.CloseIcon />
            </IconButtonStyled>
          </Link>
        </ToolBarStyled>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 7, md: 8 }}>
                  <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <Controller
                        rules={controllerRoles}
                        control={control}
                        name="order_name"
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            required
                            error={Boolean(error?.message)}
                            size="small"
                            label={"Order Name"}
                            fullWidth
                            {...field}
                            helperText={error?.message}
                          />
                        )}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 6 }}>
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
                        rules={controllerRoles}
                        control={control}
                        name="qty"
                        render={({ field, fieldState: { error } }) => (
                          <NumericFormat
                            error={Boolean(error?.message)}
                            helperText={error?.message}
                            value={field.value}
                            thousandSeparator
                            customInput={TextField}
                            label="Qty"
                            type="text"
                            onValueChange={({ floatValue }) =>
                              field.onChange(floatValue)
                            }
                          />
                        )}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <Controller
                        rules={controllerRoles}
                        control={control}
                        name="unit"
                        render={({ field, fieldState: { error } }) => (
                          <FormControl fullWidth>
                            <InputLabel>Unit</InputLabel>
                            <Select
                              {...field}
                              error={Boolean(error?.message)}
                              label="Unit"
                            >
                              {OrderUnitEnum.map((item) => (
                                <MenuItem key={item} value={item}>
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>{error?.message}</FormHelperText>
                          </FormControl>
                        )}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <Controller
                        rules={controllerRoles}
                        control={control}
                        name="rate"
                        render={({ field, fieldState: { error } }) => (
                          <NumericFormat
                            error={Boolean(error?.message)}
                            helperText={error?.message}
                            value={field.value}
                            prefix={currency == "USD" ? "$ " : "৳ "}
                            thousandSeparator
                            customInput={TextField}
                            label="Rate"
                            type="text"
                            onValueChange={({ floatValue }) =>
                              field.onChange(floatValue)
                            }
                          />
                        )}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <Grid2 container spacing={2}>
                        <Grid2 size={currency == "USD" ? 6 : 12}>
                          <Controller
                            rules={controllerRoles}
                            control={control}
                            name="currency"
                            render={({ field, fieldState: { error } }) => (
                              <FormControl fullWidth>
                                <InputLabel>Currency</InputLabel>
                                <Select
                                  {...field}
                                  error={Boolean(error?.message)}
                                  label="Currency"
                                >
                                  {OrderCurrenciesEnum.map((item) => (
                                    <MenuItem key={item} value={item}>
                                      {item}
                                    </MenuItem>
                                  ))}
                                </Select>
                                <FormHelperText>
                                  {error?.message}
                                </FormHelperText>
                              </FormControl>
                            )}
                          />
                        </Grid2>
                        {currency == "USD" && (
                          <Grid2 size={6}>
                            <Controller
                              rules={controllerRoles}
                              control={control}
                              name="exchange_rate"
                              render={({ field, fieldState: { error } }) => (
                                <TextField
                                  defaultValue={100}
                                  required
                                  type="number"
                                  error={Boolean(error?.message)}
                                  size="small"
                                  label={"Exchange Rate"}
                                  fullWidth
                                  {...field}
                                  helperText={error?.message}
                                />
                              )}
                            />
                          </Grid2>
                        )}
                      </Grid2>
                    </Grid2>
                    <Grid2 size={12}>
                      <Controller
                        control={control}
                        name="description"
                        render={({ field }) => (
                          <TextField
                            label="Descriptions"
                            size="medium"
                            {...field}
                          />
                        )}
                      />
                    </Grid2>
                    <Grid2 size={12}>
                      <Divider />
                      <Stack
                        direction={"row"}
                        spacing={2}
                        sx={(theme) => ({
                          p: theme.spacing(1),
                          alignItems: "center",
                        })}
                      >
                        <Typography>Custom Fields</Typography>
                        <IconButtonStyled
                          onClick={() => append({ key: "", value: "" })}
                        >
                          <Icons.Add />
                        </IconButtonStyled>
                      </Stack>
                    </Grid2>

                    <Grid2 size={12} container>
                      {fields.map((field, index) => (
                        <React.Fragment key={field.id}>
                          <Grid2 size={3}>
                            <Controller
                              name={`properties.${index}.key`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="key"
                                  size="small"
                                />
                              )}
                            />
                          </Grid2>
                          <Grid2 size={7}>
                            <Controller
                              name={`properties.${index}.value`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="value"
                                  size="small"
                                />
                              )}
                            />
                          </Grid2>
                          <Grid2 size={2}>
                            <IconButtonStyled
                              size="small"
                              onClick={() => remove(index)}
                              color="error"
                              sx={(theme) => ({
                                background: theme.palette.error.light,
                                ":hover": {
                                  background: theme.palette.error.main,
                                },
                                color: theme.palette.error.contrastText,
                              })}
                            >
                              <Icons.CloseIcon />
                            </IconButtonStyled>
                          </Grid2>
                        </React.Fragment>
                      ))}
                    </Grid2>
                  </Grid2>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 5, md: 4 }}>
                  <Controller
                    control={control}
                    name="cover_photo"
                    render={({ field, fieldState: { error } }) => (
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <FileUploader
                          onUpload={field.onChange}
                          error={error?.message}
                          aspectRatio={4 / 3}
                        />
                      </Box>
                    )}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    sx={(theme) => ({ mt: theme.spacing(2) })}
                  >
                    Save
                  </Button>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>
          <button hidden type="submit" />
        </form>
      </SimpleBar>
    </Box>
  );
};
