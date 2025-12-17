"use client";
import ToolBarStyled from "@/components/styled/ToolBar";

import React from "react";
import useCustomerDetails from "../hooks/useCustomerDetails";
import LoadingText from "@/components/Loading/LoadingText";
import { Stack } from "@mui/material";
import IconButtonStyled from "@/components/styled/IconButton";
import { Icons } from "@/components/icons";
import Link from "next/link";

function CustomerDetailsNav() {
  const { data } = useCustomerDetails();
  return (
    <ToolBarStyled sx={{ paddingX: { xs: 1, md: 1.5 } }}>
      <LoadingText variant="subtitle2" sx={{ fontWeight: "bold" }}>
        {data?.name}{" "}
      </LoadingText>
      <Stack direction={"row"}>
        <IconButtonStyled
          size="xs"
          color="error"
          LinkComponent={Link}
          href="/v1/sales/customers"
        >
          <Icons.CloseIcon />
        </IconButtonStyled>
      </Stack>
    </ToolBarStyled>
  );
}

export default CustomerDetailsNav;
