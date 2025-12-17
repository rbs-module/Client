import { useState } from "react";
import { TextField } from "@mui/material";
import { TableCellProps, TableCell as MuiTableCell } from "@mui/material";
export const BorderedTableCell = (props: TableCellProps) => {
  return (
    <MuiTableCell
      {...props}
      sx={{
        border: 1,
        borderColor: "black",
        width: "14%",
        padding: 1,
        ...props.sx,
      }}
    />
  );
};

export type CellEditingEvent<T> = {
  oldValue: string | number;
  newValue: string | number;
  data: T;
  field: keyof T;
};

type Props<T> = {
  item: T;
  value: string | number;
  onChange: (value: CellEditingEvent<T>) => void;
  fieldName: keyof T;
  suffix?: string;
  prefix?: string;
  tableCellProps?: TableCellProps;
  valueFormatter?: (value: string | number) => string;
};

const EditableCell = <T,>({
  item,
  fieldName,
  value,
  onChange,
  prefix,
  suffix,
  tableCellProps,
  valueFormatter,
}: Props<T>) => {
  const [editable, setEditable] = useState(false);
  const [inputValue, setInputValue] = useState<string | number>("");

  const handleEdit = () => {
    onChange({
      oldValue: value,
      newValue: typeof value == "number" ? Number(inputValue) : inputValue,
      data: item,
      field: fieldName,
    });
    setEditable(false);
  };
  return (
    <BorderedTableCell
      autoFocus
      {...tableCellProps}
      onBlur={handleEdit}
      onDoubleClick={() => {
        if (!editable) {
          setEditable(true);
          setInputValue(value);
        }
      }}
    >
      {!editable ? (
        valueFormatter ? (
          valueFormatter(value)
        ) : (
          `${prefix ?? ""} ${value} ${suffix ?? ""}`
        )
      ) : (
        <TextField
          autoFocus
          sx={{ borderBottom: "black", p: 0 }}
          variant="standard"
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          value={inputValue}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleEdit();
            }
            if (e.key === "Escape") {
              setEditable(false);

              setInputValue(value);
            }
          }}
        />
      )}
    </BorderedTableCell>
  );
};
export default EditableCell;
