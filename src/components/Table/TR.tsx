import { TableRow, Typography } from "@mui/material";
import { IsTableCellEditable, TRProps } from "./types";
import { TC } from "./TC";
import { Editable } from "./Editable";

const isEditable: IsTableCellEditable = (params) => {
  const isEditable = params.colDef?.isEditable;
  let bool = false;
  if (typeof isEditable == "function") {
    bool = Boolean(isEditable(params));
  }
  if (typeof isEditable == "boolean") {
    bool = Boolean(isEditable);
  }

  return bool;
};

export const TR = <T,>({
  colDef,
  row,
  rowData,
  footer,
  defaultColDef,
  onChangeCellValue,
}: TRProps<T>) => (
  <TableRow>
    {colDef.map((col, i) => (
      <TC
        className={"  " + col.cellClass}
        sx={[
          // { textOverflow: "ellipsis", whiteSpace: "nowrap" },
          defaultColDef?.getViewStyle
            ? {
                ...defaultColDef.getViewStyle({
                  index: i,
                  value: row[col.field] as string,
                  data: row,
                  rowData,
                }),
              }
            : {},

          col.getViewStyle
            ? {
                ...col.getViewStyle({
                  index: i,
                  value: row[col.field] as string,
                  data: row,
                  rowData,
                }),
              }
            : {},
        ]}
        key={String(col.field) + i}
      >
        {col.cellRenderer ? (
          col.cellRenderer({
            value: row[col.field] as string,
            data: row,
            rowData,
            index: i,
          })
        ) : Boolean(
            isEditable({
              colDef: col,
              data: row,
              rowData,
              value: row[col.field] as string,
              index: i,
            }),
          ) ? (
          <Editable
            onChangeCellValue={onChangeCellValue}
            colDef={col}
            index={i}
            value={row[col.field] as string}
            data={row}
          />
        ) : (
          <Typography
            className={col.textClass}
            sx={[
              defaultColDef?.getTextStyle
                ? {
                    fontWeight: footer ? "bold" : undefined,

                    ...defaultColDef?.getTextStyle({
                      index: i,
                      value: row[col.field] as string,
                      data: row,
                      rowData,
                    }),
                  }
                : {},
              col.getTextStyle
                ? {
                    fontWeight: footer ? "bold" : undefined,

                    ...col?.getTextStyle({
                      index: i,
                      value: row[col.field] as string,
                      data: row,
                      rowData,
                    }),
                  }
                : {},
            ]}
          >
            {col.formatter
              ? col.formatter({
                  index: i,
                  value: row[col.field] as string,
                  data: row,
                  rowData,
                })
              : (row[col.field] as string)}
          </Typography>
        )}
      </TC>
    ))}
  </TableRow>
);
