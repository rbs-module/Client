import { StyleSheet } from "@react-pdf/renderer";

export const PdfTableStyles = StyleSheet.create({
  table: {
    width: "auto",
    borderStyle: "solid",
    // borderLeft: 0.4,
    borderBottom: 0.4,
    // borderRight: 0.4,
    borderColor: "#000",
    marginBottom: 10,
    // paddingTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderRight: 0.4,
    borderLeft: 0.4,
  },
  borderBottom: {
    borderStyle: "solid",
    borderBottomWidth: 0.4,
  },
  headerCell: {
    fontWeight: "bold",
    fontFamily: "Roboto",
  },
  tableCol: {
    // flex: 1, // Equal column widths
    borderLeftWidth: 0.3,
    borderTopWidth: 0.3,
    borderColor: "#000",
    padding: 5,
  },
  tableHeaderCol: {
    backgroundColor: "#f0f0f0", // Header background color
  },
  tableCell: {
    fontSize: 9,
    textAlign: "center",
    marginVertical: "auto",
    maxHeight: 15,
  },
  noLeftBorder: {
    borderLeftWidth: 0, // Removes left border for the first column
  },
  noTopBorder: {
    borderTopWidth: 0, // Removes top border for the first row
  },
});
