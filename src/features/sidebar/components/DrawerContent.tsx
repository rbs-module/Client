import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Zoom,
} from "@mui/material";
import React from "react";

import { MenuItem, navItem } from "../utils/navItem";

import Link from "next/link";
import { useSidebarContext } from "../hooks/useSidebarContext";
import { Icons } from "@/components/icons";
type ItemProps = {
  selected: boolean;
  onClick?: () => void;
  collapse?: boolean;
  child?: boolean;
  properties: MenuItem;
};
export const DrawerContent = () => {
  const {
    collapse,
    handleCollapse,
    handleOpenDrawer,
    handleCloseDrawer,
    isSelected,
    isOpen,
  } = useSidebarContext();

  const Item = ({
    selected,
    onClick,
    collapse = false,
    child = false,
    properties,
  }: ItemProps) => {
    return (
      <Tooltip
        title={!isOpen ? properties.title : ""}
        placement="right"
        arrow
        slots={{
          transition: Zoom,
        }}
      >
        <ListItem
          disablePadding
          sx={{
            ml: child ? 1 : 0,
            borderLeft: selected ? 3 : undefined,
            borderColor: "primary.dark",
          }}
        >
          <ListItemButton
            LinkComponent={!properties.parent ? Link : "div"}
            href={properties.link || "#"}
            selected={selected}
            onClick={onClick}
            className={selected ? "!rounded-l-none" : ""}
          >
            <ListItemIcon sx={{ ml: 0.2 }}>{properties.icon}</ListItemIcon>
            <ListItemText
              primary={properties.title}
              sx={[isOpen ? { opacity: "auto" } : { opacity: 0 }]}
            />
            {properties.parent && isOpen && (
              <Icons.ExpandMoreIcon
                sx={() => ({
                  transition: "transform 0.2s ease-in-out",
                  transform: collapse ? "rotate(180deg)" : "rotate(0deg)",
                })}
              />
            )}
          </ListItemButton>
        </ListItem>
      </Tooltip>
    );
  };

  const handleClickParent = (item: MenuItem) => {
    if (!isOpen && collapse == item.name) {
    } else {
      handleCollapse(item.name);
    }
    handleOpenDrawer();
  };

  return (
    <List>
      {navItem.map((item) => (
        <React.Fragment key={item.name}>
          {item.parent ? (
            <React.Fragment>
              <Item
                onClick={() => {
                  handleClickParent(item);
                }}
                properties={item}
                selected={isSelected(item.name)}
                collapse={collapse == item.name}
              />

              <Collapse
                in={collapse == item.name && isOpen}
                timeout="auto"
                unmountOnExit
              >
                <List>
                  {item.child?.map((child) => (
                    <Item
                      key={child.title}
                      child
                      onClick={handleCloseDrawer}
                      selected={isSelected(child.name)}
                      properties={child as MenuItem}
                    />
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ) : (
            <Item
              key={item.title}
              properties={item}
              selected={isSelected(item.name)}
              collapse={collapse == item.name}
              onClick={handleCloseDrawer}
            />
          )}
        </React.Fragment>
      ))}
    </List>
  );
};
