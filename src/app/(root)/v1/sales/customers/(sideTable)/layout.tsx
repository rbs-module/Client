import SideTableLayout from "@/components/layout/side-table";
import { CustomersTableMini } from "@/features/customers/table/components/miniTable";

import type { LayoutProps } from "@/types/global";
import React from "react";

function layout({ children }: LayoutProps) {
  return <SideTableLayout Sidebar={<CustomersTableMini />} Main={children} />;
}

export default layout;
