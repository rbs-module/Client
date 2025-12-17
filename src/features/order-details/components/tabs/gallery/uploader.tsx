import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  Divider,
  Fab,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Icons } from "@/components/icons";
import { useUploadFiles } from "./useUpload";

export default function FileUploader({
  onUpload,
}: {
  onUpload: (string: string[]) => void;
}) {
  const [preview, setPreview] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { loading, uploadMultiple } = useUploadFiles();

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    setFiles(fileArray);

    // Generate previews
    const previews = fileArray.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  const handleUpload = async () => {
    handleClose();
    const uploadedUrls = await uploadMultiple(files);
    if (uploadedUrls) {
      onUpload(uploadedUrls);
    }
    setFiles([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Fab
        sx={{ position: "absolute", top: 10, right: 10, m: 2 }}
        onClick={() => setOpen(true)}
        size="small"
        color="success"
        disabled={loading}
      >
        {loading ? (
          <Icons.RefreshIcon className="animate-spin" />
        ) : (
          <Icons.Add />
        )}
      </Fab>
      {loading && <Skeleton width={200} height={150} />}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <Box sx={{ p: 3, m: 3 }}>
          <Typography
            sx={{
              fontSize: 15,
              textAlign: "center",
              fontWeight: "bold",
              my: 2,
            }}
          >
            Upload Images
          </Typography>
          <Stack spacing={2} alignItems="center" sx={{ width: "100%" }}>
            <Box
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
              }}
              onDrop={handleDrop}
              sx={{
                border: "2px dashed",
                borderColor: dragActive ? "primary.main" : "grey.400",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                width: "100%",
                transition: "0.2s",
                backgroundColor: dragActive ? "action.hover" : "transparent",
              }}
            >
              <input
                accept="image/*"
                id="upload-input"
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={handleChange}
              />
              <label htmlFor="upload-input">
                <Button variant="outlined" component="span">
                  Choose Images
                </Button>
              </label>

              <Typography
                variant="body2"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                or drag & drop images here
              </Typography>
            </Box>

            {/* Previews */}
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              justifyContent="center"
              sx={{ width: "100%" }}
            >
              {preview.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt={`preview-${i}`}
                  className="w-20 h-20 object-cover rounded-md shadow"
                />
              ))}
            </Stack>
          </Stack>
        </Box>
        <Divider />

        <DialogActions>
          <Button variant="contained" color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpload}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// import {
//   Box,
//   Button,
//   Dialog,
//   Fab,
//   Icon,
//   ImageList,
//   ImageListItem,
//   Stack,
// } from "@mui/material";
// import { ImageUrlConfig } from "@/utils/imageUrlConfig";
// import { useAddGalleryMutation, useGetGalleryQuery } from "@/services/orders";
// import FileUploader from "./uploader";
// import { Icons } from "@/components/icons";
// import { useState } from "react";

// function Gallery({ orderId }: { orderId: string }) {
//   const [open, setOpen] = useState(false);
//   const { data } = useGetGalleryQuery({ id: orderId });
//   const [upload] = useAddGalleryMutation();
//   const galleryImages = data?.gallery || [];

//   return (
//     <>
//       <Fab onClick={() => setOpen(true)} size="small" color="primary">
//         <Icons.Add />
//       </Fab>
//       <Dialog
//         open={open}
//         onClose={() => setOpen(false)}
//         fullWidth
//         maxWidth="md"
//       >
//         <Box sx={{ overflowY: "scroll", width: "100%", p: 2 }}>
//           <ImageList variant="masonry" cols={4} gap={20}>
//             {galleryImages.map((item, i) => (
//               <ImageListItem key={item + i}>
//                 {/*  eslint-disable-next-line @next/next/no-img-element */}
//                 <img
//                   onDoubleClick={() => {
//                     window.open(item, "_blank");
//                   }}
//                   className="rounded-md shadow-md"
//                   src={`${ImageUrlConfig(item, "w_300")}`}
//                   alt={"image"}
//                 />
//               </ImageListItem>
//             ))}
//             {/* <ImageListItem>
//           <FileUploader
//             onUpload={(url) => {
//               upload({ orderId: orderId, formData: { gallery: [url] } });
//             }}
//           />
//         </ImageListItem> */}
//           </ImageList>
//           <FileUploader onFilesSelect={() => {}} />
//         </Box>
//       </Dialog>
//     </>
//   );
// }

// export default Gallery;
