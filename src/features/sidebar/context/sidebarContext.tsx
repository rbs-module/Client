import { usePathname } from "next/navigation";
import React, { createContext, useState, ReactNode } from "react";

export interface SidebarContextProps {
  isOpen: boolean;
  collapse: string | undefined;
  handleOpenDrawer: () => void;
  handleCloseDrawer: () => void;
  toggleSidebar: () => void;

  handleCollapse: (name: string) => void;

  isSelected: (name: string) => boolean;
}

export const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined,
);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // const activePage = useParams();
  // const route_name = activePage.routeName;
  const pathName = usePathname();
  // const [selected, setSelected] = React.useState("xu");
  const [collapse, setCollapse] = React.useState<string | undefined>(undefined);

  const handleCollapse = (value: string) => {
    const x = collapse === value ? undefined : value;
    setCollapse(x);
    // setSelected(x as string);
  };
  const isSelected = (text: string) => {
    return pathName.includes(text);

    // let routeNames: string[];
    // if (typeof route_name == "string") {
    //   routeNames = route_name.split("-");
    //   return Boolean(routeNames.includes(text));
    // } else {
    //   return Boolean(selected == text);
    // }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleOpenDrawer = () => {
    setIsOpen(true);
  };
  const handleCloseDrawer = () => {
    setIsOpen(false);
  };

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggleSidebar,
        collapse,
        handleCollapse,
        isSelected,
        handleOpenDrawer,
        handleCloseDrawer,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
