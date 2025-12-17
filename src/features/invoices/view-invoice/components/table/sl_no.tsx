import { InvoiceConfig } from "@/constant/invoice-configs/inv-config";
import { InvoiceItemType } from "@/zod-schemas/invoice";
import { BorderedTableCell } from "./cell";

type Props = {
  item: InvoiceItemType;
  config: InvoiceConfig;
};
const SLCell = ({ item, config }: Props) => {
  if (!config.fields.sl_no.visible) {
    return null;
  }

  return (
    <BorderedTableCell
      colSpan={item?.order_name ? 1 : item?.orderId == "Total" ? 3 : 4}
    >
      {item.orderId == "Total" || item.orderId == "Discount"
        ? item.orderId
        : "#" + item.sl_no}
    </BorderedTableCell>
  );
};
export default SLCell;
