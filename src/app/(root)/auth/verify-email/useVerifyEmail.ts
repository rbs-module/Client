"use client";
import { useVerifyEmailMutation } from "@/services/user";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const useVerifyEmail = () => {
  const query = useSearchParams();
  const email = query.get("email");
  const { control, handleSubmit, setError, setValue } = useForm({
    defaultValues: {
      email: "",
      code: "",
    },
  });
  const router = useRouter();

  useEffect(() => {
    if (email) {
      setValue("email", email);
    }
  }, [email, setValue]);

  const [onSubmit, { isLoading, isSuccess, error, data }] =
    useVerifyEmailMutation();

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data?.message || "Enter OTP");
      router.push(`/auth/login?email=${email}`);
    }
  }, [data, email, isSuccess, router]);

  if (error) {
    setError("code", {
      type: "validate",
      message: "Invalid Code",
    });
    console.log("error", error);
  }

  return {
    control,
    handleSubmit,
    onSubmit,
    loading: isLoading,
  };
};
