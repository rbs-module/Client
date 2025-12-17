"use client";
import { Icons } from "@/components/icons";
import IconButtonStyled from "@/components/styled/IconButton";
import ToolBarStyled from "@/components/styled/ToolBar";
import { Box, Tooltip, Typography } from "@mui/material";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useCopyToClipboard } from "react-use";

function Page() {
  const [state, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    if (state.error) {
      toast.error("Failed to copy!");
    } else if (state.value) {
      toast.success(`Copied "${state.value}" to clipboard!`, {
        position: "top-center",
      });
    }
  }, [state]);

  return (
    <div className="p-8">
      <ToolBarStyled>
        <Typography variant="subtitle2">Icons</Typography>
        <Typography variant="subtitle2">
          Total = {Object.keys(Icons).length}
        </Typography>
      </ToolBarStyled>
      <Box
        sx={{ border: 1, borderColor: "divider", borderTop: 0, boxShadow: 1 }}
        className="flex flex-wrap gap-3 bg-white p-3"
      >
        {Object.keys(Icons)
          .sort()
          .map((key, i) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Icon = (Icons as any)[key];
            return (
              <Box key={key + i}>
                <Tooltip title={key} arrow sx={{ fontSize: 15 }}>
                  <IconButtonStyled
                    onClick={() => copyToClipboard(key)}
                    size="large"
                  >
                    <Icon />
                  </IconButtonStyled>
                </Tooltip>
              </Box>
            );
          })}
      </Box>
    </div>
  );
}

export default Page;
