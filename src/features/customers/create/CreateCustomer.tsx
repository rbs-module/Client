"use client";
import ToolBarStyled from "@/components/styled/ToolBar";
import { CreateCustomerBodyType } from "@/types/customer";
import controllerRoles from "@/utils/form-controller-roles";
import { Box, Button, Container, Grid2, TextField } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import useCreateCustomer from "./useCreateCustomer";

const structure = [
  {
    name: "name",
    type: "text",
    required: true,
  },
  {
    name: "email",
    type: "email",
    required: true,
  },
  {
    name: "phone",
    type: "text",
    required: true,
  },
  {
    name: "address",
    type: "text",
    required: true,
  },
  {
    name: "balance",
    type: "number",
    required: true,
  },
];

function CustomerForm() {
  const { control, onSubmit } = useCreateCustomer();
  return (
    <Box>
      <ToolBarStyled>Create Customer</ToolBarStyled>
      <Container
        sx={{ mt: 5 }}
        maxWidth="lg"
        component={"form"}
        onSubmit={onSubmit}
      >
        <Grid2 container spacing={3}>
          {structure.map((item) => (
            <Grid2 key={item.name} size={{ xs: 12, md: 6 }}>
              <Controller
                rules={item.required ? controllerRoles : { required: false }}
                control={control}
                name={item.name as keyof CreateCustomerBodyType}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    type={item.type}
                    {...field}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    label={String(item.name).toUpperCase()}
                  />
                )}
              />
            </Grid2>
          ))}
        </Grid2>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default CustomerForm;
