"use client";
import { useLazyFetchMeQuery } from "@/services/user";
import { store } from "@/store";
import { setAccessToken } from "@/store/global";
import { useAppDispatch } from "@/store/hook";
import { Card, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { useSearchParam } from "react-use";

import { useFetchMyOrganizationQuery } from "@/services/organization";
import { useGetPaymentByIdQuery } from "@/services/payments";
import { numberWithCommas } from "@/utils/currency-formatter";

import { toWords } from "@/utils/to_words";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import SimpleBar from "simplebar-react";

import { Box } from "@mui/material";
import RefreshLoading from "@/components/Loading/RefreshLoading";
import { getInvoiceConfig } from "@/constant/invoice";
import { useReactToPrint } from "react-to-print";
import useTriggerPrint from "@/hooks/useTriggerPrint";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";

const Page = () => {
  return (
    <Provider store={store}>
      <PaymentPage />
    </Provider>
  );
};
const PaymentPage = () => {
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
  if (data) {
    return <PaymentView />;
  }
};
export default Page;

function PaymentView() {
  const { id } = useParams();

  const { data: payments, isFetching } = useGetPaymentByIdQuery(id as string);
  const { data: organization } = useFetchMyOrganizationQuery(null);
  const config = getInvoiceConfig(organization?._id ?? "");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const componentRef = useRef<any>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${payments?.voucher_no}`,
  });
  useTriggerPrint(reactToPrintFn);

  if (isFetching) {
    return <RefreshLoading />;
  }

  return (
    <div>
      <SimpleBar style={{ height: "calc(100vh)" }}>
        <Box sx={{ height: 10 }} />
        <Box
          component={Card}
          ref={componentRef}
          sx={{
            mx: "auto",
            width: "21cm",
            height: "12cm",
            backgroundImage: `url('${ImageUrlConfig(config.labels.mrcBase || "", "w_1500")}')`,
            backgroundSize: "100%", // 👈 fills box exactly
            backgroundRepeat: "no-repeat",
            position: "relative",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              left: 110,
              top: 175,
              position: "absolute",
              fontSize: 14,
            }}
          >
            : {payments?.voucher_no}
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              left: 630,
              top: 175,
              position: "absolute",
              fontSize: 14,
            }}
          >
            {format(payments?.date || "", "dd-MMM-yyyy")}
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              left: 310,
              top: 200,
              position: "absolute",
              fontSize: 14,
            }}
          >
            {payments?.customer.name}
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              left: 175,
              top: 260,
              position: "absolute",
              fontSize: 14,
            }}
          >
            {toWords(payments?.amount || 0)}
          </Typography>
          <Typography
            className="truncate max-w-96"
            sx={{
              fontWeight: "bold",
              left: 315,
              top: 290,
              position: "absolute",
              fontSize: 12,
            }}
          >
            {payments?.mode}
            {payments?.cheque_info?.cheque_no
              ? ` no : ${payments?.cheque_info?.cheque_no} , `
              : ""}
            {payments?.cheque_info?.bank_name &&
              ` Bank : ${payments?.cheque_info?.bank_name}`}
          </Typography>

          {payments?.cheque_info?.date && (
            <Typography
              sx={{
                fontWeight: "bold",
                left: 110,
                top: 320,
                position: "absolute",
                fontSize: 12,
              }}
            >
              {format(payments?.cheque_info?.date || "", "dd-MMM-yyyy")}
            </Typography>
          )}
          <Typography
            sx={{
              fontWeight: "bold",
              left: 430,
              top: 320,
              position: "absolute",
              fontSize: 12,
            }}
          >
            {payments?.created_by.name}
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              left: 90,
              top: 370,
              position: "absolute",
              fontSize: 16,
            }}
          >
            : {numberWithCommas(payments?.amount)}
          </Typography>

          <Box
            sx={{
              mx: "auto",
              width: 100,
              height: 100,
              backgroundImage: `url('${config.labels.sign}')`,
              backgroundSize: "100%", // 👈 fills box exactly
              backgroundRepeat: "no-repeat",
              position: "absolute",
              top: 320,
              left: 600,
            }}
          />
        </Box>
      </SimpleBar>
    </div>
  );
}
