import { use } from "react";
import { SidebarContext, SidebarContextProps } from "../context/sidebarContext";

export const useSidebarContext = (): SidebarContextProps => {
  const context = use(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
