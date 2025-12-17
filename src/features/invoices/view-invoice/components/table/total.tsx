import { InvoiceConfig } from "@/constant/invoice-configs/inv-config";
import { InvoiceItemType } from "@/zod-schemas/invoice";
import { BorderedTableCell } from "./cell";
import { numberWithCommas } from "@/utils/currency-formatter";

type Props = {
  item: InvoiceItemType;
  config: InvoiceConfig;
};
const TotalCell = ({ item, config }: Props) => {
  if (!config.fields.totalUSD.visible) {
    return null;
  }

  return (
    <BorderedTableCell
      sx={{
        textAlign: "right",
      }}
    >
      {numberWithCommas(item.total)}
    </BorderedTableCell>
  );
};
export default TotalCell;
