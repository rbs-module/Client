// "use client";
// import React from "react";
// import { useMount } from "react-use";

// function OrderInvoice({ id }: { id: string }) {
//   useMount(() => {
//     redirect();
//   });

//   const redirect = () => {
//     const path = window.location.origin;
//     window.open(`${path}/v1/sales/invoices/${id}`, "_blank");
//   };

//   return <div>Redirecting...</div>;
// }

// export default OrderInvoice;

"use client";
import RefreshLoading from "@/components/Loading/RefreshLoading";
import { BASE_URL } from "@/constant/base-url";
import { useAppSelector } from "@/store/hook";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
const Page = ({ id }: { id: string }) => {
  const token = useAppSelector((state) => state.global.access_token);
  const query = useAppSelector((state) => state.productions.query);

  const [src, setSrc] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/v1/orders/invoice-pdf/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setSrc(url);
      } catch (err) {
        console.log({ err });
      } finally {
        setLoading(false);
      }
    };

    fetchPDF();

    // Cleanup Blob URL on unmount
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  if (loading) {
    return <RefreshLoading />;
  }

  return (
    <Box>
      <Box
        sx={{
          height: `calc(100vh - 154px)`,
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        {src ? (
          <iframe
            title="Production"
            src={src}
            className="w-full h-full border-0 rounded-lg"
          />
        ) : (
          <Typography>! Invoice Not Found</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Page;
