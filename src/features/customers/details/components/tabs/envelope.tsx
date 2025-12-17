import { Box, Container, Typography } from "@mui/material";
import { useRef } from "react";
import { useFetchMyOrganizationQuery } from "@/services/organization";
import useCustomerDetails from "../../hooks/useCustomerDetails";
import { monyReceipt } from "@/constant/mony-receipt";
import Image from "next/image";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";
import { useReactToPrint } from "react-to-print";
import IconButtonStyled from "@/components/styled/IconButton";
import { Icons } from "@/components/icons";

function Envelope() {
  const { data: organization } = useFetchMyOrganizationQuery(null);
  const { data } = useCustomerDetails();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const componentRef = useRef<any>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "envelope",
  });

  return (
    <Container>
      <IconButtonStyled onClick={() => reactToPrintFn()}>
        <Icons.PrintIcon />
      </IconButtonStyled>
      <Box
        height={`calc(100vh - 238px)`}
        sx={{ overflow: "auto", bgcolor: "red" }}
      >
        <Box
          ref={componentRef}
          sx={{
            width: "11cm",
            height: "25cm",
            border: "1px solid",
            mx: "auto",
            p: 5,
            position: "relative",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Image
              src={ImageUrlConfig(
                monyReceipt.logo.path,
                `w_${monyReceipt.logo.width},h_${monyReceipt.logo.height}`,
              )}
              style={{ rotate: "90deg" }}
              width={monyReceipt.logo.width}
              height={monyReceipt.logo.height}
              alt="logo"
            />
          </Box>
          <Box sx={{ rotate: "90deg" }}>
            <h1
              style={{ fontSize: monyReceipt.org_name.fontSize }}
              className={` font-bold text-center`}
            >
              {organization?.organization_name}
            </h1>
            <p className="text-center ">{monyReceipt.slogan ?? "--"}</p>
            <p className="text-center ">
              {organization?.organization_address ?? "--"}
            </p>
            <p className="text-center ">{monyReceipt.contact_details ?? ""}</p>
          </Box>

          <Box sx={{ right: 40, position: "absolute", bottom: 15 }}>
            <Typography variant="h6">To.</Typography>
            <Typography variant="h6">{data?.name}</Typography>
            <Typography fontSize={15}>{data?.address}</Typography>
          </Box>
        </Box>
      </Box>
      {/* <Box height={`calc(100vh - 238px)`} sx={{ overflow: "auto" }}>
        <Box
          ref={componentRef}
          sx={{
            rotate: "90deg",
            width: "25cm",
            height: "11cm",
            border: "1px solid",
            mx: "auto",
            mt: 2,
            p: 5,
            position: "relative",
          }}
        >
          <Box sx={{ bottom: 15, position: "absolute" }}>
            <Grid2 container spacing={2} alignItems={"center"} display={"flex"}>
              <Grid2>
                <Image
                  src={ImageUrlConfig(
                    monyReceipt.logo.path,
                    `w_${monyReceipt.logo.width},h_${monyReceipt.logo.height}`,
                  )}
                  width={monyReceipt.logo.width}
                  height={monyReceipt.logo.height}
                  alt="logo"
                />
              </Grid2>
              <Grid2>
                <Box>
                  <h1
                    style={{ fontSize: monyReceipt.org_name.fontSize }}
                    className={` font-bold text-center`}
                  >
                    {organization?.organization_name}
                  </h1>
                  <p className="text-center ">{monyReceipt.slogan ?? "--"}</p>
                  <p className="text-center ">
                    {organization?.organization_address ?? "--"}
                  </p>
                  <p className="text-center ">
                    {monyReceipt.contact_details ?? ""}
                  </p>
                </Box>
              </Grid2>
            </Grid2>
          </Box>
          <Box sx={{ right: 40, position: "absolute", bottom: 15 }}>
            <Typography variant="h6">To.</Typography>
            <Typography variant="h6">{data?.name}</Typography>
            <Typography fontSize={15}>{data?.address}</Typography>
          </Box>
        </Box>
      </Box> */}
    </Container>
  );
}

export default Envelope;
