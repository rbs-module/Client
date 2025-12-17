"use client";

import { useGetTransactionsQuery } from "@/services/transaction";
import { getGridTheme } from "@/theme/ag-grid/grid-theme";
import {
  Box,
  Checkbox,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import React, { useState } from "react";
import { TransactionColDef, TransactionDefaultColDef } from "./colDef";
import ToolBarStyled from "@/components/styled/ToolBar";
import { PaginationBar } from "@/components/pagination/paginationBar";
import { DefaultQueryParamsDTOType } from "@/zod-schemas/default-query-paramsDTO";
import { last30days } from "@/utils/date-ranges";
import ExcelButton from "@/components/buttons/ExcellButton";
import exportFromJSON from "export-from-json";
import DateRangeSelector from "@/components/DateRangeSelector";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import { useMenu } from "@/hooks/useMenu";
import { TRANSACTION_TYPE } from "@/zod-schemas/accounts/transaction-schema";
import { Icons } from "@/components/icons";
type Query = Partial<DefaultQueryParamsDTOType> & {
  label: string;
  type?: string;
};
const TransactionsPage: React.FC = () => {
  const [types, setTypes] = useState<string[]>(
    TRANSACTION_TYPE.map((item) => item.toLowerCase()),
  );
  const [query, setQuery] = useState<Partial<Query>>({
    limit: 100,
    page: 1,
    ...last30days,
  });
  const { anchorEl, handleClose, handleOpen, open } = useMenu();
  const isAllSelected = types?.length === TRANSACTION_TYPE.length;
  const isIndeterminate = types && types?.length > 1 && !isAllSelected;
  const { data, isFetching, refetch } = useGetTransactionsQuery(query);
  const theme = useTheme();

  const handleExport = () => {
    const rows = data?.transactions;
    const pagination = data?.pagination;
    if (!rows || !Boolean(rows.length) || pagination?.totalDocuments == 0) {
      return alert("No Data Found For Export");
    }

    const fileName = `Recent Transactions`;

    if (pagination?.totalPages !== 1) {
      return alert(
        `Total Doc Row = "${pagination?.totalDocuments}", \n But Limit = "${pagination?.limit}", \n For Export increase the "Limit"`,
      );
    }

    const excelData = rows.map((item) => ({
      Date: item.date_formatted,
      No: item.voucher_no,
      Source: item.source.account_name,
      Destination: item.destination.account_name,
      Type: item.type,
      Descriptions: item.description,
      "Customer/Supplier": item?.customer?.name || item?.supplier?.name || "",
      "Created By": item?.createdBy?.name,
      Amount: item.amount_formatted,
      Reference: item.sl_no || "",
    }));

    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data: excelData, fileName, exportType });
  };

  const handleQueryChange = (newQuery: Partial<Query>) => {
    setQuery((prev) => ({ ...prev, ...newQuery }));
  };
  const handleTypeChange = (type: string) => {
    if (type === " ") {
      setTypes([]);
      handleQueryChange({ type: " " }); // no filter when all are selected
      return;
    }
    if (type === "All") {
      const allTypes = TRANSACTION_TYPE.map((item) => item.toLowerCase());
      setTypes(allTypes);
      handleQueryChange({ type: types.join(" ") }); // no filter when all are selected
    } else {
      setTypes((prev) => {
        let newTypes;
        if (prev?.includes(type)) {
          // remove type
          newTypes = prev.filter((t) => t !== type);
        } else {
          // add type
          newTypes = [...(prev || []), type];
        }

        handleQueryChange({
          type: newTypes.length ? newTypes.join(" ") : undefined, // ✅ send array
        });

        return newTypes;
      });
    }
  };

  return (
    <Box
      maxHeight={"calc(100vh - 150px)"}
      minHeight={`calc(100vh - 293px)`}
      height={Number(data?.transactions.length) * 25 + 80}
      mx={2}
    >
      <ToolBarStyled sx={{ my: 1 }}>
        <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>
          Recent Transactions
        </Typography>
        <Stack direction={"row"} spacing={2}>
          <Tooltip title="Type">
            <IconButton
              sx={{ boxShadow: 1, borderRadius: 1 }}
              size="small"
              onClick={handleOpen}
            >
              <Icons.FilterListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export">
            <ExcelButton onClick={handleExport} />
          </Tooltip>
          <Tooltip title="Refresh">
            <RefreshButton loading={isFetching} onClick={refetch} />
          </Tooltip>
          <Tooltip title="Select Date Range">
            <DateRangeSelector
              onChange={handleQueryChange}
              start_date={query.start_date}
              end_date={query.end_date}
              selected={query.label || ""}
            />
          </Tooltip>
        </Stack>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem
            onClick={() => {
              handleTypeChange(isAllSelected ? " " : "All");
            }}
          >
            <ListItemIcon>
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
              />
            </ListItemIcon>
            <ListItemText>
              {isAllSelected ? "Uncheck All" : "Check All"}
            </ListItemText>
          </MenuItem>
          <Divider />
          {TRANSACTION_TYPE.map((item) => (
            <MenuItem key={item} onClick={() => handleTypeChange(item)}>
              <ListItemIcon>
                <Checkbox checked={types?.includes(item) || false} />
              </ListItemIcon>
              <ListItemText>{item.toUpperCase()}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </ToolBarStyled>
      <AgGridReact
        rowData={data?.transactions}
        columnDefs={TransactionColDef}
        headerHeight={30}
        rowHeight={25}
        defaultColDef={TransactionDefaultColDef}
        theme={getGridTheme(theme)}
      />
      <PaginationBar
        onLimitChange={handleQueryChange}
        onPageChange={handleQueryChange}
        pagination={data?.pagination}
      />
    </Box>
  );
};

export default TransactionsPage;
