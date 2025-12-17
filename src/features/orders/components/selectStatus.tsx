import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
} from "@mui/material";
import React from "react";

import { useMenu } from "@/hooks/useMenu";

import { orderStatusEnum } from "@/constant/order";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setOrdersQuery } from "@/store/orders";
import { Icons } from "@/components/icons";
import { useLocalStorage } from "react-use";

function SelectStatus() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_localStatus, setLocalStatus] = useLocalStorage<string>(
    "x-status",
    "",
  );

  const dispatch = useAppDispatch();
  const { open, handleClose, handleOpen, anchorEl } = useMenu();
  const ordersQuery = useAppSelector((state) => state.orders.query);
  const status = ordersQuery.status?.split(" ") || [];

  const handleClickStatus = (item: string) => {
    const updatedStatus = status.includes(item)
      ? status.filter((s) => s !== item) // Remove the item
      : [...status, item]; // Add the item

    dispatch(
      setOrdersQuery({
        ...ordersQuery,
        status: updatedStatus.join(" "), // Join with space
      }),
    );
  };

  const handleSelectAll = () => {
    const newStatus =
      status.length === orderStatusEnum.length ? "" : orderStatusEnum.join(" ");
    dispatch(
      setOrdersQuery({
        ...ordersQuery,
        status: newStatus,
      }),
    );
  };

  const handleSave = () => {
    handleClose();
    setLocalStatus(ordersQuery.status);
  };

  const remove = ["Invoiced", "Develop", "Cancelled"];

  const fixedStatus = orderStatusEnum
    .map((status) => {
      if (remove.includes(status)) {
        return null;
      }
      return status;
    })
    .join(" ");

  const handleReset = () => {
    setLocalStatus("");
    dispatch(
      setOrdersQuery({
        ...ordersQuery,
        status: fixedStatus,
      }),
    );

    setTimeout(() => {
      setLocalStatus(fixedStatus);
    }, 1500);
    handleClose();
  };
  const isAllSelected = status.length === orderStatusEnum.length;
  const isIndeterminate = status.length > 1 && !isAllSelected;

  return (
    <>
      <IconButton
        sx={{ boxShadow: 1, borderRadius: 1 }}
        size="small"
        onClick={handleOpen}
      >
        <Icons.FilterListIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuList dense>
          <MenuItem onClick={handleSelectAll}>
            <ListItemIcon>
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
              />
            </ListItemIcon>
            <ListItemText>
              {isAllSelected ? "Uncheck All" : "Check All"}
            </ListItemText>
          </MenuItem>
          <Divider />
          <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
            {orderStatusEnum.map((item) => (
              <MenuItem key={item} onClick={() => handleClickStatus(item)}>
                <ListItemIcon>
                  <Checkbox checked={status.includes(item)} />
                </ListItemIcon>
                <ListItemText>{item}</ListItemText>
              </MenuItem>
            ))}
          </Box>
          <Stack direction={"row"} spacing={1}>
            <Button onClick={handleReset} color="error" size="small">
              Reset
            </Button>
            <Button onClick={handleSave} variant="outlined" size="small">
              Save
            </Button>
          </Stack>
        </MenuList>
      </Menu>
    </>
  );
}

export default SelectStatus;
