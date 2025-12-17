"use client";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  createTheme,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { FC } from "react";
import UserLaptopImg from "@/assets/img/user-laptop.webp";
import Image from "next/image";
import { Controller } from "react-hook-form";

import controllerRoles from "@/utils/form-controller-roles";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { useForgotPassword } from "./useForgotPassword";

const LoginFuture: FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const lightTheme = createTheme();
  const { control, handleSubmit, onSubmit, loading, remember, setRemember } =
    useForgotPassword();

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
                  <Typography>Change Password</Typography>
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
                        {...field}
                        error={Boolean(error?.message)}
                        helperText={error?.message}
                      />
                    )}
                  />
                  <Controller
                    rules={controllerRoles}
                    control={control}
                    name="password"
                    render={({ field, fieldState: { error } }) => (
                      <FormControl variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">
                          Password
                        </InputLabel>
                        <OutlinedInput
                          {...field}
                          autoComplete="password"
                          error={Boolean(error?.message)}
                          size="small"
                          id="outlined-adornment-password"
                          type={showPassword ? "text" : "password"}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label={
                                  showPassword
                                    ? "hide the password"
                                    : "display the password"
                                }
                                onClick={handleClickShowPassword}
                                // onMouseDown={handleMouseDownPassword}
                                // onMouseUp={handleMouseUpPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <Icons.VisibilityOff />
                                ) : (
                                  <Icons.VisibilityIcon />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Password"
                        />
                        <FormHelperText error={Boolean(error?.message)}>
                          {error?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                  <Controller
                    rules={controllerRoles}
                    control={control}
                    name="confirmPassword"
                    render={({ field, fieldState: { error } }) => (
                      <FormControl variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">
                          Confirm Password
                        </InputLabel>
                        <OutlinedInput
                          {...field}
                          autoComplete="password"
                          error={Boolean(error?.message)}
                          size="small"
                          id="outlined-adornment-password"
                          type={showPassword ? "text" : "password"}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label={
                                  showPassword
                                    ? "hide the password"
                                    : "display the password"
                                }
                                onClick={handleClickShowPassword}
                                // onMouseDown={handleMouseDownPassword}
                                // onMouseUp={handleMouseUpPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <Icons.VisibilityOff />
                                ) : (
                                  <Icons.VisibilityIcon />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Confirm Password"
                        />
                        <FormHelperText error={Boolean(error?.message)}>
                          {error?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                  <Box>
                    <FormControlLabel
                      label="Remember me"
                      control={
                        <Checkbox
                          checked={remember}
                          onChange={() => setRemember((x) => !x)}
                        />
                      }
                    />
                  </Box>
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
                    Login
                  </Button>
                  <Typography sx={{ fontSize: 10, textAlign: "right" }}>
                    Don&apos;t Have Account?{" "}
                    <Link
                      className="text-blue-500 hover:underline duration-200"
                      href={"#"}
                    >
                      Register{" "}
                    </Link>
                    Hare
                  </Typography>
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
