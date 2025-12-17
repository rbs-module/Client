import {
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableBody,
  Card,
  TableFooter,
} from "@mui/material";
import { DataTableProps } from "./types";
import { TR } from "./TR";
import { TC } from "./TC";
import { twMerge } from "tailwind-merge";

function DataTable<T>({
  colDef,
  rowData,
  containerStyle,
  isFooter,
  showHeader = true,
  defaultColDef,
  defaultHeaderCellClass,
  onChangeCellValue,
}: DataTableProps<T>) {
  return (
    <TableContainer
      component={Card}
      sx={{
        boxShadow: 0,
        border: 1,
        borderColor: "divider",
        borderBottom: 0,
        ...containerStyle,
      }}
    >
      <Table>
        {showHeader && (
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              {colDef.map((col, i) => (
                <TC
                  sx={[
                    {
                      width:
                        col.width || defaultColDef?.width || colDef.length > 0
                          ? `${100 / colDef.length}%`
                          : "auto",
                    },
                    defaultColDef?.getHeaderStyle
                      ? {
                          ...defaultColDef.getHeaderStyle(),
                        }
                      : {},
                    col?.getHeaderStyle
                      ? {
                          ...col.getHeaderStyle(),
                        }
                      : {},
                    {
                      fontWeight: "bold",
                      fontSize: 13,
                      textTransform: "capitalize",
                    },
                  ]}
                  className={twMerge(
                    "!text-center font-bold truncate",
                    defaultHeaderCellClass,
                    col.headerCellClass,
                  )}
                  key={String(col.field) + i}
                >
                  {col.headerName || String(col.field)}
                </TC>
              ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody style={{ maxHeight: "200px" }}>
          {rowData?.map((row, i) => {
            if (isFooter && isFooter(row)) {
              return null;
            } else {
              return (
                <TR
                  onChangeCellValue={onChangeCellValue}
                  defaultColDef={defaultColDef}
                  colDef={colDef}
                  row={row}
                  rowData={rowData}
                  key={i}
                />
              );
            }
          })}
        </TableBody>

        {isFooter ? (
          <TableFooter sx={{ bgcolor: "background.default" }}>
            {rowData?.map((row, i) => {
              if (!isFooter(row)) {
                return null;
              } else {
                return (
                  <TR
                    defaultColDef={defaultColDef}
                    footer
                    colDef={colDef}
                    row={row}
                    rowData={rowData}
                    key={i}
                  />
                );
              }
            })}
          </TableFooter>
        ) : null}
      </Table>
    </TableContainer>
  );
}

export default DataTable;
