"use client";
import { BASE_URL } from "@/constant/base-url";
import { useAppSelector } from "@/store/hook";
import { Box } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
const Page = () => {
  const { id } = useParams();

  const token = useAppSelector((state) => state.global.access_token);

  const [src, setSrc] = useState("");

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        if (src) {
          return;
        }
        const res = await fetch(`${BASE_URL}/api/v1/payments/pdf/${id}`, {
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
      }
    };

    fetchPDF();

    // Cleanup Blob URL on unmount
    return () => {
      if (src) URL.revokeObjectURL(src);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Box sx={{ height: `calc(100vh - 54px)` }}>
        {src && (
          <iframe
            title="Production"
            src={src}
            className="w-full h-full border-0 rounded-lg"
          />
        )}
      </Box>
    </Box>
  );
};

export default Page;
