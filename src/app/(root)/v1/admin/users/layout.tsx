import SideTableLayout from "@/components/layout/side-table";
import Users from "@/features/users";
import { LayoutProps } from "@/types/global";
import React from "react";

function layout({ children }: LayoutProps) {
  return <SideTableLayout Sidebar={<Users />} Main={children} />;
}

export default layout;
