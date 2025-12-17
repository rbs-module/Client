import Table from "@/components/pdf/Table";

import { toWords } from "@/utils/to_words";
import { InvoiceFormattedType } from "@/zod-schemas/invoice";
import {
  View,
  Text,
  Page,
  Font,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { getInvoiceTablePDFColDef } from "./ColDef";
import { numberWithCommas } from "@/utils/currency-formatter";
import { getInvoiceConfig } from "@/constant/invoice";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
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
    // padding: '40px',
  },
  header: {
    position: "absolute",
    top: 20,
    width: "100%",
  },
  subTitle: {
    paddingVertical: "10px",
    fontWeight: "bold",
    fontFamily: "Roboto",
  },
  title: {
    fontSize: 25,
    fontWeight: 800,
    textAlign: "center",
    paddingBottom: "10px",
    fontFamily: "Roboto",
  },
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  tableHeader: {
    backgroundColor: "whitesmoke",
    width: "14.26%",
    fontWeight: "bold",
    fontFamily: "Roboto",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: "auto",
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  fontItalic: {
    // fontWeight: 'bold',
    fontStyle: "italic",
    fontFamily: "Roboto",
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
  },
});

function InvoiceDoc({
  showHeader = true,
  pageData,
}: {
  showHeader: boolean;
  pageData: InvoiceFormattedType;
}) {
  const invoiceConfig = getInvoiceConfig(pageData.organization_id);

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const qrCodeValue = `/view/invoice/${pageData._id}`;

  useEffect(() => {
    QRCode.toDataURL(qrCodeValue)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((dataUrl: any) => {
        setQrCodeDataUrl(dataUrl);
      })
      .catch(() => {
        console.error("err");
      });
  }, [qrCodeValue]);

  return (
    <Document>
      {pageData && (
        <Page size="A4" style={styles.page} wrap={true}>
          <View
            style={{ height: invoiceConfig.labels.padTop ? 120 : undefined }}
          >
            {showHeader && invoiceConfig.labels.padTop ? (
              <>
                {invoiceConfig.labels.padTop ? (
                  <View style={styles.header}>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image
                      src={
                        "https://res.cloudinary.com/dbu76a0wo/image/upload/v1663769776/padTop_yluxqh.png"
                      }
                    />
                  </View>
                ) : (
                  <View>
                    <Text
                      style={[
                        styles.title,
                        { fontSize: 30, padding: 0, marginTop: 10 },
                      ]}
                    >
                      {invoiceConfig.labels.organization_name}
                    </Text>
                    <Text
                      style={[
                        { fontSize: 11, padding: 0, textAlign: "center" },
                      ]}
                    >
                      {invoiceConfig.labels.slogan}
                    </Text>
                    <Text
                      style={[
                        { fontSize: 11, padding: 0, textAlign: "center" },
                      ]}
                    >
                      {invoiceConfig.labels.contact_details}
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#f5f6fa",
                        padding: 5,
                        paddingHorizontal: 10,
                        display: "flex",
                        width: 80,
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: 5,
                        borderRadius: 5,
                      }}
                    >
                      <Text
                        style={[
                          {
                            fontSize: 11,
                            textAlign: "center",
                          },
                        ]}
                      >
                        INVOICE
                      </Text>
                    </View>
                  </View>
                )}
              </>
            ) : (
              <View>
                <View style={{ position: "absolute", top: 10, right: 20 }}>
                  {qrCodeDataUrl && (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <Image
                      style={{ width: 70, height: 70 }}
                      src={qrCodeDataUrl}
                    />
                  )}
                </View>
                <View style={{ position: "absolute", top: 15, left: 20 }}>
                  {qrCodeDataUrl && (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <Image
                      style={{ width: 60, height: 60 }}
                      src={invoiceConfig.labels.logo}
                    />
                  )}
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 30,
                    fontWeight: "bold",
                    fontFamily: "Roboto",
                    marginTop: 10,
                  }}
                >
                  {invoiceConfig.labels.organization_name}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    textAlign: "center",
                  }}
                >
                  {invoiceConfig.labels.slogan}
                </Text>

                <Text
                  style={{
                    fontFamily: "Roboto",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontStyle: "italic",
                    padding: 5,
                    borderBottom: 0.5,
                  }}
                >
                  Invoice
                </Text>
              </View>
            )}
          </View>
          <View style={{ padding: "40px", paddingTop: 10 }}>
            <View style={[styles.row, { justifyContent: "space-between" }]}>
              <View style={{ width: "100%" }}>
                <Text>Bill To.</Text>
                <Text style={styles.subTitle}>{pageData?.customer?.name}</Text>
                <Text style={{ width: "40%" }}>
                  {pageData?.customer?.address}
                </Text>
              </View>
              <View style={{ width: "35%" }}>
                <Text>
                  Invoice Date : {format(pageData?.date, "dd-MMM-yy")}
                </Text>
                <Text style={{ paddingVertical: "5px" }}>
                  Invoice No : {pageData?.invoiceNo}
                </Text>
                <Text>Bill No : {pageData?.customerBillNo}</Text>
              </View>
            </View>

            <Text style={styles.subTitle}>Sub Bill For Embroidery Work</Text>

            {/* table */}
            <Table
              colDef={getInvoiceTablePDFColDef(invoiceConfig)}
              // colDef={invoiceTablePDFColDef}
              rowData={[...pageData.item_data.items]}
            />

            {/* table */}

            {Boolean(pageData.item_data.items[0].currency == "USD") && (
              <Text
                style={{
                  paddingTop: "0px",
                  fontFamily: "Roboto",
                  fontSize: "9px",
                }}
              >
                Note : `$1 = BDT{" "}
                {numberWithCommas(pageData.item_data.items[0].exchange_rate)}`
              </Text>
            )}

            <Text style={{ paddingTop: "10px", fontFamily: "Roboto" }}>
              In Word : {toWords(Number(pageData?.amount || 0))}
            </Text>
            <Text style={{ paddingTop: "5px", fontFamily: "Roboto" }}>
              Remarks: {pageData?.remarks}
            </Text>

            <Text
              style={[
                styles.fontItalic,
                { fontSize: "9px", paddingTop: "35px" },
              ]}
            >
              Early Payment Will Be Appreciated
            </Text>
            <Text
              style={[
                styles.fontItalic,
                { fontSize: "9px", paddingTop: "35px" },
              ]}
            >
              Thanks
            </Text>
            <View
              style={{
                paddingTop: "50px",
                paddingHorizontal: "20px",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>Received By</Text>
              <Text>For: Monapy Embroidery</Text>
            </View>
          </View>
          {showHeader && (
            <Text style={styles.pageNumber} fixed>
              {invoiceConfig.labels.organization_address}
            </Text>
          )}
        </Page>
      )}
    </Document>
  );
}
export default InvoiceDoc;
