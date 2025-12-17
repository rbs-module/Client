"use client";
import ToolBarStyled from "@/components/styled/ToolBar";
import { alpha, Box, Button, Container, Grid2, TextField } from "@mui/material";

import { Controller } from "react-hook-form";
import { DatePicker } from "@/components/DatePicker";
import controllerRoles from "@/utils/form-controller-roles";
import { SearchAccounts } from "@/features/search-accounts";
import { NumericFormat } from "react-number-format";
import { SearchSuppliers } from "@/features/search-suppliers";
import SimpleBar from "simplebar-react";
import useCreateSupplierPaymentMutation from "./useCreateSupplierPayment";

function CreateSupplierPayment() {
  const { control, accountRef, handleSubmit, onSubmit } =
    useCreateSupplierPaymentMutation();
  return (
    <Box>
      <ToolBarStyled>Create Supplier Payment</ToolBarStyled>
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
                  rules={controllerRoles}
                  control={control}
                  name="source"
                  render={({ field, fieldState: { error } }) => (
                    <SearchAccounts
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

              <Grid2 size={{ xs: 12, md: 6 }}>
                <Controller
                  rules={controllerRoles}
                  control={control}
                  name="supplier"
                  render={({ field, fieldState: { error } }) => (
                    <SearchSuppliers
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

export default CreateSupplierPayment;
