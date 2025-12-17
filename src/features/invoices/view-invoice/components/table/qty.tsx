import { InvoiceConfig } from "@/constant/invoice-configs/inv-config";
import { InvoiceItemType } from "@/zod-schemas/invoice";
import { BorderedTableCell } from "./cell";

type Props = {
  item: InvoiceItemType;
  config: InvoiceConfig;
};
const QtyCell = ({ item, config }: Props) => {
  if (!config.fields.qty.visible || item.orderId == "Discount") {
    return null;
  }

  return (
    <BorderedTableCell className="qty" sx={{ textAlign: "center" }}>
      {item.qty} {config.fields.qty.suffix}
    </BorderedTableCell>
  );
};
export default QtyCell;
