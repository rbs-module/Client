"use client";
import { BASE_URL } from "@/constant/base-url";
import { useAppSelector } from "@/store/hook";
import { objToQueryString } from "@/utils/queryString";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
const Page = () => {
  const token = useAppSelector((state) => state.global.access_token);
  const query = useAppSelector((state) => state.productions.query);

  const [src, setSrc] = useState("");

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const queryString = query
          ? objToQueryString({ ...query, sort_type: "asc" })
          : "";
        const res = await fetch(
          `${BASE_URL}/api/v1/productions/report-pdf?${queryString}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

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
  }, [query]);

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
