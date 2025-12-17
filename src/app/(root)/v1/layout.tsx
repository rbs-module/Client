"use client";

import WithSidebar from "@/features/sidebar";
import { useLazyFetchMeQuery } from "@/services/user";
import { setAccessToken } from "@/store/global";
import { useAppDispatch } from "@/store/hook";
import { LayoutProps } from "@/types/global";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = ({ children }: LayoutProps) => {
  const navigate = useRouter();
  const [fetchMe, { data, isFetching }] = useLazyFetchMeQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetch = async () => {
      const { error } = await fetchMe("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err: any = error;
      const status = err?.status;
      if (status == 401) {
        return navigate.push("/overview");
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
  if (!data) {
    return <>Loading...</>;
  }
  if (data) {
    return <WithSidebar>{children}</WithSidebar>;
  }
};
export default Page;
