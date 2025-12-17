"use client";
import DateRangeSelector from "@/components/DateRangeSelector";
import RefreshLoading from "@/components/Loading/RefreshLoading";
import { MiniNav } from "@/components/MiniNav";
import { PaginationBarMini } from "@/components/pagination/paginationBarMini";
import useSidebarSelection from "@/hooks/useSidebarSelection";
import { getSideBarGridTheme } from "@/theme/ag-grid/grid-theme";
import {
  Button,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";

import { AgGridReact } from "ag-grid-react";
import { useParams } from "next/navigation";
import { useRef } from "react";

import useChallanStore from "@/store/challan/hooks/useChallanStore";
import { useFindChallanQuery } from "@/store/challan/api";
import { ChallanFormatted } from "@/types/challan";
import { challanColDef, challanDefaultColDef } from "./colDef";
import { Icons } from "@/components/icons";
import { useNamedMenu } from "@/hooks/useMenu";

function ChallansTable() {
  const { query, setQuery } = useChallanStore();
  const { data, isFetching, isLoading, refetch } = useFindChallanQuery(query);

  const activePage = useParams();
  const orderId = activePage.id as string;

  const gridRef = useRef<AgGridReact<ChallanFormatted> | null>(null);
  const { onGridReady, onRowClicked, onRowSelected } = useSidebarSelection({
    rowData: data?.challans || [],
    gridRef,
    id: orderId,
    keyId: "_id",
    getPushLink: ({ _id }) => `/v1/challan/${_id}`,
  });
  const theme = useTheme();
  const { handleTypeMenuClose, handleTypeMenuOpen, TypeOpen, TypeAnchorEl } =
    useNamedMenu({ name: "Type" });

  const handleTypeSelect = (type?: ChallanFormatted["type"]) => {
    setQuery({ type: type });
    handleTypeMenuClose();
  };

  return (
    <>
      <title>RBS | Challan</title>
      <style>{`
      .ag-row-selected { border-left: 4px solid ${theme.palette.primary.main} } 
    `}</style>
      <Menu
        open={TypeOpen}
        anchorEl={TypeAnchorEl}
        onClose={handleTypeMenuClose}
      >
        <MenuItem
          selected={query.type == "Receive"}
          onClick={() => handleTypeSelect("Receive")}
        >
          <ListItemText>Receive</ListItemText>
          <Typography variant="body2" sx={{ color: "text.secondary", ml: 3 }}>
            {query.type == "Receive" ? <Icons.DoneAllIcon /> : " "}
          </Typography>
        </MenuItem>
        <MenuItem
          selected={query.type == "Delivery"}
          onClick={() => handleTypeSelect("Delivery")}
        >
          <ListItemText>Delivery</ListItemText>
          <Typography variant="body2" sx={{ color: "text.secondary", ml: 3 }}>
            {query.type == "Delivery" ? <Icons.DoneAllIcon /> : " "}
          </Typography>
        </MenuItem>
        <MenuItem
          selected={!query.type}
          onClick={() => handleTypeSelect(undefined)}
        >
          <ListItemText>All</ListItemText>
          <Typography variant="body2" sx={{ color: "text.secondary", ml: 3 }}>
            {!query.type ? <Icons.DoneAllIcon /> : " "}
          </Typography>
        </MenuItem>
      </Menu>
      <MiniNav
        searchAble={true}
        isRefreshing={isFetching || isLoading}
        title="Challan"
        handleSearch={(text) => {
          setQuery({ search: text });
        }}
        createLink="/v1/challan/create"
        searchValue={query.search}
        handleRefresh={refetch}
        extendItem={
          <>
            <Button
              size="small"
              onClick={handleTypeMenuOpen}
              endIcon={<Icons.ExpandMoreIcon />}
            >
              {query.type ? query.type : "All"}
            </Button>

            <DateRangeSelector
              showLabel={false}
              onChange={setQuery}
              selected={query?.label || ""}
              start_date={query.start_date}
              end_date={query.end_date}
            />
          </>
        }
      />

      <RefreshLoading isLoading={isLoading || isFetching} />
      <AgGridReact
        theme={getSideBarGridTheme(theme)}
        ref={gridRef}
        rowData={data?.challans || []}
        columnDefs={challanColDef}
        onGridReady={onGridReady}
        onRowClicked={onRowClicked}
        onRowSelected={onRowSelected}
        defaultColDef={challanDefaultColDef}
        rowHeight={60}
        rowSelection={{
          mode: "singleRow",
          checkboxes: false,
        }}
      />
      <PaginationBarMini
        pagination={data?.pagination}
        onPageChange={setQuery}
      />
    </>
  );
}

export default ChallansTable;
