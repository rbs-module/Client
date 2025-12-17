"use client";
import React, { useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  styled,
  Box,
} from "@mui/material";
import IconButtonStyled from "../styled/IconButton";
import { Icons } from "../icons";

const StyledDialog = styled(Dialog)(() => ({
  "& .MuiPaper-root": {
    position: "relative",
    animation: "none",
    "&.shake": {
      animation: "shake-native 0.6s ease-in-out 5",
    },
    "@keyframes shake-native": {
      "0%, 100%": { boxShadow: "0 0 0px rgba(0, 0, 0, 0.2)" },
      "10%, 30%, 50%, 70%, 90%": { boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)" },
      "20%, 40%, 60%, 80%": { boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)" },
    },
  },
}));

const ConfirmationDialog = ({
  open = true,
  closable = false,
  title = "Confirmation",
  onClose = () => {},
  onConfirm = () => {},
  content = <>Content</>,
}: {
  open?: boolean;
  title?: string;
  closable?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  content?: React.ReactNode;
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleCloseOutside = () => {
    if (closable) {
      onClose();
      return;
    }
    if (dialogRef.current) {
      dialogRef.current.classList.add("shake");
      setTimeout(() => dialogRef.current?.classList.remove("shake"), 400); // Remove the animation class after it finishes
    }
  };

  return (
    <StyledDialog
      hideBackdrop
      open={open}
      onClose={handleCloseOutside}
      PaperProps={{
        ref: dialogRef, // Attach the ref to the dialog
      }}
    >
      <DialogTitle
        variant="inherit"
        sx={{
          py: 0.5,
          pr: 0.5,
          bgcolor: "background.default",
          justifyContent: "space-between",
          display: "flex",
          alignItems: "center",
        }}
      >
        {title || "Confirmation"}
        <IconButtonStyled
          sx={{ boxShadow: 0 }}
          color="error"
          size="xs"
          onClick={onClose}
        >
          <Icons.CloseIcon />
        </IconButtonStyled>
      </DialogTitle>
      <DialogContent sx={{ padding: 0 }}>
        <Box sx={{ p: 2 }}>{content}</Box>
      </DialogContent>
      <DialogActions sx={{ bgcolor: "background.default" }}>
        <Button variant="outlined" color="error" size="small" onClick={onClose}>
          Cancel
        </Button>

        <Button autoFocus variant="outlined" size="small" onClick={onConfirm}>
          Ok
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default ConfirmationDialog;
