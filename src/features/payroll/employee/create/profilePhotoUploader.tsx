/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { Icons } from "@/components/icons";
import { useUploadFile } from "@/features/upload-img/useUploadFile";
const FileUploader = ({
  onUpload = () => {},
  error = "",
  value = null,
  setLoading = () => {},
}: {
  onUpload: (url: string) => void;
  error?: string;
  value?: string | null | undefined;
  setLoading?: (value: boolean) => void;
}) => {
  const cropperRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const { loading, upload } = useUploadFile();
  const [image, setImage] = useState(value);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  // dialog
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);
  // dialog
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => setImage(reader.result as any);
      reader.readAsDataURL(file);
    }
    handleOpen();
  };
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as any);
    reader.readAsDataURL(droppedFiles[0]);
    handleOpen();
    setIsDragging(false);
  };
  const cropImage = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const file = cropper.getCroppedCanvas().toDataURL();
      setCroppedImage(file);
      uploadToCloudinary(file);
    }
    handleOpen();
  };

  const uploadToCloudinary = async (file: File) => {
    if (!file) {
      alert("Please crop the image before uploading.");
      return;
    }
    const url = await upload(file);
    onUpload(url);
  };

  const handleDragEnter = (event: any) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: any) => {
    event.preventDefault();
    setIsDragging(false);
  };

  return (
    <Box>
      {image && (
        <Dialog open={open}>
          <DialogContent>
            <Cropper
              modal
              src={image}
              style={{ height: 400, width: "100%" }}
              viewMode={1}
              guides={true}
              ref={cropperRef}
              aspectRatio={35 / 45}
              dragMode="move"
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              color="error"
              onClick={() => {
                handleOpen();
                setImage(null);
                setCroppedImage(null);
              }}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button color="success" onClick={cropImage}>
              <span>Upload</span>
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* ============================ */}

      <Box
        sx={({ spacing }) => ({
          p: spacing(1),
          display: "flex",
          justifyContent: "center",
        })}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />

        <Box
          textAlign={"center"}
          onDragEnter={handleDragEnter}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            inset: 0,
            backgroundColor: isDragging
              ? "rgba(0, 0, 255, 0.1)"
              : "transparent",
            borderRadius: 50,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            transition: "background-color 0.3s ease, border 0.3s ease",
          }}
        >
          {image ? (
            <Box sx={{ width: 100, height: 100 }}>
              <Image
                src={croppedImage || image}
                alt="img"
                width={100}
                height={100}
                style={{ borderRadius: "50%" }}
              />
            </Box>
          ) : (
            <Box>
              <Box
                sx={{
                  position: "relative",
                  width: 100,
                  mx: "auto",
                  my: 3,
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    position: "relative",
                  }}
                />

                <IconButton
                  size="small"
                  onClick={() => inputRef.current.click()}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    border: 2,
                    borderColor: "divider",
                    ":hover": { background: "#fff" },
                  }}
                >
                  <Icons.Add />
                </IconButton>
              </Box>

              {error && (
                <Typography className="text-center text-red-600 mt-4">
                  {error}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FileUploader;
