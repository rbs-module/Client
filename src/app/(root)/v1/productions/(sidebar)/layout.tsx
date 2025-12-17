import SideTableLayout from "@/components/layout/side-table";

import ProductionTable from "@/features/productions/sidebar/components";

import type { LayoutProps } from "@/types/global";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "RBS | Productions",
  description: "Productions",
};
function layout({ children }: LayoutProps) {
  return <SideTableLayout Sidebar={<ProductionTable />} Main={children} />;
}

export default layout;
