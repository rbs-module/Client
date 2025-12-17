"use client";
import {
  Button,
  CircularProgress,
  Container,
  createTheme,
  Divider,
  Grid2,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { FC } from "react";
import UserLaptopImg from "@/assets/img/user-laptop.webp";
import Image from "next/image";
import { Controller } from "react-hook-form";

import controllerRoles from "@/utils/form-controller-roles";
import { Icons } from "@/components/icons";
import { useVerifyEmail } from "./useVerifyEmail";

const LoginFuture: FC = () => {
  const lightTheme = createTheme();
  const { control, handleSubmit, onSubmit, loading } = useVerifyEmail();

  return (
    <ThemeProvider theme={lightTheme}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-center items-center bg-gradient-to-r from-pink-600 via-purple-700 to-purple-800 h-screen">
          <Container
            maxWidth={"sm"}
            sx={(theme) => ({
              bgcolor: "background.paper",
              padding: 6,
              borderRadius: theme.shape.borderRadius + "px",
              backdropFilter: "blur(5px)",
              overflow: "auto",
              mx: 2,
            })}
          >
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 6 }} sx={{ borderRight: "1px solid" }}>
                <Image
                  priority
                  src={UserLaptopImg}
                  alt="user-laptop"
                  width={250}
                  height={250}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  <Typography>Enter OTP</Typography>
                  <Divider />
                  <Controller
                    rules={controllerRoles}
                    control={control}
                    name="email"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        type="email"
                        size="small"
                        label="Email"
                        disabled
                        {...field}
                        error={Boolean(error?.message)}
                        helperText={error?.message}
                      />
                    )}
                  />
                  <Controller
                    rules={controllerRoles}
                    control={control}
                    name="code"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        type="number"
                        size="small"
                        label="OTP"
                        {...field}
                        error={Boolean(error?.message)}
                        helperText={error?.message}
                      />
                    )}
                  />

                  <Button
                    disabled={loading}
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Icons.LoginIcon />
                      )
                    }
                    variant="contained"
                    size="small"
                    type="submit"
                  >
                    Submit
                  </Button>
                </Stack>
              </Grid2>
            </Grid2>
          </Container>
        </div>
      </form>
    </ThemeProvider>
  );
};

export default LoginFuture;
