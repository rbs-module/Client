"use client";
import { useLoginMutation } from "@/services/user";
import type { LoginBody } from "@/types/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useLocalStorage } from "react-use";

export const useLogin = () => {
  const [email, setEmail] = useLocalStorage<string>("user_email", "");
  const query = useSearchParams();
  const queryEmail = query.get("email");
  const { control, handleSubmit, setError, getValues, setValue } =
    useForm<LoginBody>({
      defaultValues: {
        email: "",
        password: "",
      },
    });
  const router = useRouter();

  const [login, { isLoading, isSuccess, error, data }] = useLoginMutation();

  const [remember, setRemember] = useState(true);

  useEffect(() => {
    if (email || queryEmail) {
      setValue("email", queryEmail ?? email ?? "");
    }
  }, [email, queryEmail, setValue]);

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data?.message || "login success");
      localStorage.setItem("access_token", data.access_token);
      if (remember) {
        const emailValue = getValues("email");
        setEmail(emailValue);
      }
      // router.push("/");
      if (typeof window !== undefined) {
        window.location.href = "/";
      }
    }
  }, [data, router, isSuccess, getValues, remember, setEmail]);

  if (isLoading) {
    console.log("Loading");
  }

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
    onSubmit: login,
    loading: isLoading,
    remember,
    setRemember,
  };
};
