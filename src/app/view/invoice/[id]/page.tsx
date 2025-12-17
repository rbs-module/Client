"use client";
import InvoiceView from "@/features/invoices/view-invoice/components";
import { useLazyFetchMeQuery } from "@/services/user";
import { store } from "@/store";
import { setAccessToken } from "@/store/global";
import { useAppDispatch } from "@/store/hook";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { useSearchParam } from "react-use";

const Page = () => {
  return (
    <Provider store={store}>
      <InvoicePage />
    </Provider>
  );
};
const InvoicePage = () => {
  const token = useSearchParam("x-access-token");

  useEffect(() => {
    if (token && typeof window !== "undefined") {
      localStorage.setItem("access_token", token); // stores raw string
    }
  }, [token]);

  const navigate = useRouter();
  const [fetchMe, { data, isFetching, isLoading }] = useLazyFetchMeQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetch = async () => {
      const { error } = await fetchMe("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err: any = error;
      const status = err?.status;
      if (status == 401) {
        return navigate.push("/auth/login");
      }
    };

    if (typeof window !== "undefined" && !data) {
      const value = localStorage.getItem("access_token") || "";
      dispatch(setAccessToken(value));

      fetch();
    }
  }, [dispatch, fetchMe, data, navigate]);

  if (isFetching) {
    return <>Fetching...</>;
  }
  if (isLoading) {
    return <>Loading...</>;
  }
  if (!data) {
    return <Typography>Please Login !</Typography>;
  }

  return <InvoiceView />;
};
export default Page;
