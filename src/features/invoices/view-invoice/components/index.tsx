"use client";
import IconButtonStyled from "@/components/styled/IconButton";
import {
  useGetInvoiceByIdQuery,
  useGetInvoicesQuery,
  useUpdateInvoiceMutation,
} from "@/services/invoice";
import {
  alpha,
  Box,
  Card,
  Stack,
  ThemeProvider,
  Typography,
  useTheme,
} from "@mui/material";
import { useParams, usePathname } from "next/navigation";

import Image from "next/image";
import { format } from "date-fns";
import { toWords } from "@/utils/to_words";

import { useRef, useState } from "react";

import { useAppSelector } from "@/store/hook";
import { lightTheme } from "@/theme/lightTheme";
import { Icons } from "@/components/icons";
import ToolBarStyled from "@/components/styled/ToolBar";
import { getInvoiceConfig } from "@/constant/invoice";
import { useFetchMyOrganizationQuery } from "@/services/organization";
import InvoiceTable from "./table";
import { useReactToPrint } from "react-to-print";
import { numberWithCommas } from "@/utils/currency-formatter";
import Row from "@/components/Row";
import QRCode from "react-qr-code";
import { InvoiceItemType } from "@/zod-schemas/invoice";
import toast from "react-hot-toast";
import { CellEditingEvent } from "@/components/editableCell";
import useTriggerPrint from "@/hooks/useTriggerPrint";
import { BASE_URL } from "@/constant/base-url";

function InvoiceView() {
  const pathName = usePathname();
  const [updateInvoice] = useUpdateInvoiceMutation();

  const onCellValueChanged = async ({
    oldValue,
    newValue,
    data,
    field,
  }: CellEditingEvent<InvoiceItemType>) => {
    try {
      if (oldValue == newValue) {
        return;
      }
      if (!invoice) return;

      const id = data?._id || "";

      const items = invoice.item_data.items.map((item) => {
        if (item._id == id) {
          return { ...item, [field]: newValue };
        }
        return item;
      });
      const formData = { invoiceId: invoice.item_data.invoiceId, items };

      const { error: updateError } = await updateInvoice({ formData });

      if (updateError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err: any = updateError;
        const errors = err.data.errors;
        const msg = err.data.message;
        toast.error(msg || "Failed to update the data");
        errors?.forEach((error: { message: string }) => {
          toast.error(error.message);
        });
      } else {
        refetchInvoices();
      }
    } catch (error) {
      console.error("Failed to update the data:", error);
    }
  };
  const activePage = useParams();
  const invoiceId = activePage.id as string;
  const token = useAppSelector((state) => state.global.access_token);
  const query = useAppSelector((state) => state.invoice.query);
  const { refetch: refetchInvoices } = useGetInvoicesQuery(query);
  const { data: org } = useFetchMyOrganizationQuery(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const {
    isFetching,
    data: invoice,
    refetch,
  } = useGetInvoiceByIdQuery(invoiceId);
  const invoiceConfig = getInvoiceConfig(org?._id || "");

  const theme = useTheme();

  const [showPad, setShowPad] = useState(true);
  const [showQr, setShowQr] = useState(false);

  const reactToPrintFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: invoice?.invoiceNo || "Invoice",
    bodyClass: "m-0 p-0",
  });

  useTriggerPrint(reactToPrintFn);
  const download = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/invoice/pdf/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const blob = await res.blob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice?.invoiceNo ?? "Invoice"}.pdf`; // 👈 your desired filename
      document.body.appendChild(a);
      a.click();
      a.remove(); // cleanup
      URL.revokeObjectURL(url); // release memory
    } catch (err) {
      console.log({ err });
    }
  };
  if (!invoice) {
    return <>Loading...</>;
  }

  return (
    <Box>
      {pathName.includes("view") ? null : (
        <ToolBarStyled
          sx={(theme) => ({
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            boxShadow: 1,
            position: "absolute",
            width: "100%",
            backdropFilter: "blur(5px)",
            zIndex: 10,
          })}
        >
          {isFetching ? (
            <div>Loading...</div>
          ) : (
            <>
              <Typography
                variant="caption"
                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                {invoice?.invoiceNo}
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButtonStyled onClick={refetch}>
                  <Icons.RefreshIcon
                    className={isFetching ? `animate-spin` : ""}
                  />
                </IconButtonStyled>

                <IconButtonStyled onClick={() => download()}>
                  <Icons.DownloadIcon className="w-4 h-4" />
                </IconButtonStyled>

                <IconButtonStyled onClick={() => reactToPrintFn()}>
                  <Icons.PrintIcon className="w-4 h-4" />
                </IconButtonStyled>

                <IconButtonStyled onClick={() => setShowPad((prev) => !prev)}>
                  <Icons.VisibilityIcon className="w-4 h-4" />
                </IconButtonStyled>
                <IconButtonStyled onClick={() => setShowQr((prev) => !prev)}>
                  <Icons.QrCodeIcon className="w-4 h-4" />
                </IconButtonStyled>
              </Stack>
            </>
          )}
        </ToolBarStyled>
      )}

      <Box
        sx={() => ({
          height: "calc(100vh - 56px)",
          bgcolor: "background.default",
          border: 1,
          borderColor: "divider",
          borderRadius: `${theme.shape.borderRadius + "px"} ${theme.shape.borderRadius + "px"} 0 0`,
          overflow: "auto",
        })}
      >
        {/* <Toolbar variant="dense" sx={{ bgcolor: "background.paper" }}></Toolbar> */}
        <ThemeProvider theme={lightTheme}>
          <Card
            sx={{
              my: 5,
              mt: 8,
              width: "21cm",
              height: "29.7cm",
              mx: "auto",
            }}
          >
            <Box
              ref={componentRef}
              sx={{
                width: "21cm",
                height: "29.7cm",
                mx: "auto",
                // scale: 0.9,
                position: "relative",
              }}
            >
              {showPad ? (
                <div className="header">
                  {invoiceConfig.labels?.padTop ? (
                    <Image
                      src={invoiceConfig.labels.padTop}
                      alt="header"
                      width={1200}
                      className="pt-5"
                      height={300}
                    />
                  ) : (
                    <Box sx={{ textAlign: "center", my: 3 }}>
                      <Typography
                        sx={{
                          fontSize: "30px",
                          fontWeight: "bold",
                        }}
                      >
                        {org?.organization_name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        {invoiceConfig.labels.slogan}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        {org?.organization_address}
                      </Typography>
                      <div className="flex justify-center">
                        <p className="text-center bg-black/10 p-2 py-1 font-bold italic ">
                          Invoice
                        </p>
                      </div>
                    </Box>
                  )}
                </div>
              ) : (
                <div className="header" style={{ height: 174.77 }} />
              )}
              <div className="pt-7 px-16">
                <div className="flex justify-between leading-5">
                  <div className="">
                    <Typography color="black">To</Typography>
                    <b className="text-black">{invoice?.customer.name}</b>
                    <Typography className="text-black">
                      {invoice?.customer.address}
                    </Typography>
                  </div>
                  <div className="">
                    <p className="text-black">
                      {invoiceConfig.labels.datePrefix}:{" "}
                      {format(invoice?.date || new Date(), "dd-MMM-yyyy")}
                    </p>
                    <p className="text-black">
                      {invoiceConfig.labels.invoiceNoPrefix}:{" "}
                      <b> {invoice?.invoiceNo}</b>{" "}
                    </p>
                    <p className="text-black">
                      {invoiceConfig.labels.billNoPrefix}:{" "}
                      {invoice?.customerBillNo}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <strong className="text-black ">
                    Sub : {invoiceConfig.labels.subTitle}
                  </strong>
                </div>

                <div className="my-2">
                  {invoice && (
                    <InvoiceTable
                      config={invoiceConfig}
                      onCellValueChanged={onCellValueChanged}
                      invoice={invoice}
                    />
                  )}
                </div>

                <Row sx={{ justifyContent: "space-between", mt: 2 }}>
                  <Box>
                    {invoice?.item_data.items[0].currency == "USD" && (
                      <Typography fontSize={10} className="text-black">
                        Note : {'"USD 1.00"'} = {'"BDT'}
                        {numberWithCommas(
                          invoice?.item_data.items[0].exchange_rate,
                        )}
                        {'"'}
                      </Typography>
                    )}
                    <Typography className="text-black">
                      In Word :{toWords(invoice?.amount || 0)}
                    </Typography>
                    <Typography mt={2} fontStyle={"italic"}>
                      Early Payments Will Be Appreciated
                    </Typography>
                    <Typography mt={2} fontStyle={"italic"}>
                      Thanks
                    </Typography>
                  </Box>
                  {showQr && (
                    <Box>
                      <QRCode
                        bgColor={"transparent"}
                        value={`/view/invoice/${invoice?._id}`}
                        size={80}
                      />
                    </Box>
                  )}
                </Row>
              </div>

              <Box
                sx={{
                  position: "absolute",
                  bottom: 70,
                  px: 5,
                  width: "100%",
                }}
              >
                <Row sx={{ justifyContent: "space-between", px: 3 }}>
                  <p className="px-3 border-t-[1px]">Received By</p>
                  <Box sx={{ position: "relative" }}>
                    {invoiceConfig.labels.sign && showPad && (
                      <Image
                        src={invoiceConfig.labels.sign}
                        alt="signature"
                        width={120}
                        height={50}
                        className="absolute bottom-5 left-5"
                      />
                    )}
                    <p className="px-3 border-t-[1px]">
                      For: {org?.organization_name}
                    </p>
                  </Box>
                </Row>

                <Typography sx={{ textAlign: "center", mt: 2 }}>
                  {showPad ? invoiceConfig.labels.organization_address : ". "}
                </Typography>
              </Box>
            </Box>
          </Card>
        </ThemeProvider>
      </Box>
    </Box>
  );
}

export default InvoiceView;
