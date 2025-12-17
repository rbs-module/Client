"use client";
import React, { useRef } from "react";
import useProductionDetails from "./useProductionDetails";
import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import ToolBarStyled from "@/components/styled/ToolBar";
import { format } from "date-fns";
import IconButtonStyled from "@/components/styled/IconButton";
import { Icons } from "@/components/icons";
import Link from "next/link";
import LoadingText from "@/components/Loading/LoadingText";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { ProductionItemType } from "@/types/production";
import { getGridTheme } from "@/theme/ag-grid/grid-theme";
import Image from "next/image";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";
import { numberWithCommas } from "@/utils/currency-formatter";
import { useReactToPrint } from "react-to-print";

function ProductionDetails() {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "Production",
    // print: async (printIframe: HTMLIframeElement) => {
    //   // Do whatever you want here, including asynchronous work
    //   await generateAndSavePdf(printIframe);
    // },
  });

  const { production, isFetching, refetch, id } = useProductionDetails();
  const theme = useTheme();
  const colDef: ColDef<ProductionItemType>[] = [
    {
      field: "machine_no",
      headerName: "Machine",
      flex: 0.5,
    },
    {
      field: "order_data.sl_no",
      headerName: "Sl No",
    },
    {
      field: "order_data.order_name",
      headerName: "Order No",
    },
    {
      field: "order_data.cover_photo",
      width: 70,
      headerName: "Design",
      cellRenderer: ({ value }: CustomCellRendererProps<ProductionItemType>) =>
        value ? (
          <Image
            src={ImageUrlConfig(value, "w_70,h_40")}
            width={70}
            height={40}
            alt="Des"
          />
        ) : (
          ""
        ),
    },
    {
      field: "qty",
      headerName: "Qty",
      valueFormatter: ({ value, data }) => `${value} ${data?.order_data.unit}`,
    },
    {
      field: "order_data.rate",
      headerName: "Rate",
      cellClass: "text-right",
      valueFormatter: ({ value, data }) =>
        ` ${data?.order_data.currency} ${numberWithCommas(value)}`,
    },
    {
      field: "amount",
      headerName: "Amount",
      cellClass: "text-right font-bold",
      valueFormatter: ({ value }) => `${numberWithCommas(value)}`,
    },
    {
      field: "remarks",
      headerName: "Remarks",
    },
    {
      field: "operator.name",
      headerName: "Operator",
    },
  ];

  return (
    <Box ref={contentRef}>
      <ToolBarStyled>
        <Stack>
          <LoadingText
            loading={isFetching}
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            {production
              ? format(production?.date || "", "dd-MMM-yyyy")
              : undefined}
          </LoadingText>
          <LoadingText loading={isFetching} sx={{ fontWeight: "bold" }}>
            {production?.shift}
          </LoadingText>
        </Stack>

        <Stack direction={"row"} spacing={1}>
          <IconButtonStyled
            onClick={() => reactToPrintFn()}
            disabled={isFetching}
            size="xs"
          >
            <Icons.PrintIcon />
          </IconButtonStyled>
          <IconButtonStyled onClick={refetch} disabled={isFetching} size="xs">
            <Icons.RefreshIcon className={isFetching ? "animate-spin" : ""} />
          </IconButtonStyled>

          <IconButtonStyled
            disabled={isFetching}
            LinkComponent={Link}
            href={`/v1/productions/${id}/update`}
            size="xs"
            color="error"
          >
            <Icons.EditIcon />
          </IconButtonStyled>
          <IconButtonStyled
            disabled={isFetching}
            LinkComponent={Link}
            href="/v1/productions"
            size="xs"
            color="error"
          >
            <Icons.CloseIcon />
          </IconButtonStyled>
        </Stack>
      </ToolBarStyled>

      <Box
        sx={{
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          height: "calc(100vh - 105px)",
          borderTop: 0,
        }}
      >
        <Box sx={(theme) => ({ p: theme.spacing(2) })}>
          <Typography>Production Amount</Typography>
          <LoadingText
            skeletonProps={{ height: 60 }}
            loading={isFetching}
            color="primary"
            sx={{
              fontSize: 40,
              fontWeight: "bold",
              textShadow: "3px 2px #ff000078",
            }}
          >
            {numberWithCommas(production?.amount)}
          </LoadingText>
          <Divider />
          <Typography sx={{ pt: 2 }}>Details</Typography>
        </Box>
        <AgGridReact
          headerHeight={40}
          theme={getGridTheme(theme, { borderColor: "transparent" })}
          rowData={production?.items}
          columnDefs={colDef}
          defaultColDef={{
            cellClass: "text-center",
            flex: 1,
            resizable: false,
          }}
        />
      </Box>
    </Box>
  );
}

export default ProductionDetails;
