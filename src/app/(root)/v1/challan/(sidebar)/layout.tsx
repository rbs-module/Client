import SideTableLayout from "@/components/layout/side-table";
import ChallanSidebar from "@/features/challan/sidebar";
import { LayoutProps } from "@/types/global";
import React from "react";

function Layout({ children }: LayoutProps) {
  return <SideTableLayout Main={children} Sidebar={<ChallanSidebar />} />;
}

export default Layout;
