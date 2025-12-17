"use client";
import ToolBarStyled from "@/components/styled/ToolBar";
import {
  alpha,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import useCreateExpense from "./useCreateExpense";
import { Controller } from "react-hook-form";
import { DatePicker } from "@/components/DatePicker";
import controllerRoles from "@/utils/form-controller-roles";
import { SearchAccounts } from "@/features/search-accounts";
import FileUploader from "@/features/upload-img";
import { NumericFormat } from "react-number-format";
import { SearchSuppliers } from "@/features/search-suppliers";
import { format } from "date-fns";
import SimpleBar from "simplebar-react";
import { SearchEmployee } from "@/features/search-employee";

function CreateExpense() {
  const { control, type, accountRef, handleSubmit, onSubmit, isDeu, date } =
    useCreateExpense();
  return (
    <Box>
      <ToolBarStyled>Create Expense</ToolBarStyled>
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
                            <MenuItem value={"salary_advance"}>Salary</MenuItem>
                            <MenuItem value={"supplier_payment"}>
                              Supplier Payment
                            </MenuItem>
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
                          onValueChange={({ floatValue }) => {
                            field.onChange(floatValue);
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
                    <Grid2 container spacing={2}>
                      <Grid2 size={type == "purchase" ? 8 : 12}>
                        <Controller
                          rules={controllerRoles}
                          control={control}
                          name="source"
                          render={({ field, fieldState: { error } }) => (
                            <SearchAccounts
                              disabled={isDeu}
                              ref={accountRef}
                              label="Source"
                              query={{ have_balance: "no", is_debit: "true" }}
                              onChange={field.onChange}
                              error={error?.message}
                              value={field.value}
                            />
                          )}
                        />
                      </Grid2>
                      {type === "purchase" ? (
                        <Grid2 size={4}>
                          <Controller
                            control={control}
                            name="isDeu"
                            render={({ field }) => (
                              <FormControlLabel
                                label="Deu ?"
                                control={
                                  <Checkbox
                                    checked={field.value}
                                    onChange={field.onChange}
                                  />
                                }
                              />
                            )}
                          />
                        </Grid2>
                      ) : null}
                    </Grid2>
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

                  {type == "salary_advance" ? (
                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <Controller
                        rules={controllerRoles}
                        control={control}
                        name="employee"
                        render={({ field, fieldState: { error } }) => (
                          <SearchEmployee
                            label="Employee"
                            onChange={field.onChange}
                            error={error?.message}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            value={field?.value as any}
                            query={{ is_active: "true" }}
                          />
                        )}
                      />
                    </Grid2>
                  ) : null}
                  {type == "expense" ||
                  type == "purchase" ||
                  type == "supplier_payment" ? (
                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <Controller
                        rules={{
                          required: {
                            value: Boolean(
                              type == "purchase" || type == "supplier_payment",
                            ),
                            message: "This Field Is Required",
                          },
                        }}
                        control={control}
                        name="supplier"
                        render={({ field, fieldState: { error } }) => (
                          <SearchSuppliers
                            disabled={type == "expense"}
                            label="Supplier"
                            onChange={field.onChange}
                            error={error?.message}
                            value={field.value}
                          />
                        )}
                      />
                    </Grid2>
                  ) : null}
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

export default CreateExpense;
