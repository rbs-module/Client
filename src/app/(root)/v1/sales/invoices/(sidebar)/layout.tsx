import SideTableLayout from "@/components/layout/side-table";

import InvoiceTable from "@/features/invoices/table";

import type { LayoutProps } from "@/types/global";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "RBS | Invoices",
  description: "Invoices",
};
function layout({ children }: LayoutProps) {
  return <SideTableLayout Sidebar={<InvoiceTable />} Main={children} />;
}

export default layout;
