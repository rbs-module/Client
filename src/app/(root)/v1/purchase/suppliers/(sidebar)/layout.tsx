import SideTableLayout from "@/components/layout/side-table";
import SuppliersTable from "@/features/suppliers";
import { LayoutProps } from "@/types/global";
import React from "react";

function Layout({ children }: LayoutProps) {
  return <SideTableLayout Main={children} Sidebar={<SuppliersTable />} />;
}

export default Layout;
