"use client";
import { useGetTransactionByIdQuery } from "@/services/transaction";
import { useLazyFetchMeQuery } from "@/services/user";
import { store } from "@/store";
import { setAccessToken } from "@/store/global";
import { useAppDispatch } from "@/store/hook";
import { Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { useSearchParam } from "react-use";
import { numberWithCommas } from "@/utils/currency-formatter";

import { toWords } from "@/utils/to_words";
import { format } from "date-fns";
import SimpleBar from "simplebar-react";

import { Box } from "@mui/material";
import { getInvoiceConfig } from "@/constant/invoice";
import { TransactionFormatted } from "@/types/Transaction";
import { useReactToPrint } from "react-to-print";
import useTriggerPrint from "@/hooks/useTriggerPrint";

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
  const { id } = useParams();
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
  const { data: tr } = useGetTransactionByIdQuery(id as string);
  if (isFetching) {
    return <>Fetching...</>;
  }
  if (isLoading) {
    return <>Loading...</>;
  }
  if (!data) {
    return <Typography>Please Login !</Typography>;
  }
  if (!tr?.transaction) {
    return <Typography>Data Not Found</Typography>;
  }

  return <VoucherView transaction={tr.transaction} />;
};
export default Page;

function VoucherView({ transaction }: { transaction: TransactionFormatted }) {
  const config = getInvoiceConfig(transaction.organization_id ?? "");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const componentRef = useRef<any>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${transaction.voucher_no}`,
  });
  useTriggerPrint(reactToPrintFn);

  return (
    <div>
      <SimpleBar style={{ height: "calc(100vh - 100px)" }}>
        <Box
          sx={{
            mx: "auto",
            width: "21cm",
            height: "13cm",
            bgcolor: "#fff",
            boxShadow: 1,
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <Box
            ref={componentRef}
            sx={{
              mx: "auto",
              width: "21cm",
              height: "13cm",
              backgroundImage: `url('${config.labels.dVoucherBase}')`,
              backgroundSize: "100%", // 👈 fills box exactly
              backgroundRepeat: "no-repeat",
              position: "relative",
              bgcolor: "#fff",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                left: 140,
                top: 173,
                position: "absolute",
                fontSize: 14,
              }}
            >
              {transaction?.voucher_no}
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
              {format(transaction?.date || "", "dd-MMM-yyyy")}
            </Typography>
            <Typography
              sx={{
                fontWeight: "bold",
                top: 167,
                fontSize: 18,
                mt: -17,
                backgroundColor: "#f5f5f5",
                px: 3,
                borderRadius: 0.5,
              }}
            >
              {transaction.type.toUpperCase()}
            </Typography>
            <Typography
              sx={{
                fontWeight: "bold",
                left: 500,
                top: 205,
                position: "absolute",
                fontSize: 14,
              }}
            >
              {transaction.destination.account_name}
            </Typography>
            <Typography
              sx={{
                fontWeight: "bold",
                left: 190,
                top: 238,
                position: "absolute",
                fontSize: 14,
              }}
            >
              {transaction.source.account_name}
            </Typography>
            <Typography
              sx={{
                fontWeight: "bold",
                left: 160,
                top: 270,
                position: "absolute",
                fontSize: 14,
              }}
            >
              {transaction.destination.account_name}
            </Typography>

            <Typography
              sx={{
                fontWeight: "bold",
                left: 175,
                top: 303,
                position: "absolute",
                fontSize: 14,
              }}
            >
              {toWords(transaction?.amount || 0)}
            </Typography>

            <Typography
              sx={{
                fontWeight: "bold",
                left: 90,
                top: 340,
                position: "absolute",
                fontSize: 16,
              }}
            >
              : {numberWithCommas(transaction?.amount)}
            </Typography>
          </Box>
        </Box>
      </SimpleBar>
    </div>
  );
}
