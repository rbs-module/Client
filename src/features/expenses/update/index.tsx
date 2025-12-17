"use client";
import ToolBarStyled from "@/components/styled/ToolBar";
import {
  alpha,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import useUpdateExpense from "./useUpdateExpense";
import { Controller } from "react-hook-form";
import { DatePicker } from "@/components/DatePicker";
import controllerRoles from "@/utils/form-controller-roles";
import { SearchAccounts } from "@/features/search-accounts";
import FileUploader from "@/features/upload-img";
import { NumericFormat } from "react-number-format";
import { SearchSuppliers } from "@/features/search-suppliers";
import { format } from "date-fns";
import SimpleBar from "simplebar-react";

function UpdateExpense() {
  const { control, type, accountRef, handleSubmit, onSubmit, date } =
    useUpdateExpense();
  return (
    <Box>
      <ToolBarStyled>Update Expense</ToolBarStyled>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          component={SimpleBar}
          height={"100vh"}
          sx={(theme) => ({
            border: 1,
            borderColor: "divider",
            borderTop: 0,
            padding: 3,
            background: `linear-gradient(to right bottom,
             ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.default, 0.3)})`,
          })}
        >
          <Container maxWidth="md">
            <Grid2 container spacing={2}>
              <Grid2 size={8}>
                <Grid2 container spacing={2.5}>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => <DatePicker {...field} />}
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
                            autoFocus
                            {...field}
                            error={Boolean(error?.message)}
                            label="Type"
                          >
                            <MenuItem value={"purchase"}>Purchase</MenuItem>
                            <MenuItem value={"expense"}>Expense</MenuItem>
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
                      name="voucher_no"
                      render={({ field, fieldState: { error } }) => (
                        <NumericFormat
                          error={Boolean(error?.message)}
                          helperText={error?.message}
                          value={field.value}
                          thousandSeparator
                          prefix={`EX-${format(new Date(date || ""), "yy-MM")}-`}
                          customInput={TextField}
                          label="Voucher No"
                          onValueChange={({ formattedValue }) => {
                            field.onChange(formattedValue);
                          }}
                        />
                      )}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Controller
                      control={control}
                      name="sl_no"
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Sl No"
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
                      name="source"
                      render={({ field, fieldState: { error } }) => (
                        <SearchAccounts
                          ref={accountRef}
                          label="Source"
                          query={{ type: "asset", have_balance: "no" }}
                          onChange={field.onChange}
                          error={error?.message}
                          value={field.value}
                        />
                      )}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Controller
                      rules={controllerRoles}
                      control={control}
                      name="destination"
                      render={({ field, fieldState: { error } }) => (
                        <SearchAccounts
                          label="Expense Account"
                          query={{ type: "expense" }}
                          onChange={field.onChange}
                          error={error?.message}
                          value={field.value}
                        />
                      )}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Controller
                      rules={{
                        required: {
                          value: Boolean(type == "purchase"),
                          message: "This Field Is Required",
                        },
                      }}
                      control={control}
                      name="supplier"
                      render={({ field, fieldState: { error } }) => (
                        <SearchSuppliers
                          disabled={type !== "purchase"}
                          label="Supplier"
                          onChange={field.onChange}
                          error={error?.message}
                          value={field.value}
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
                          prefix="BDT "
                          customInput={TextField}
                          label="Amount"
                          inputMode="numeric"
                          onValueChange={({ floatValue }) =>
                            field.onChange(floatValue)
                          }
                        />
                      )}
                    />
                  </Grid2>

                  <Grid2 size={12}>
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
                </Grid2>
              </Grid2>
              <Grid2 size={4}>
                <Controller
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <FileUploader onUpload={field.onChange} />
                  )}
                />
              </Grid2>
            </Grid2>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "end" }}>
              <Button variant="outlined" type="submit">
                Save
              </Button>
            </Box>
          </Container>
        </Box>
      </form>
    </Box>
  );
}

export default UpdateExpense;
