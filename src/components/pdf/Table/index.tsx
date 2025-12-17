import { Text, View, ViewProps, TextProps, Font } from "@react-pdf/renderer";
import { PdfTableStyles as styles } from "./styles";

type Params<T> = {
  data?: T;
  rowData?: T[];
  value: string | number;
  index: number;
};

export type TableColDef<T> = {
  field: keyof T;
  headerName?: string;
  width?: number | string;
  flex?: number;
  viewStyle?: ViewProps["style"];
  textStyle?: TextProps["style"];
  getViewStyle?: (params: Params<T>) => ViewProps["style"];
  getTextStyle?: (params: Params<T>) => TextProps["style"];
  cellRenderer?: (params: Params<T>) => React.ReactNode;
  formatter?: (params: Params<T>) => string;
};

type Props<T> = {
  colDef: TableColDef<T>[];
  rowData?: T[];
  defaultTextStyle?: TextProps["style"];
  defaultViewStyle?: ViewProps["style"];
  firstPageRowCount?: number;
  perPageRowCount?: number;
  getRowStyle?: (params: {
    data?: T;
    rowData?: T[];
    index: number;
  }) => ViewProps["style"];
};

const getColStyle = (style: ViewProps["style"]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const styles: any[] = [];
  if (!style) {
    return [];
  }
  if (typeof style == "object") {
    styles.push(style);
  }
  if (Array.isArray(style)) {
    styles.push(...style);
  }
  return styles;
};

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf",
      fontStyle: "italic",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
  ],
});

const shouldBreak = (index = 1, firstPage = 38, perPage = 48) => {
  if (index === firstPage) return true;
  return (index - firstPage) % perPage === 0 && index > firstPage;
};

const Table = <T,>({
  colDef,
  rowData = [],
  defaultTextStyle,
  defaultViewStyle,
  firstPageRowCount = 41,
  perPageRowCount = 49,
  getRowStyle,
}: Props<T>) => {
  return (
    <View style={styles.table}>
      {/* header */}
      <View style={styles.tableRow} wrap={false}>
        {colDef.map((col, i) => (
          <View
            key={(col.field as string) + "-" + i}
            style={[
              styles.tableCol,
              styles.tableHeaderCol,
              styles.headerCell,
              i === 0 ? styles.noLeftBorder : {},
              { width: col.width, flex: col.flex || col.width ? undefined : 1 },
            ]}
          >
            <Text style={[styles.tableCell, { textTransform: "capitalize" }]}>
              {col.headerName || (col.field as string)}
            </Text>
          </View>
        ))}
      </View>
      {/* header */}
      {rowData.map((row, i) => (
        <View
          key={i}
          style={[
            styles.tableRow,
            shouldBreak(i + 1, firstPageRowCount, perPageRowCount)
              ? styles.borderBottom
              : {},
            shouldBreak(i, firstPageRowCount, perPageRowCount)
              ? { marginTop: 20 }
              : {},
            ...getColStyle(
              getRowStyle
                ? getRowStyle({
                    index: i,
                    data: row,
                    rowData,
                  })
                : undefined,
            ),
          ]}
          break={shouldBreak(i, firstPageRowCount, perPageRowCount)}
          wrap={false}
        >
          {colDef.map((col, j) => (
            <View
              key={(col.field as string) + "-" + j}
              style={[
                styles.tableCol,
                j === 0 ? styles.noLeftBorder : {},
                ...getColStyle(col.viewStyle),
                ...getColStyle(
                  col.getViewStyle
                    ? col?.getViewStyle({
                        index: i,
                        data: row,
                        value: row[col.field] as string,
                      })
                    : undefined,
                ),

                {
                  width: col.width,
                  flex: col.flex || col.width ? undefined : 1,
                },

                defaultViewStyle,
              ]}
            >
              {col.cellRenderer ? (
                col.cellRenderer({
                  value: row[col.field] as string,
                  data: row,
                  index: i,
                })
              ) : (
                <Text
                  style={[
                    styles.tableCell,
                    ...getColStyle(col.textStyle),
                    ...getColStyle(
                      col.getTextStyle
                        ? col?.getTextStyle({
                            data: row,
                            value: row[col.field] as string,
                            index: i,
                          })
                        : undefined,
                    ),
                    defaultTextStyle,
                  ]}
                >
                  {col.formatter
                    ? col.formatter({
                        value: row[col.field] as string,
                        data: row,
                        rowData,
                        index: i,
                      })
                    : (row[col.field] as unknown as React.ReactNode)}
                </Text>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default Table;
