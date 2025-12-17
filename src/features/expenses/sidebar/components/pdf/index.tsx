import Table from "@/components/pdf/Table";

import {
  View,
  Text,
  Page,
  Font,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

import { Organization } from "@/types/organization";
import { format } from "date-fns";
import { TransactionFormatted } from "@/types/Transaction";
import { expensePdfColDef } from "./ColDef";

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

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    flexDirection: "column",
    paddingVertical: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 800,
    textAlign: "center",
    paddingBottom: "10px",
    fontFamily: "Roboto",
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    right: 30,
    textAlign: "right",
    fontSize: 9,
  },
});

function ExpensePdf({
  rows,
  organization,
  start_date,
  end_date,
}: {
  rows: TransactionFormatted[];
  start_date: string;
  end_date: string;
  organization?: Organization;
}) {
  return (
    <Document>
      {rows && (
        <Page size="A4" style={styles.page} wrap={true}>
          <Text style={[styles.title]}>{organization?.organization_name}</Text>
          <Text style={[{ paddingTop: "0px", textAlign: "center" }]}>
            Production Report
          </Text>
          <Text
            style={[{ paddingTop: "2px", textAlign: "center" }]}
          >{`From ${format(new Date(start_date), "dd-MMM-yyy")} To ${format(new Date(end_date), "dd-MMM-yyy")}`}</Text>
          <View style={{ padding: "40px", paddingTop: "20px" }}>
            {/* table */}
            <Table
              defaultViewStyle={{ paddingHorizontal: 5, paddingVertical: 3 }}
              colDef={expensePdfColDef}
              rowData={rows}
            />
            {/* table */}
          </View>

          {/* Footer with Page Number */}
          <View style={styles.pageNumber} fixed>
            <Text
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
            />
          </View>
        </Page>
      )}
    </Document>
  );
}
export default ExpensePdf;
