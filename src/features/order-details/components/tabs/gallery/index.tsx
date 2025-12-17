import { Box, Fab, ImageList, ImageListItem, Skeleton } from "@mui/material";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";
import { useAddGalleryMutation, useGetGalleryQuery } from "@/services/orders";
import FileUploader from "./uploader";
import { Icons } from "@/components/icons";

function Gallery({ orderId }: { orderId: string }) {
  const { data, refetch, isFetching } = useGetGalleryQuery({ id: orderId });
  const [upload] = useAddGalleryMutation();
  const galleryImages = data?.gallery || [];

  const onUpload = async (urls: string[]) => {
    await upload({ formData: { gallery: urls }, orderId });
    refetch();
  };
  return (
    <Box
      sx={{
        overflowY: "scroll",
        width: "100%",
        p: 2,
        position: "relative",
        minHeight: 200,
      }}
    >
      {data?.gallery ? (
        <ImageList variant="masonry" cols={4} gap={20}>
          {galleryImages.map((item, i) => (
            <ImageListItem key={item + i}>
              {/*  eslint-disable-next-line @next/next/no-img-element */}
              <img
                onDoubleClick={() => {
                  window.open(item, "_blank");
                }}
                className="rounded-md shadow-md"
                src={`${ImageUrlConfig(item, "w_300")}`}
                alt={"image"}
              />
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <Box flexDirection={"column"}>
          <Skeleton width={200} height={150} />

          <Skeleton width={200} height={150} />
        </Box>
      )}
      <FileUploader onUpload={onUpload} />
      <Fab
        sx={{ position: "absolute", top: 60, right: 10, m: 2 }}
        size="small"
        color="info"
        disabled={isFetching}
        onClick={refetch}
      >
        <Icons.RefreshIcon className={isFetching ? "animate-spin" : ""} />
      </Fab>
    </Box>
  );
}

export default Gallery;
