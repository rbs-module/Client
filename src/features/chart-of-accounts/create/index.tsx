"use client";
import useCreateAccount from "./useCreateAccount";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { ACCOUNT_TYPES } from "@/zod-schemas/accounts/account-schema";
import { NumericFormat } from "react-number-format";
import { Icons } from "@/components/icons";
import ToolBarStyled from "@/components/styled/ToolBar";

function CreateAccount() {
  const { control, isLoading, submit, handleSubmit } = useCreateAccount();
  return (
    <Box component={"form"} onSubmit={handleSubmit(submit)}>
      <title>{"RBS | Create Account"}</title>

      <ToolBarStyled>Create Invoice</ToolBarStyled>
      <Box
        sx={(theme) => ({
          p: theme.spacing(2),
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderTop: 0,
        })}
      >
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="account_name"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  autoComplete="off"
                  label="Account Name"
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="account_type"
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth>
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    {...field}
                    error={Boolean(error?.message)}
                    label="Account Type"
                  >
                    {ACCOUNT_TYPES.map((item) => (
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
              control={control}
              name="description"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  autoComplete="off"
                  label="Descriptions"
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                />
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="balance"
              render={({ field, fieldState: { error } }) => (
                <NumericFormat
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  value={field.value}
                  thousandSeparator
                  prefix="BDT "
                  customInput={TextField}
                  label="Balance"
                  type="text"
                  onValueChange={({ floatValue }) => field.onChange(floatValue)}
                />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 4, md: 2 }}>
            <Controller
              control={control}
              name="is_debit"
              render={({ field }) => (
                <FormControlLabel
                  label="Is Debitable?"
                  control={
                    <Checkbox checked={field.value} onChange={field.onChange} />
                  }
                />
              )}
            />
          </Grid2>
        </Grid2>
        <Divider sx={{ my: 5 }} />
        <Box sx={{ justifyContent: "flex-end", display: "flex", mt: 1 }}>
          <Button type="submit" disabled={isLoading} variant="contained">
            {isLoading && <Icons.RefreshIcon className="animate-spin" />} Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default CreateAccount;
