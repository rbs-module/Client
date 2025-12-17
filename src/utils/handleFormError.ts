/* eslint-disable @typescript-eslint/no-explicit-any */
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import { ZodIssue } from "zod";

export const handleFormError = (
  error: FetchBaseQueryError | SerializedError,
  setError: any,
) => {
  const errors: ZodIssue[] = (error as any)?.data?.errors;

  if (errors && errors.length) {
    errors.map((err) => {
      const path = typeof err.path == "string" ? err.path : err.path.join(".");
      setError(path as any, { type: "custom", message: err.message });
    });
    console.log({ errors });
  } else {
    toast.error((error as any).data.message ?? "Error");
    console.log({ error });
  }
};
