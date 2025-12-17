"use client";
import RefreshLoading from "@/components/Loading/RefreshLoading";
import { MiniNav } from "@/components/MiniNav";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getSideBarGridTheme } from "@/theme/ag-grid/grid-theme";
import { Stack, useTheme } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useRef } from "react";
import useSidebarSelection from "@/hooks/useSidebarSelection";

import { PaginationBarMini } from "@/components/pagination/paginationBarMini";
import { useParams } from "next/navigation";
import DateRangeSelector, {
  DateRangeType,
} from "@/components/DateRangeSelector";
import { useGetProductionsQuery } from "@/services/productions";
import { ProductionType } from "@/types/production";
import { productionColDef } from "./colDef";
import { _arrSum } from "@/utils/arrSum";
import { numberWithCommas } from "@/utils/currency-formatter";
import exportFromJSON from "export-from-json";
import ExcelButton from "@/components/buttons/ExcellButton";
import { format } from "date-fns";
import { df } from "@/zod-schemas/default-query-paramsDTO";
import Link from "next/link";
import IconButtonStyled from "@/components/styled/IconButton";
import { Icons } from "@/components/icons";

function ProductionTable() {
  const query = useAppSelector((state) => state.productions.query);
  const dispatch = useAppDispatch();
  const { data, refetch, isLoading, isFetching } =
    useGetProductionsQuery(query);

  const productions = data?.productions || [];

  const totalRow: ProductionType = {
    _id: "",
    amount: _arrSum(productions, "amount"),
    date: new Date(),
    created_by: {
      id: "",
      name: "",
    },
    createdAt: "",
    organization_id: "",
    shift: numberWithCommas(_arrSum(productions, "amount")),
  };

  const activePage = useParams();
  const orderId = activePage.id as string;

  const gridRef = useRef<AgGridReact<ProductionType> | null>(null);
  const { onGridReady, onRowClicked, onRowSelected } = useSidebarSelection({
    rowData: productions,
    gridRef,
    id: orderId,
    keyId: "_id",
    getPushLink: ({ _id }) => `/v1/productions/${_id}`,
  });
  const theme = useTheme();

  const handleQueryChange = (dateQuery: DateRangeType) => {
    dispatch({
      type: "production/setProductionQuery",
      payload: { ...dateQuery, dateLabel: dateQuery?.label },
    });
  };
  const handlePageChange = ({ page }: { page: number }) => {
    dispatch({
      type: "production/setProductionQuery",
      payload: { page },
    });
  };

  const handleExport = () => {
    const productions = data?.productions;
    const pagination = data?.pagination;
    if (!productions || !Boolean(productions.length)) {
      return alert("No Data Found For Export");
    }

    const fileName = `Productions`;

    if (pagination?.totalPages !== 1) {
      return alert(
        `Total Doc Row = "${pagination?.totalDocuments}", \n But Limit = "${pagination?.limit}", \n For Export increase the "Limit"`,
      );
    }
    // const excelData = productions.map((item) => ({
    //   ...item,
    //   date: format(item.date, df),
    // }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const grouped: any = {};
    productions.forEach((item) => {
      const date = format(item.date, df);
      if (!grouped[date]) grouped[date] = { Day: 0, Night: 0 };

      if (item.shift === "Day Shift") {
        grouped[date].Day = item.amount;
      } else if (item.shift === "Night Shift") {
        grouped[date].Night = item.amount;
      }
    });

    const rows = Object.entries(grouped).map(([date, shifts]) => {
      const typedShifts = shifts as { Day?: number; Night?: number };
      const total = (typedShifts.Day || 0) + (typedShifts.Night || 0);
      return {
        Date: date,
        Day: typedShifts.Day || "",
        Night: typedShifts.Night || "",
        Total: total || "",
      };
    });

    // const excelData = productions.map((item) => item);

    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data: rows, fileName, exportType });
  };

  return (
    <>
      <style>{`
      .ag-row-selected { border-left: 4px solid ${theme.palette.primary.main} } 
    `}</style>

      <MiniNav
        searchAble={false}
        isRefreshing={isFetching || isLoading}
        title="Productions"
        handleSearch={() => {}}
        createLink="/v1/productions/create"
        searchValue={""}
        handleRefresh={() => {
          refetch();
        }}
        extendItem={
          <Stack direction="row" spacing={1}>
            <Link href="/v1/productions/report">
              <IconButtonStyled>
                <Icons.PrintIcon />{" "}
              </IconButtonStyled>{" "}
            </Link>
            {/* {isFetchingReport || !report ? null : (
              <BlobProvider
                document={
                  <ProductionPdf
                    rows={report}
                    organization={organization}
                    start_date={query.start_date?.toString() || ""}
                    end_date={query.end_date?.toString() || ""}
                  />
                }
              >
                {({ url, loading }) => (
                  <Link href={`${url}`} target="_blank">
                    <IconButtonStyled size="xs" disabled={loading}>
                      <Icons.PrintIcon className="w-4 h-4" />
                    </IconButtonStyled>
                  </Link>
                )}
              </BlobProvider>
            )} */}
            <ExcelButton onClick={handleExport} />
            <DateRangeSelector
              showLabel={false}
              onChange={handleQueryChange}
              selected={query.label || "custom"}
              start_date={query.start_date}
              end_date={query.end_date}
            />
          </Stack>
        }
      />

      <RefreshLoading isLoading={isLoading || isFetching} />
      <AgGridReact
        theme={getSideBarGridTheme(theme)}
        ref={gridRef}
        rowData={[...productions, totalRow]}
        columnDefs={productionColDef}
        onGridReady={onGridReady}
        onRowClicked={onRowClicked}
        onRowSelected={onRowSelected}
        rowSelection={{
          mode: "singleRow",
          checkboxes: false,
        }}
      />
      <PaginationBarMini
        pagination={data?.pagination}
        onPageChange={handlePageChange}
      />
    </>
  );
}

export default ProductionTable;
