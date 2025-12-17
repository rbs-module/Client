"use client";
import ConfirmationDialog from "@/components/dialog/confirmation";
import { Icons } from "@/components/icons";
import IconButtonStyled from "@/components/styled/IconButton";
import ToolBarStyled from "@/components/styled/ToolBar";
import { useMenu } from "@/hooks/useMenu";
import { useCloneMutation, useDeleteOrderMutation } from "@/services/orders";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";
import {
  Avatar,
  Box,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useOrderDetails from "../hooks/useOrderDetails";

function OrderDetailsNav() {
  const router = useRouter();
  const { order, orderId, isLoading } = useOrderDetails();
  const [deleteOrder] = useDeleteOrderMutation();
  const [cloneOrder] = useCloneMutation();

  const handleConfirmDelete = async () => {
    try {
      await deleteOrder(orderId);
      handleCloseDeleteDialog();
      router.push("/v1/orders");
    } catch (x) {
      console.log(x);
    }
  };
  const handleConfirmClone = async () => {
    try {
      await cloneOrder(orderId);
      handleCloseDeleteDialog();
      router.push(`/v1/orders`);
    } catch (x) {
      console.log(x);
    }
  };
  const {
    open: deleteDialogOpen,
    handleClose: handleCloseDeleteDialog,
    handleOpen: handleOpenDeleteDialog,
  } = useMenu();
  const {
    open: isOpenCloneDialog,
    handleClose: handleCloseCloneDialog,
    handleOpen: handleOpenCloneDialog,
  } = useMenu();
  return (
    <ToolBarStyled sx={{ pr: { xs: 1 } }}>
      <Typography>
        {isLoading ? (
          <Skeleton width={80} />
        ) : (
          `# ${order?.sl_no} ${order?.order_name}`
        )}
      </Typography>
      <Stack direction={"row"} spacing={1}>
        <IconButtonStyled
          disabled={!order}
          onClick={handleOpenDeleteDialog}
          color="error"
          size="xs"
        >
          <Icons.DeleteIcon />
        </IconButtonStyled>
        <IconButtonStyled
          disabled={!order}
          onClick={handleOpenCloneDialog}
          color="info"
          size="xs"
        >
          <Icons.ContentCopyIcon />
        </IconButtonStyled>
        <IconButtonStyled
          LinkComponent={Link}
          href="#"
          disabled={!order}
          // onClick={handleOpenCloneDialog}
          color="warning"
          size="xs"
        >
          <Icons.EditIcon />
        </IconButtonStyled>
        <IconButtonStyled
          color="error"
          size="xs"
          LinkComponent={Link}
          href={"/v1/orders"}
        >
          <Icons.CloseIcon />
        </IconButtonStyled>
      </Stack>
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        content={
          <Stack direction={"row"} spacing={2} sx={{ alignItems: "center" }}>
            <Box>
              <Avatar
                sx={{ width: 80, height: 80, boxShadow: 2 }}
                src={ImageUrlConfig(
                  order?.cover_photo || "",
                  "w_80,h_80,r_max",
                )}
              />
            </Box>

            <Box>
              <Typography color="error" variant="subtitle1">
                Are you sure to delete this order?
              </Typography>
              <Typography>
                <Icons.DeleteSweepIcon /> Move to Trash{" "}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography>
                <strong>
                  # {order?.sl_no} {order?.order_name}
                </strong>
              </Typography>
              <Typography>
                <Icons.PeopleAltIcon /> {order?.customer.name}
              </Typography>
            </Box>
          </Stack>
        }
        title="Confirmation"
      />
      <ConfirmationDialog
        open={isOpenCloneDialog}
        onClose={handleCloseCloneDialog}
        onConfirm={handleConfirmClone}
        content={
          <Stack direction={"row"} spacing={2} sx={{ alignItems: "center" }}>
            <Box>
              <Avatar
                sx={{ width: 80, height: 80, boxShadow: 2 }}
                src={ImageUrlConfig(
                  order?.cover_photo || "",
                  "w_80,h_80,r_max",
                )}
              />
            </Box>

            <Box>
              <Typography color="error" variant="subtitle1">
                Are you sure to Clone this order?
              </Typography>
              <Typography>
                <Icons.ContentCopyIcon /> Make a new Order
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography>
                <strong>
                  # {order?.sl_no} {order?.order_name}
                </strong>
              </Typography>
              <Typography>
                <Icons.PeopleAltIcon /> {order?.customer.name}
              </Typography>
            </Box>
          </Stack>
        }
        title="Confirmation"
      />
    </ToolBarStyled>
  );
}

export default OrderDetailsNav;
