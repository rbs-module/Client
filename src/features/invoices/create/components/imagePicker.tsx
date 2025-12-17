import * as React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Image from "next/image";
import { Icons } from "@/components/icons";
import { DialogActions, DialogContent, IconButton } from "@mui/material";
import FileUploader from "@/features/upload-img";
import { Button } from "@mui/material";

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

type Props = {
  value: string;
  onChange: (value: string) => void;
};
export default function ImagePicker({ value, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleUpload = (value: string) => {
    if (!uploading) {
      onChange(value);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <Image
        className="mx-auto relative"
        src={value}
        width={60}
        height={50}
        alt="d"
      />
      <div className="absolute top-0 right-0">
        <IconButton onClick={handleClickOpen} size="small">
          <Icons.EditIcon />
        </IconButton>
      </div>
      <Dialog open={open}>
        <DialogTitle>Set backup account</DialogTitle>
        <DialogContent>
          <FileUploader
            setLoading={setUploading}
            value={value}
            onUpload={handleUpload}
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={uploading} onClick={handleClose} autoFocus>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
