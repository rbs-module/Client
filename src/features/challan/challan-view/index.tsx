"use client";
import ToolBarStyled from "@/components/styled/ToolBar";
import { useGetChallanByIdFormattedQuery } from "@/store/challan/api";
import { useParams } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  styled,
  alpha,
  Stack,
  Tooltip,
} from "@mui/material";
import { ChallanOutput } from "@/types/challan";
import SimpleBar from "simplebar-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import IconButtonStyled from "@/components/styled/IconButton";
import { Icons } from "@/components/icons";
import { useFetchMyOrganizationQuery } from "@/services/organization";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";
import QRCode from "react-qr-code";
import Link from "next/link";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import { getInvoiceConfig } from "@/constant/invoice";

const TableCell = styled(MuiTableCell)(({}) => ({
  padding: 2,
}));

function ChallanView() {
  const { id } = useParams();
  const { data, refetch, isFetching } = useGetChallanByIdFormattedQuery(
    String(id),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const componentRef = useRef<any>(null);

  // const { data: organization } = useFetchMyOrganizationQuery(null);
  const reactToPrintFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "MRC",
  });
  return (
    <Box>
      <ToolBarStyled
        sx={(theme) => ({
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          boxShadow: 1,
          position: "absolute",
          width: "100%",
          backdropFilter: "blur(5px)",
          zIndex: 10,
        })}
      >
        <Box>
          <Typography>{data?.challan_no}</Typography>
          <Typography>{data?.customer.name}</Typography>
        </Box>
        <Stack direction={"row"} spacing={1}>
          <Tooltip title="Update">
            <IconButtonStyled
              size="xs"
              color="warning"
              LinkComponent={Link}
              href={`/v1/challan/${id}/update`}
            >
              <Icons.EditIcon />
            </IconButtonStyled>
          </Tooltip>
          <Tooltip title="Print">
            <IconButtonStyled size="xs" onClick={() => reactToPrintFn()}>
              <Icons.PrintIcon />
            </IconButtonStyled>
          </Tooltip>
          <Tooltip title="Refresh">
            <RefreshButton loading={isFetching} onClick={refetch} />
          </Tooltip>
        </Stack>
      </ToolBarStyled>

      <Box
        component={SimpleBar}
        sx={(theme) => ({
          height: "calc(100vh - 56px)",
          border: 1,
          borderColor: "divider",
          borderRadius: `${theme.shape.borderRadius + "px"} ${theme.shape.borderRadius + "px"} 0 0`,
          overflow: "auto",
        })}
      >
        {/* Body */}
        {data && (
          <Card sx={{ mt: 8, width: "21cm", mx: "auto" }}>
            <Box ref={componentRef}>
              <DeliveryChallan challan={data} />
            </Box>
          </Card>
        )}
        {/* Body */}
      </Box>
    </Box>
  );
}

export default ChallanView;

const DeliveryChallan = ({ challan }: { challan: ChallanOutput }) => {
  const { data: organization } = useFetchMyOrganizationQuery(null);
  const config = getInvoiceConfig(organization?._id || "");
  const challanData = {
    contact_details: "Head office & Factory Tel. +880247670731-2",
    logo: {
      height: 80,
      left: 100,
      path: config.labels.logo,
      top: 35,
      width: 80,
    },
    org_name: {
      color: "#000",
      fontSize: "30px",
    },

    slogan: "Your Perfect Partner in Premium Embroidery Solutions!",
    waterMark: {
      height: 200,
      opacity: 0.02,
      path: config.labels.logo,
      top: "25%",
      left: "39%",
      width: 200,
    },
  };

  let itemTotalQty = 0;
  let itemTotalEmbroiderReject = 0;
  let itemTotalFabricReject = 0;
  return (
    <Box
      sx={{
        width: "21cm",
        height: "29cm",
        margin: "auto",
        p: 2,
        position: "relative",
      }}
    >
      <div
        style={{
          top: challanData.logo.top,
          right: challanData.logo.left,
        }}
        className={`absolute`}
      >
        <QRCode
          bgColor={"transparent"}
          value={`/view/challan/${challan._id}`}
          size={80}
        />
      </div>
      <div
        style={{
          top: challanData.logo.top,
          left: challanData.logo.left,
        }}
        className={`absolute`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ImageUrlConfig(
            challanData.logo.path,
            `h_${challanData.logo.height}`,
          )}
          alt="logo"
        />
      </div>
      <div
        className={`absolute`}
        style={{
          zIndex: 1,
          opacity: challanData.waterMark.opacity,
          top: challanData.waterMark.top,
          // left: challanData.waterMark.left,
          left: 0,
          right: 0,
          width: "21cm",

          justifyItems: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ImageUrlConfig(
            challanData.waterMark.path,
            `h_${challanData.waterMark.height}`,
          )}
          alt="watermark"
        />
      </div>
      <CardContent>
        {/* Header */}
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: challanData.org_name.fontSize,
            color: challanData.org_name.color,
            m: 0,
            p: 0,
          }}
          align="center"
        >
          {organization?.organization_name}
        </Typography>
        <Typography variant="body2" align="center">
          {challanData.slogan}
        </Typography>
        <Typography variant="body2" align="center">
          {organization?.organization_address}
        </Typography>
        <Typography variant="body2" align="center">
          {config.labels.contact_details}
        </Typography>
        <div className="flex justify-center mt-3">
          <p className="text-center bg-black/10 p-2 font-bold italic ">
            {challan.type} Challan
          </p>
        </div>

        {/* Customer Info */}
        <Stack
          direction={"row"}
          sx={{ justifyContent: "space-between", px: 2 }}
        >
          <Box>
            <Typography my={1}>
              Customer Name: <b>{challan.customer.name}</b>
            </Typography>
            <Typography>
              Address: <b>{challan.customer.address}</b>
            </Typography>
          </Box>
          <Box>
            <Typography my={1}>
              Date: <b>{challan.date_formatted}</b>
            </Typography>
            <Typography>
              Challan No: <b>{challan.challan_no}</b>
            </Typography>
          </Box>
        </Stack>

        {/* Order Table */}
        <TableContainer
          component={Paper}
          sx={{
            mt: 2,
            boxShadow: 0,
            border: 1,
            borderColor: "divider",
            // borderBottom: 0,
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha("#eee", 0.5) }}>
                <TableCell sx={{ pl: 1 }}>
                  <b>SL No</b>
                </TableCell>
                <TableCell>
                  <b>Order Name</b>
                </TableCell>
                <TableCell>
                  <b>Color</b>
                </TableCell>
                <TableCell>
                  <b>Size</b>
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  <b>ER</b>
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  <b>FR</b>
                </TableCell>
                <TableCell sx={{ textAlign: "right", pr: 2 }}>
                  <b>Qty</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {challan.items.map((item, index) => {
                return Object.entries(item.info).map(
                  ([color, details], colorIndex) => {
                    return Object.entries(details).map(
                      ([size, sizeDetails], sizeIndex) => {
                        // Accumulate totals
                        itemTotalQty += sizeDetails.qty;
                        itemTotalEmbroiderReject +=
                          sizeDetails.embroider_reject;
                        itemTotalFabricReject += sizeDetails.fabric_reject;

                        return (
                          <TableRow
                            key={`${index}-${color}-${size}-${sizeIndex}`}
                          >
                            {colorIndex === 0 && sizeIndex === 0 && (
                              <TableCell
                                sx={{ pl: 2 }}
                                rowSpan={Object.keys(item.info).reduce(
                                  (sum, key) =>
                                    sum + Object.keys(item.info[key]).length,
                                  0,
                                )}
                              >
                                {index + 1}
                              </TableCell>
                            )}
                            {colorIndex === 0 && sizeIndex === 0 && (
                              <TableCell
                                rowSpan={Object.keys(item.info).reduce(
                                  (sum, key) =>
                                    sum + Object.keys(item.info[key]).length,
                                  0,
                                )}
                              >
                                #{item.order_data.sl_no}{" "}
                                {item.order_data.order_name}
                              </TableCell>
                            )}
                            {sizeIndex === 0 && (
                              <TableCell rowSpan={Object.keys(details).length}>
                                {color}
                              </TableCell>
                            )}
                            <TableCell>{size.toUpperCase()}</TableCell>
                            <TableCell sx={{ textAlign: "right" }}>
                              {sizeDetails.embroider_reject}
                            </TableCell>
                            <TableCell sx={{ textAlign: "right" }}>
                              {sizeDetails.fabric_reject}
                            </TableCell>
                            <TableCell sx={{ textAlign: "right", pr: 2 }}>
                              {sizeDetails.qty}
                            </TableCell>
                          </TableRow>
                        );
                      },
                    );
                  },
                );
              })}
            </TableBody>
            <TableFooter sx={{ bgcolor: alpha("#eee", 0.2) }}>
              <TableRow>
                <TableCell
                  sx={{ fontSize: 13, fontWeight: "bold", border: 0, pl: 2 }}
                  colSpan={4}
                >
                  Total
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: 13,
                    fontWeight: "bold",
                    border: 0,
                    textAlign: "right",
                  }}
                >
                  <strong>{itemTotalEmbroiderReject}</strong>
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: 13,
                    fontWeight: "bold",
                    border: 0,
                    textAlign: "right",
                  }}
                >
                  <strong>{itemTotalFabricReject}</strong>
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: 13,
                    fontWeight: "bold",
                    border: 0,
                    pr: 2,
                    textAlign: "right",
                  }}
                >
                  <strong>{itemTotalQty}</strong>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        {/* Footer */}

        <table className="table w-40 ml-auto mr-3 mt-2">
          <tbody>
            <tr className="">
              <td>Quantity</td>
              <td>:</td>
              <td className="text-right">{itemTotalQty} PCS</td>
            </tr>
            <tr>
              <td>Emb Reject</td>
              <td>:</td>
              <td className="text-right">{itemTotalEmbroiderReject} PCS</td>
            </tr>
            <tr>
              <td>Fab Reject</td>
              <td>:</td>
              <td className="text-right">{itemTotalFabricReject} PCS</td>
            </tr>
            <TableRow sx={{ borderTop: 0.1, borderColor: "divider" }}>
              <td>
                <b>Grand Total</b>
              </td>
              <td>:</td>
              <td className="text-right">
                <b>
                  {itemTotalEmbroiderReject +
                    itemTotalFabricReject +
                    itemTotalQty}{" "}
                  PCS
                </b>
              </td>
            </TableRow>
          </tbody>
        </table>
      </CardContent>
      <Stack
        sx={{
          justifyContent: "space-between",
          position: "absolute",
          bottom: 40,
          width: "95%",
          px: 3,
        }}
        direction={"row"}
      >
        <Typography className="border-t-[1px] px-3">Received By</Typography>
        <Typography className="border-t-[1px] px-3 text-center">
          Prepared By :( {challan.created_by?.name} )
        </Typography>
        <Typography className="border-t-[1px] px-3">
          Authorized Signature
        </Typography>
      </Stack>
    </Box>
  );
};
