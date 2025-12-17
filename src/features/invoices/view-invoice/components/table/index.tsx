import { InvoiceFormattedType, InvoiceItemType } from "@/zod-schemas/invoice";
import { Table, TableHead, TableRow, TableBody } from "@mui/material";
import SLCell from "./sl_no";
import DesignCell from "./design";
import TotalUsdCell from "./totalUsd";
import TotalCell from "./total";
import { BorderedTableCell } from "./cell";

import { numberWithCommas } from "@/utils/currency-formatter";
import EditableCell, { CellEditingEvent } from "@/components/editableCell";
import { InvoiceConfig } from "@/constant/invoice-configs/inv-config";

type Props = {
  invoice: InvoiceFormattedType;
  config: InvoiceConfig;
  onCellValueChanged: (value: CellEditingEvent<InvoiceItemType>) => void;
};

const InvoiceTable = ({
  invoice,
  config: invoiceConfig,
  onCellValueChanged,
}: Props) => {
  return (
    <Table>
      <TableHead>
        <TableRow
          sx={(theme) => ({
            bgcolor: theme.palette.grey[200],
          })}
        >
          {invoiceConfig.fields.sl_no.visible && (
            <BorderedTableCell sx={{ fontWeight: "bold" }}>
              {invoiceConfig.fields.sl_no.label}
            </BorderedTableCell>
          )}
          {invoiceConfig.fields.order_name.visible && (
            <BorderedTableCell sx={{ width: "20%", fontWeight: "bold" }}>
              {invoiceConfig.fields.order_name.label}
            </BorderedTableCell>
          )}
          {invoiceConfig.fields.design.visible && (
            <BorderedTableCell sx={{ fontWeight: "bold" }}>
              {invoiceConfig.fields.design.label}
            </BorderedTableCell>
          )}
          {invoiceConfig.fields.qty.visible && (
            <BorderedTableCell sx={{ fontWeight: "bold" }}>
              {invoiceConfig.fields.qty.label}
            </BorderedTableCell>
          )}
          {invoiceConfig.fields.rate.visible && (
            <BorderedTableCell sx={{ fontWeight: "bold" }}>
              {invoiceConfig.fields.rate.label}
            </BorderedTableCell>
          )}
          {invoiceConfig.fields.totalUSD.visible && (
            <BorderedTableCell sx={{ fontWeight: "bold" }}>
              {invoiceConfig.fields.totalUSD.label}
            </BorderedTableCell>
          )}
          {invoiceConfig.fields.total.visible && (
            <BorderedTableCell sx={{ fontWeight: "bold" }}>
              {invoiceConfig.fields.total.label}
            </BorderedTableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {invoice?.item_data.items.map((item, i) => (
          <TableRow key={item._id + i}>
            <SLCell item={item} config={invoiceConfig} />

            {invoiceConfig.fields.order_name.visible && (
              <EditableCell
                value={item.order_name}
                onChange={onCellValueChanged}
                fieldName="order_name"
                item={item}
              />
            )}
            <DesignCell item={item} config={invoiceConfig} />
            {invoiceConfig.fields.qty.visible && (
              <EditableCell
                tableCellProps={{ sx: { textAlign: "center" } }}
                value={item.qty}
                onChange={onCellValueChanged}
                fieldName="qty"
                item={item}
                suffix={invoiceConfig.fields.qty.suffix}
              />
            )}
            {invoiceConfig.fields.rate.visible && (
              <EditableCell
                tableCellProps={{ sx: { textAlign: "right" } }}
                value={item.rate}
                onChange={onCellValueChanged}
                fieldName="rate"
                item={item}
                valueFormatter={() =>
                  `${
                    invoiceConfig.fields.rate.prefix
                      ? invoiceConfig.fields.rate.prefix == "auto"
                        ? item.currency
                        : invoiceConfig.fields.rate.prefix
                      : ""
                  } ${numberWithCommas(item.rate)} ${invoiceConfig.fields.rate.suffix ?? ""}`
                }
              />
            )}

            {/* <RateCell item={item} config={invoiceConfig} /> */}
            <TotalUsdCell item={item} config={invoiceConfig} />
            <TotalCell item={item} config={invoiceConfig} />
          </TableRow>
        ))}
        {invoice.discountPercent ? (
          <TableRow>
            <BorderedTableCell
              align="center"
              colSpan={invoiceConfig.fields.discount.colSpan}
            >
              Discount
            </BorderedTableCell>
            {invoiceConfig.fields.rate.visible && (
              <BorderedTableCell colSpan={2} sx={{ textAlign: "center" }}>
                {invoice.discountPercent} %
              </BorderedTableCell>
            )}

            {invoiceConfig.fields.total.visible && (
              <BorderedTableCell
                sx={{
                  textAlign: "right",
                }}
              >
                {invoice.discountAmount}
              </BorderedTableCell>
            )}
          </TableRow>
        ) : null}

        <TableRow>
          <BorderedTableCell
            align="center"
            colSpan={invoiceConfig.fields.total.colSpan}
          >
            Total
          </BorderedTableCell>
          <BorderedTableCell sx={{ fontWeight: "bold" }}>
            {invoice.item_data.items.reduce((sum, item) => sum + item.qty, 0)}{" "}
            {invoiceConfig.fields.qty.suffix}
          </BorderedTableCell>

          {invoiceConfig.fields.rate.visible && (
            <BorderedTableCell sx={{ textAlign: "center" }}>
              -
            </BorderedTableCell>
          )}
          {invoiceConfig.fields.rate.visible && (
            <BorderedTableCell sx={{ textAlign: "center" }}>
              -
            </BorderedTableCell>
          )}

          {invoiceConfig.fields.total.visible && (
            <BorderedTableCell
              sx={{
                textAlign: "right",

                fontWeight: "bold",
              }}
            >
              {numberWithCommas(invoice.amount)}
            </BorderedTableCell>
          )}
        </TableRow>
      </TableBody>
    </Table>
  );
};
export default InvoiceTable;
