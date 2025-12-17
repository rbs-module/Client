import { TableCellProps, TableCell as MuiTableCell } from "@mui/material";
export const BorderedTableCell = (props: TableCellProps) => {
  return (
    <MuiTableCell
      {...props}
      sx={{
        border: "1px solid black",
        width: "14%",
        padding: 1,
        ...props.sx,
      }}
    />
  );
};
