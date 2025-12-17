import { Icons } from "@/components/icons";
import IconButtonStyled from "@/components/styled/IconButton";
import { orderStatusEnum } from "@/constant/order";
import { useMenu } from "@/hooks/useMenu";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemText,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import OrderStatusChip from "./status-chip";
import { useUpdateOrdersStatusMutation } from "@/services/orders";
import { FormattedOrder } from "@/types/order";

function UpdateOrdersStatus({ orders }: { orders: FormattedOrder[] }) {
  const [updateStatus] = useUpdateOrdersStatusMutation();
  const { handleClose, handleOpen, open } = useMenu();
  const [selected, setSelected] =
    useState<(typeof orderStatusEnum)[number]>("Placed");

  const handleSelect = (value: string) => {
    setSelected(value);
  };
  const handleSubmit = () => {
    const ids = orders.map((item) => item._id);
    updateStatus({ ids, status: selected });
    handleClose();
  };
  return (
    <>
      <IconButtonStyled onClick={handleOpen}>
        <Icons.EditIcon />
      </IconButtonStyled>
      <Dialog open={open}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <List>
            {orderStatusEnum.map((item) => (
              <MenuItem
                onClick={() => {
                  handleSelect(item);
                }}
                selected={selected == item}
                key={item}
              >
                <ListItemText>{<OrderStatusChip value={item} />}</ListItemText>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", ml: 3 }}
                >
                  {selected == item ? <Icons.DoneAllIcon /> : " "}
                </Typography>
              </MenuItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={handleSubmit} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UpdateOrdersStatus;
