import { InvoiceConfig } from "@/constant/invoice-configs/inv-config";
import { InvoiceItemType } from "@/zod-schemas/invoice";
import { BorderedTableCell } from "./cell";
import { numberWithCommas } from "@/utils/currency-formatter";

type Props = {
  item: InvoiceItemType;
  config: InvoiceConfig;
};
const RateCell = ({ item, config }: Props) => {
  if (!config.fields.rate.visible) {
    return null;
  }

  return (
    <BorderedTableCell
      sx={{ textAlign: item.orderId == "Discount" ? "center" : "right" }}
      colSpan={item.orderId == "Discount" ? 2 : 1}
    >
      {numberWithCommas(item.rate)} {item.orderId == "Discount" ? "%" : ""}
    </BorderedTableCell>
  );
};
export default RateCell;
