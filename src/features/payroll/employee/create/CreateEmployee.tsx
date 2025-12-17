"use client";
import ToolBarStyled from "@/components/styled/ToolBar";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";

import { Controller } from "react-hook-form";
import useCreateEmployee from "./useCreateEmployee";
import controllerRoles from "@/utils/form-controller-roles";
import { DatePicker } from "@mui/x-date-pickers";
import SimpleBar from "simplebar-react";
import FileUploader from "./profilePhotoUploader";

const Designation = [
  "General Manager",
  "Manager",
  "Super-Visor",
  "Designer",
  "Production Manager",
  "Admin",
  "Operator",
  "Helper",
  "Cleaner",
  "Quality Inspector",
  "",
];
function CreateEmployee() {
  const { control, handleSubmit, onSubmit } = useCreateEmployee();
  return (
    <Box>
      <ToolBarStyled></ToolBarStyled>

      <Box
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          border: 1,
          borderTop: 0,
          borderColor: "divider",
          padding: 3,
        }}
      >
        <SimpleBar style={{ height: "calc(100vh  - 140px" }}>
          <Grid2 container spacing={5}>
            <Grid2 size={{ xs: 12, sm: 8 }} spacing={3}>
              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Controller
                    rules={controllerRoles}
                    control={control}
                    name="name"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        variant="standard"
                        label="Name"
                        {...field}
                        error={Boolean(error?.message)}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Controller
                    rules={controllerRoles}
                    control={control}
                    name="designation"
                    render={({ field, fieldState: { error } }) => (
                      <Autocomplete
                        options={Designation}
                        {...field}
                        onChange={(_e, value) => {
                          field.onChange(value);
                        }}
                        freeSolo
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                            variant="standard"
                            label="Designation"
                            error={Boolean(error?.message)}
                            helperText={error?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Controller
                    rules={controllerRoles}
                    control={control}
                    name="department"
                    render={({ field, fieldState: { error } }) => (
                      <Autocomplete
                        freeSolo
                        options={["Embroidery"]}
                        {...field}
                        onChange={(_e, value) => {
                          field.onChange(value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Department"
                            error={Boolean(error?.message)}
                            helperText={error?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Controller
                    rules={controllerRoles}
                    control={control}
                    name="id_no"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        variant="standard"
                        label="ID"
                        {...field}
                        error={Boolean(error?.message)}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Controller
                    rules={controllerRoles}
                    control={control}
                    name="joining_date"
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        {...field}
                        label="Joining Date"
                        slotProps={{
                          textField: {
                            variant: "standard", // Apply the "standard" variant to the TextField
                            error: Boolean(error?.message),
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Controller
                    rules={controllerRoles}
                    control={control}
                    name="salary"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        variant="standard"
                        label="Salary"
                        type="number"
                        {...field}
                        error={Boolean(error?.message)}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Controller
                    // rules={controllerRoles}
                    control={control}
                    name="nid_no"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        variant="standard"
                        label="Nid No"
                        {...field}
                        error={Boolean(error?.message)}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Controller
                    // rules={controllerRoles}
                    control={control}
                    name="date_of_birth"
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        {...field}
                        label="Date Of Birth"
                        slotProps={{
                          textField: {
                            variant: "standard", // Apply the "standard" variant to the TextField
                            error: Boolean(error?.message),
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        variant="standard"
                        label="Email"
                        {...field}
                        error={Boolean(error?.message)}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        variant="standard"
                        label="Phone"
                        {...field}
                        error={Boolean(error?.message)}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}></Grid2>
              </Grid2>
              <Box justifyItems={"flex-end"} display={"flex"}>
                <Button type="submit" variant="outlined">
                  Save
                </Button>
              </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Card sx={{ padding: 2, m: 1, textAlign: "center" }}>
                <Controller
                  control={control}
                  name="image"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <FileUploader
                      value={value}
                      onUpload={onChange}
                      error={error?.message}
                    />
                  )}
                />
                <Typography>Name : {}</Typography>
              </Card>
            </Grid2>
          </Grid2>
        </SimpleBar>
      </Box>
    </Box>
  );
}

export default CreateEmployee;
