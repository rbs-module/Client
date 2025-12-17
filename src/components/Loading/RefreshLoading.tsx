import React from "react";

import { twMerge } from "tailwind-merge";
import { Icons } from "@/components/icons";

const RefreshLoading = ({
  isLoading = true,
  className,
}: {
  isLoading?: boolean;
  className?: string;
}) => {
  if (isLoading) {
    return (
      <div
        className={twMerge([
          "absolute z-10 top-32 w-full flex justify-center",
          className,
        ])}
      >
        <Icons.RefreshIcon
          sx={{
            width: 50,
            height: 50,
            bgcolor: "background.paper",
            padding: 1,
            boxShadow: 1,
          }}
          className="rounded-full animate-spin"
        />
      </div>
    );
  }
  return null;
};

export default RefreshLoading;
