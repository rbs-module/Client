/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import { useUploadFile } from "./useUploadFile";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { Icons } from "@/components/icons";
import { z } from "zod";
const FileUploader = ({
  onUpload = () => {},
  error = "",
  value = null,
  setLoading = () => {},
  aspectRatio = undefined,
}: {
  onUpload: (url: string) => void;
  error?: string;
  value?: string | null | undefined;
  setLoading?: (value: boolean) => void;
  aspectRatio?: number;
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

  const URLSchema = z.string().url();

  const handlePasteUrl = (event: any) => {
    try {
      const url = event.target.value;
      URLSchema.parse(url);

      if (url) {
        setImage(url);
        setCroppedImage(url);
        onUpload(url);
      }
    } catch (error) {
      console.error(error);
      alert("Invalid URL");
    }
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
              aspectRatio={aspectRatio}
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

      <Card sx={{ width: 250 }}>
        <Box
          sx={({ spacing }) => ({
            p: spacing(3),
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
              width: 250,
              border: 2,
              borderColor: error ? "error.light" : "divider",
              borderStyle: isDragging ? "dotted" : "dashed",
              inset: 0,
              backgroundColor: isDragging
                ? "rgba(0, 0, 255, 0.1)"
                : "transparent",
              borderRadius: 2,
              padding: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              transition: "background-color 0.3s ease, border 0.3s ease",
            }}
          >
            {image ? (
              <Box>
                <Image
                  src={croppedImage || image}
                  alt="img"
                  width={200}
                  height={180}
                />
                <Box>
                  <IconButton onClick={() => inputRef?.current?.click()}>
                    <Icons.EditIcon />
                  </IconButton>
                  <IconButton
                    sx={(theme) => ({
                      ml: theme.spacing(1),
                      color: theme.palette.error.main,
                    })}
                    onClick={() => {
                      setImage(null);
                      setCroppedImage(null);
                    }}
                  >
                    <Icons.DeleteIcon />
                  </IconButton>
                </Box>
                {loading && (
                  <LinearProgress sx={({ spacing }) => ({ my: spacing(1) })} />
                )}
              </Box>
            ) : (
              <Box>
                <Stack
                  rowGap={1}
                  sx={{ justifyContent: "center", textAlign: "center" }}
                >
                  <svg
                    style={{
                      width: 100,
                      height: 100,
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                    version="1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    enableBackground="new 0 0 48 48"
                  >
                    <path
                      fill="#333"
                      d="M40,41H8c-2.2,0-4-1.8-4-4V11c0-2.2,1.8-4,4-4h32c2.2,0,4,1.8,4,4v26C44,39.2,42.2,41,40,41z"
                    />
                    <circle fill="#fff" cx="35" cy="16" r="3" />
                    <polygon fill="#1B67D7" points="20,16 9,32 31,32" />
                    <polygon fill="#408DFB" points="31,22 23,32 39,32" />
                  </svg>
                  <Box>
                    <Typography>Drag or Drop your Image</Typography>
                    <Typography variant="caption">
                      Maximum file size allowed is 1MB
                    </Typography>
                  </Box>
                  <Button
                    disabled={loading}
                    onClick={() => inputRef?.current?.click()}
                    variant="outlined"
                    color="secondary"
                    sx={() => ({
                      borderBottom: 2,
                      borderRadius: 1,
                    })}
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Icons.AddPhotoAlternateIcon />
                      )
                    }
                  >
                    Choose File
                  </Button>
                  <TextField
                    sx={{ mx: 2, width: "auto", p: 0 }}
                    placeholder="Past URL"
                    onChange={handlePasteUrl}
                  />
                </Stack>

                {error && (
                  <Typography className="text-center text-red-600 mt-4">
                    {error}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default FileUploader;
