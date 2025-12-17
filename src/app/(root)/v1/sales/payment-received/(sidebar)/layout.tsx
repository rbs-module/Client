"use client";
import SideTableLayout from "@/components/layout/side-table";
import PaymentsTable from "@/features/payments/components/paymentsTable";
import { LayoutProps } from "@/types/global";

import React from "react";

function Layout({ children }: LayoutProps) {
  return (
    <>
      <title>RBS | Payments</title>
      <SideTableLayout Sidebar={<PaymentsTable />} Main={children} />
    </>
  );
}

export default Layout;
