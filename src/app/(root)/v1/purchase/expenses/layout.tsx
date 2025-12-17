import SideTableLayout from "@/components/layout/side-table";
import ExpenseTable from "@/features/expenses/sidebar/components";

import type { LayoutProps } from "@/types/global";

import React from "react";
export const metadata = {
  title: "RBS | Expenses",
  description: "Expenses",
};
function layout({ children }: LayoutProps) {
  return <SideTableLayout Sidebar={<ExpenseTable />} Main={children} />;
}

export default layout;
