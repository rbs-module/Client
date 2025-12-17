import { useState } from "react";
import { EditableProps } from "./types";
import { TextField } from "@mui/material";

export const Editable = <T,>({
  colDef: col,
  data,
  rowData,
  index,
  value,
  onChangeCellValue = () => {},
}: EditableProps<T>) => {
  const { onChangeCellValue: onChangeValue = () => {} } = col;
  const [inputValue, setInputValue] = useState<string | number>(
    String(data?.[col.field]),
  );
  const [editable, setEditable] = useState(false);

  const handleEdit = () => {
    if (value !== inputValue) {
      onChangeCellValue({
        fieldName: String(col.field),
        value:
          typeof value == "number" ? Number(inputValue) : String(inputValue),
        index,
        data,
        rowData,
      });
      onChangeValue({
        fieldName: String(col.field),
        value:
          typeof value == "number" ? Number(inputValue) : String(inputValue),
        index,
        data,
        rowData,
      });
    }
    setEditable(false);
  };
  if (editable) {
    return (
      <TextField
        autoFocus
        sx={{ borderBottom: "black", p: 0 }}
        variant="standard"
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        type={typeof value == "number" ? "number" : "text"}
        onBlur={() => setEditable(false)}
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
    );
  }
  return (
    <div className="text-center" onDoubleClick={() => setEditable(true)}>
      {col.formatter
        ? col.formatter({
            index,
            value: data?.[col.field] as string,
            data: data,
            rowData,
          })
        : (data?.[col.field] as string)}
    </div>
  );
};
