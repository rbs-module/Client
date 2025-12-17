"use client";
import { useForgotPasswordMutation } from "@/services/user";
import type { LoginBody } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { useLocalStorage } from "react-use";

export const useForgotPassword = () => {
  const [email, setEmail] = useLocalStorage<string>("user_email", "");

  const { control, handleSubmit, setError, getValues, setValue } = useForm<
    LoginBody & { confirmPassword: string }
  >({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();

  const [onSubmit, { isLoading, isSuccess, error, data }] =
    useForgotPasswordMutation();

  const formEmail = useWatch({ control, name: "email" });

  const [remember, setRemember] = useState(true);

  useEffect(() => {
    if (email) {
      setValue("email", email);
    }
  }, [email, setValue]);

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data?.message || "Enter OTP");
      const emailValue = getValues("email");
      setEmail(emailValue);

      router.push(`/auth/verify-email?email=${formEmail}`);
    }
  }, [data, router, isSuccess, getValues, remember, setEmail, formEmail]);

  if (error) {
    setError("email", {
      type: "validate",
      message: "Invalid Credentials",
    });
    setError("password", {
      type: "validate",
      message: "Invalid Credentials",
    });
    console.log("error", error);
  }

  return {
    control,
    handleSubmit,
    onSubmit,
    loading: isLoading,
    remember,
    setRemember,
  };
};
