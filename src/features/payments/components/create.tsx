"use client";
import React from "react";
import useCreatePayment from "../hooks/useCreatePayment";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePicker } from "@/components/DatePicker";
import ToolBarStyled from "@/components/styled/ToolBar";
import SimpleBar from "simplebar-react";
import { NumericFormat } from "react-number-format";
import { format } from "date-fns";
import IconButtonStyled from "@/components/styled/IconButton";
import { Icons } from "@/components/icons";
import SearchCustomer from "@/features/search-customers/searchCustomers";
import controllerRoles from "@/utils/form-controller-roles";
import { SearchAccounts } from "@/features/search-accounts";
import { PAYMENT_MODS_ENUM } from "@/zod-schemas/Payment";
import { BANK_LIST } from "@/utils/bankLIst";
import FileUploader from "@/features/upload-img";

function CreatePayment() {
  const {
    control,
    refetchVoucherNo,
    isFetchingVoucherNo,
    mode,
    payDate,
    handleSubmit,
    onSubmit,
  } = useCreatePayment();
  return (
    <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <ToolBarStyled></ToolBarStyled>
      <Box
        sx={{ border: 1, borderTop: 0, borderColor: "divider", p: 3 }}
        component={SimpleBar}
        height={"calc(100vh - 102px)"}
      >
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              rules={controllerRoles}
              control={control}
              name="date"
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  value={field.value}
                  error={error?.message}
                  onChange={field.onChange}
                />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box sx={{ position: "relative" }}>
              <Controller
                control={control}
                name="voucher_no"
                render={({ field, fieldState: { error } }) => (
                  <NumericFormat
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    value={field.value}
                    inputMode="numeric"
                    thousandSeparator
                    prefix={`PAY-${format(payDate, "yy")}-`}
                    customInput={TextField}
                    label="Voucher No"
                    type="text"
                    onValueChange={({ floatValue }) =>
                      field.onChange(floatValue)
                    }
                  />
                )}
              />
              <IconButtonStyled
                onClick={refetchVoucherNo}
                sx={{ position: "absolute", right: 8, top: 3 }}
                size="xs"
              >
                <Icons.RefreshIcon
                  className={isFetchingVoucherNo ? "animate-spin" : ""}
                />
              </IconButtonStyled>
            </Box>
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
              control={control}
              name="description"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Descriptions"
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              rules={controllerRoles}
              control={control}
              name="destination_account"
              render={({ field, fieldState: { error } }) => (
                <SearchAccounts
                  onChange={field.onChange}
                  error={error?.message}
                  value={field.value}
                  query={{ type: "asset" }}
                />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              rules={controllerRoles}
              control={control}
              name="amount"
              render={({ field, fieldState: { error } }) => (
                <NumericFormat
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  value={field.value}
                  thousandSeparator
                  prefix="BDT   "
                  customInput={TextField}
                  label="Amount"
                  inputMode="numeric"
                  onValueChange={({ floatValue }) => field.onChange(floatValue)}
                />
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Grid2 container spacing={2}>
              <Grid2 size={12}>
                <Controller
                  rules={controllerRoles}
                  control={control}
                  name="mode"
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth>
                      <InputLabel>Payment Mode</InputLabel>
                      <Select
                        {...field}
                        error={Boolean(error?.message)}
                        label="Payment Mode"
                      >
                        {PAYMENT_MODS_ENUM.map((item) => (
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

              {mode == "Cheque" ? (
                <>
                  <Grid2 size={12}>
                    <Controller
                      rules={controllerRoles}
                      control={control}
                      name="cheque_info.bank_name"
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth>
                          <InputLabel>Select Bank</InputLabel>
                          <Select
                            {...field}
                            error={Boolean(error?.message)}
                            label="Select Bank"
                          >
                            {BANK_LIST.map((item) => (
                              <MenuItem
                                key={item.BankName}
                                value={item.BankName}
                              >
                                {item.BankName}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{error?.message}</FormHelperText>
                        </FormControl>
                      )}
                    />
                  </Grid2>
                  <Grid2 size={12}>
                    <Controller
                      control={control}
                      name="cheque_info.branch_name"
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Branch Name"
                          error={Boolean(error?.message)}
                          helperText={error?.message}
                        />
                      )}
                    />
                  </Grid2>
                  <Grid2 size={12}>
                    <Controller
                      rules={controllerRoles}
                      control={control}
                      name="cheque_info.cheque_no"
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Cheque No"
                          error={Boolean(error?.message)}
                          helperText={error?.message}
                        />
                      )}
                    />
                  </Grid2>
                  <Grid2 size={12}>
                    <Controller
                      rules={controllerRoles}
                      control={control}
                      name="cheque_info.date"
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          label="Cheque Date"
                          value={field.value}
                          error={error?.message}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </Grid2>
                </>
              ) : null}
            </Grid2>
          </Grid2>
          {mode == "Cheque" ? (
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Controller
                name="cheque_info.image"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <FileUploader
                      onUpload={field.onChange}
                      error={error?.message}
                    />
                  </Box>
                )}
              />
            </Grid2>
          ) : null}
        </Grid2>
        <Divider sx={{ my: 2 }} />
        <Button type="submit" sx={{ ml: "auto" }} variant="outlined">
          Save
        </Button>
      </Box>
    </Box>
  );
}

export default CreatePayment;
