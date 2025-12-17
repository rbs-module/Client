import SideTableLayout from "@/components/layout/side-table";

import PriceQuotationTable from "@/features/price-quotation/table";

import type { LayoutProps } from "@/types/global";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "RBS | Price Quotation",
  description: "Price Quotation",
};
function layout({ children }: LayoutProps) {
  return <SideTableLayout Sidebar={<PriceQuotationTable />} Main={children} />;
}

export default layout;
