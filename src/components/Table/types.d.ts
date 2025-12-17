import { BoxProps, TableCellProps, TypographyProps } from "@mui/material";
export type EditableOnChangeArg<T> = {
  fieldName: string;
  value: string | number;
  data?: T;
  rowData?: T[];
  value: string | number;
  index: number;
};

type Params<T> = {
  data?: T;
  rowData?: T[];
  value: string | number;
  index: number;
  colDef?: DataTableColDef<T>;
};

export type DataTableColDef<T> = {
  field: keyof T;
  headerName?: string;
  width?: number | string;
  flex?: number;
  textStyle?: TypographyProps["style"];
  cellClass?: string;
  textClass?: string;
  headerCellClass?: string;
  getViewStyle?: (params: Params<T>) => BoxProps["style"];
  getHeaderStyle?: () => BoxProps["style"];
  getTextStyle?: (params: Params<T>) => TypographyProps["style"];
  cellRenderer?: (params: Params<T>) => React.ReactNode;
  formatter?: (params: Params<T>) => string;
  isEditable?: boolean | ((params: Params<T>) => boolean);
  onChangeCellValue?: (arg: EditableOnChangeArg<T>) => void;
};

type DataTableProps<T> = {
  colDef: DataTableColDef<T>[];
  rowData?: T[];
  defaultTextStyle?: TypographyProps["style"];
  defaultViewStyle?: BoxProps["style"];
  containerStyle?: BoxProps["style"];
  isFooter?: (t: T) => boolean;
  showHeader?: boolean;
  defaultColDef?: Partial<DataTableColDef<T>>;
  defaultHeaderCellClass?: TableCellProps["className"];
  onChangeCellValue?: (arg: EditableOnChangeArg<T>) => void;
};
type TRProps<T> = {
  colDef: DataTableColDef<T>[];
  row: T;
  rowData?: T[];
  footer?: boolean;
  defaultColDef?: Partial<DataTableColDef<T>>;
  onChangeCellValue?: (arg: EditableOnChangeArg<T>) => void;
};

export type EditableProps<T> = {
  colDef: DataTableColDef<T>;
  data?: T;
  rowData?: T[];
  value: string | number;
  index: number;
  onChangeCellValue?: (arg: EditableOnChangeArg<T>) => void;
};

export type IsTableCellEditable = (Params: Params<T>) => boolean;
