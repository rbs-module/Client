"use client";

import { Icons } from "@/components/icons";
import IconButtonStyled from "@/components/styled/IconButton";
import ToolBarStyled from "@/components/styled/ToolBar";
import { useFetchMyOrganizationQuery } from "@/services/organization";
import { numberWithCommas } from "@/utils/currency-formatter";

import { toWords } from "@/utils/to_words";
import { format } from "date-fns";
import { useParams, usePathname } from "next/navigation";
import React, { useRef } from "react";
import SimpleBar from "simplebar-react";

import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { getInvoiceConfig } from "@/constant/invoice";
import { BASE_URL } from "@/constant/base-url";
import { useAppSelector } from "@/store/hook";
import { TransactionFormatted } from "@/types/Transaction";
import { useReactToPrint } from "react-to-print";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";
import useTriggerPrint from "@/hooks/useTriggerPrint";

function VoucherView({ transaction }: { transaction: TransactionFormatted }) {
  const { id } = useParams();
  const token = useAppSelector((state) => state.global.access_token);
  const pathName = usePathname();
  const { data: organization } = useFetchMyOrganizationQuery(null);
  const config = getInvoiceConfig(organization?._id ?? "");

  const download = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/transactions/pdf/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const blob = await res.blob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${transaction.voucher_no ?? "Debit Voucher"}.pdf`; // 👈 your desired filename
      document.body.appendChild(a);
      a.click();
      a.remove(); // cleanup
      URL.revokeObjectURL(url); // release memory
    } catch (err) {
      console.log({ err });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const componentRef = useRef<any>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${transaction.voucher_no}`,
  });
  useTriggerPrint(reactToPrintFn);

  return (
    <div>
      <ToolBarStyled sx={{ pr: { md: 1 } }}>
        <Typography variant="subtitle2" fontWeight={"bold"}>
          {transaction?.voucher_no}
        </Typography>

        <Stack direction={"row"} spacing={1}>
          {transaction.image && (
            <Link href={transaction.image} target="_blank">
              <IconButtonStyled>
                <Icons.AddPhotoAlternateIcon />
              </IconButtonStyled>
            </Link>
          )}

          <IconButtonStyled onClick={() => reactToPrintFn()}>
            <Icons.PrintIcon />
          </IconButtonStyled>

          <IconButtonStyled onClick={download}>
            <Icons.DownloadIcon />
          </IconButtonStyled>
          <IconButtonStyled
            disabled={pathName.includes("view")}
            LinkComponent={Link}
            href={`/v1/purchase/expenses/${transaction._id}/update`}
            color="error"
          >
            <Icons.EditIcon />
          </IconButtonStyled>
          <IconButtonStyled
            LinkComponent={Link}
            href="/v1/purchase/expenses"
            color="error"
          >
            <Icons.CloseIcon />
          </IconButtonStyled>
        </Stack>
      </ToolBarStyled>
      <Box sx={{ border: 1, borderColor: "divider", p: 1, borderTop: 0 }}>
        <SimpleBar style={{ height: "calc(100vh - 100px)" }}>
          <Box
            sx={{
              mx: "auto",
              width: "21cm",
              height: "13cm",
              bgcolor: "#fff",
              boxShadow: 3,
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                mx: "auto",
                width: "21cm",
                height: "13cm",
                backgroundImage: `url('${ImageUrlConfig(config.labels.dVoucherBase || "", "")}')`,
                backgroundSize: "100%", // 👈 fills box exactly
                backgroundRepeat: "no-repeat",
                position: "relative",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
              }}
              ref={componentRef}
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
                  left: 110,
                  top: 203,
                  position: "absolute",
                  fontSize: 14,
                }}
              >
                {transaction?.employee?.name}
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
                {transaction.description}
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
      </Box>
    </div>
  );
}

export default VoucherView;

// "use client";
// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { Icons } from "@/components/icons";
// import IconButtonStyled from "@/components/styled/IconButton";
// import ToolBarStyled from "@/components/styled/ToolBar";
// import { useFetchMyOrganizationQuery } from "@/services/organization";
// import { ImageUrlConfig } from "@/utils/imageUrlConfig";
// import { toWords } from "@/utils/to_words";
// import { useRef } from "react";
// import { useReactToPrint } from "react-to-print";
// import SimpleBar from "simplebar-react";
// import QRCode from "react-qr-code";
// import { Box, Stack, Typography } from "@mui/material";
// import Link from "next/link";
// import { TransactionFormatted } from "@/types/Transaction";
// import { getInvoiceConfig } from "@/constant/invoice";
// import { usePathname } from "next/navigation";

// function VoucherView({ transaction }: { transaction: TransactionFormatted }) {
//   const pathName = usePathname();
//   const componentRef = useRef<any>(null);

//   const { data: organization } = useFetchMyOrganizationQuery(null);
//   const config = getInvoiceConfig(organization?._id ?? "");

//   const reactToPrintFn = useReactToPrint({
//     contentRef: componentRef,
//     documentTitle: "MRC",
//   });

//   // TODO: Fetch From DB
//   const voucher = {
//     background: {
//       color: "#fff",
//     },
//     logo: {
//       left: 100,
//       path: config.labels.logo,
//       top: 35,
//       width: 100,
//     },
//     org_name: {
//       color: "#000",
//       fontSize: "35px",
//     },
//     size: {
//       height: "14.5cm",
//       width: "24cm",
//     },
//     slogan: config.labels.slogan,
//     waterMark: {
//       height: 200,
//       opacity: 0.1,
//       path: config.labels.logo,
//       top: "40%",
//       left: "39%",
//       width: 200,
//     },
//   };
//   return (
//     <div style={{ fontSize: 12 }}>
//       <ToolBarStyled sx={{ pr: { md: 1 } }}>
//         <Typography variant="subtitle2" fontWeight={"bold"}>
//           {transaction?.voucher_no}
//         </Typography>

//         <Stack direction={"row"} spacing={1}>
//           <IconButtonStyled onClick={() => reactToPrintFn()}>
//             <Icons.PrintIcon />
//           </IconButtonStyled>
//           <IconButtonStyled
//             disabled={pathName.includes("view")}
//             LinkComponent={Link}
//             href={`/v1/purchase/expenses/${transaction._id}/update`}
//             color="error"
//           >
//             <Icons.EditIcon />
//           </IconButtonStyled>
//           <IconButtonStyled
//             disabled={pathName.includes("view")}
//             LinkComponent={Link}
//             href="/v1/purchase/expenses"
//             color="error"
//           >
//             <Icons.CloseIcon />
//           </IconButtonStyled>
//         </Stack>
//       </ToolBarStyled>
//       <SimpleBar style={{ height: "calc(100vh - 100px)" }}>
//         <div
//           style={{
//             background: voucher.background.color,
//             width: voucher.size.width,
//             height: voucher.size.height,
//             color: voucher.org_name.color,
//           }}
//           ref={componentRef}
//           className={`mx-auto p-5 px-10 relative mt-5`}
//         >
//           <div
//             style={{
//               top: voucher.logo.top,
//               left: voucher.logo.left,
//             }}
//             className={`absolute`}
//           >
//             {/* eslint-disable-next-line @next/next/no-img-element */}
//             <img
//               src={ImageUrlConfig(voucher.logo.path, `w_${voucher.logo.width}`)}
//               width={voucher.logo.width}
//               // height={"auto"}
//               alt="logo"
//             />
//           </div>
//           <div
//             style={{
//               top: voucher.logo.top,
//               right: voucher.logo.left,
//             }}
//             className={`absolute`}
//           >
//             <QRCode
//               bgColor={voucher.background.color}
//               value={`/view/transactions/${transaction?._id}`}
//               size={80}
//             />
//           </div>
//           <div
//             className={`absolute`}
//             style={{
//               zIndex: 1,
//               opacity: voucher.waterMark.opacity,
//               top: voucher.waterMark.top,
//               left: voucher.waterMark.left,
//             }}
//           >
//             {/* eslint-disable-next-line @next/next/no-img-element */}
//             <img
//               src={ImageUrlConfig(
//                 voucher.waterMark.path,
//                 `w_${voucher.waterMark.width}`,
//               )}
//               alt="watermark"
//             />
//           </div>
//           <h1
//             style={{ fontSize: voucher.org_name.fontSize }}
//             className={` font-bold text-center`}
//           >
//             {organization?.organization_name}
//           </h1>
//           <Box sx={{ maxWidth: "40%", mx: "auto" }}>
//             <p style={{ textAlign: "center" }}>{voucher.slogan ?? "--"}</p>
//           </Box>
//           <p className="text-center ">
//             {organization?.organization_address ?? "--"}
//           </p>
//           <p className="text-center ">{config.labels.contact_details ?? ""}</p>

//           <div className="flex justify-center text-xl  my-2">
//             <p className="text-center bg-black/10 p-2 font-bold italic ">
//               Debit Voucher
//             </p>
//           </div>
//           <div className="space-y-[0.3cm] text-[15px]">
//             <div className="flex justify-between pr-3 ">
//               <p>
//                 Voucher NO{" "}
//                 <strong className="m">: {transaction?.voucher_no}</strong>
//               </p>
//               <p>
//                 Date <strong>: {transaction?.date_formatted}</strong>{" "}
//               </p>
//             </div>
//             <div className="flex justify-between items-center">
//               <div className="flex items-center  w-full">
//                 <p className="text-nowrap"> Name</p>
//                 <div className="w-full border-dotted border-b-2 mx-2 border-b-black/50">
//                   <strong className="whitespace-pre">: </strong>
//                 </div>
//               </div>
//               <div className="flex items-center  w-full">
//                 <p className="text-nowrap"> Head Of A/C </p>
//                 <div className="w-full border-dotted border-b-2 mx-2 border-b-black/50">
//                   <strong>:</strong>
//                   <strong className="whitespace-pre pl-5">
//                     {transaction?.destination.account_name}
//                   </strong>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center ">
//               <p className="text-nowrap"> Source Of Amount</p>
//               <div className="w-full border-dotted border-b-2 mx-2 border-b-black/50">
//                 <strong>:</strong>
//                 <strong className="whitespace-pre pl-5">
//                   {transaction?.source.account_name}
//                 </strong>
//               </div>
//             </div>
//             <div className="flex items-center ">
//               <p className="text-nowrap">Descriptions</p>
//               <div className="w-full border-dotted border-b-2 mx-2 border-b-black/50">
//                 <strong>:</strong>
//                 <strong className="whitespace-pre pl-5">
//                   {transaction?.description}
//                 </strong>
//               </div>
//             </div>
//             <div className="flex items-center ">
//               <p className="text-nowrap"> The sum of taka </p>
//               <div className="w-full border-dotted border-b-2 mx-2 border-b-black/50">
//                 <strong>:</strong>
//                 <strong className="whitespace-pre pl-5">
//                   {toWords(transaction?.amount ?? 0)}
//                 </strong>
//               </div>
//             </div>

//             <div className="flex items-center  w-full justify-between pt-3">
//               <div className="p-2  border-2 w-1/4 border-black">
//                 <p className="text-lg">
//                   TK: <strong>{transaction?.amount_formatted}</strong>{" "}
//                 </p>
//               </div>
//             </div>

//             <div className="flex w-full justify-between pt-20">
//               <div className="p-2   border-t-[1px] mx-2 border-t-black/50">
//                 <p>Received By</p>
//               </div>
//               <div className="p-2  border-t-[1px] mx-2 border-t-black/50">
//                 <p>Accountant</p>
//               </div>
//               <div className="p-2  border-t-[1px] mx-2 border-t-black/50">
//                 <p>Authorized Sign</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </SimpleBar>
//     </div>
//   );
// }

// export default VoucherView;
