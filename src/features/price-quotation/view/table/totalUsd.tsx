import { InvoiceConfig } from "@/constant/invoice-configs/inv-config";
import { InvoiceItemType } from "@/zod-schemas/invoice";
import { BorderedTableCell } from "./cell";
import { numberWithCommas } from "@/utils/currency-formatter";

type Props = {
  item: InvoiceItemType;
  config: InvoiceConfig;
};
const TotalUsdCell = ({ item, config }: Props) => {
  if (!config.fields.totalUSD.visible || item.orderId == "Discount") {
    return null;
  }

  if (item.currency !== "USD") {
    return (
      <BorderedTableCell sx={{ textAlign: "center" }}>-</BorderedTableCell>
    );
  }
  return (
    <BorderedTableCell sx={{ textAlign: "right" }}>
      {numberWithCommas(item.total / (item?.exchange_rate || 1))}
    </BorderedTableCell>
  );
};
export default TotalUsdCell;
