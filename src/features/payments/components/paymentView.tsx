"use client";

import { Icons } from "@/components/icons";
import IconButtonStyled from "@/components/styled/IconButton";
import ToolBarStyled from "@/components/styled/ToolBar";
import { useFetchMyOrganizationQuery } from "@/services/organization";
import { useGetPaymentByIdQuery } from "@/services/payments";
import { numberWithCommas } from "@/utils/currency-formatter";

import { toWords } from "@/utils/to_words";
import { format } from "date-fns";
import { useParams, usePathname } from "next/navigation";
import React, { useRef } from "react";
import SimpleBar from "simplebar-react";

import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";
import RefreshLoading from "@/components/Loading/RefreshLoading";
import { getInvoiceConfig } from "@/constant/invoice";
import { BASE_URL } from "@/constant/base-url";
import { useAppSelector } from "@/store/hook";
import { useReactToPrint } from "react-to-print";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";
import useTriggerPrint from "@/hooks/useTriggerPrint";

function PaymentView() {
  const { id } = useParams();
  const token = useAppSelector((state) => state.global.access_token);
  const pathName = usePathname();
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

  const download = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/payments/pdf/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const blob = await res.blob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payment-${id}.pdf`; // 👈 your desired filename
      document.body.appendChild(a);
      a.click();
      a.remove(); // cleanup
      URL.revokeObjectURL(url); // release memory
    } catch (err) {
      console.log({ err });
    }
  };

  return (
    <div>
      <ToolBarStyled sx={{ pr: { md: 1 } }}>
        <Typography variant="subtitle2" fontWeight={"bold"}>
          {payments?.voucher_no}
        </Typography>

        <Stack direction={"row"} spacing={1}>
          {/* <Link href={`/v1/sales/payment-received/${id}/pdf`}> */}
          <IconButtonStyled onClick={() => reactToPrintFn()}>
            <Icons.PrintIcon />
          </IconButtonStyled>
          {/* </Link> */}
          <IconButtonStyled onClick={download}>
            <Icons.DownloadIcon />
          </IconButtonStyled>
          <IconButtonStyled
            disabled={pathName.includes("view")}
            LinkComponent={Link}
            href="/v1/sales/payment-received"
            color="error"
          >
            <Icons.CloseIcon />
          </IconButtonStyled>
        </Stack>
      </ToolBarStyled>
      <Box sx={{ border: 1, borderColor: "divider", p: 1 }}>
        <SimpleBar style={{ height: "calc(100vh - 100px)" }}>
          <Box
            sx={{
              mx: "auto",
              width: "21cm",
              height: "12cm",
              boxShadow: 3,
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                mx: "auto",
                width: "21cm",
                height: "12cm",
                backgroundImage: `url('${ImageUrlConfig(config.labels.mrcBase || "", "w_1500")}')`,
                backgroundSize: "100%", // 👈 fills box exactly
                backgroundRepeat: "no-repeat",
                position: "relative",
              }}
              ref={componentRef}
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
          </Box>
        </SimpleBar>
      </Box>
    </div>
  );
}

export default PaymentView;
