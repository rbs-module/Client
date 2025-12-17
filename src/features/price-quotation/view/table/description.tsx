import EditableCell, { CellEditingEvent } from "@/components/editableCell";
import { InvoiceConfig } from "@/constant/invoice-configs/inv-config";
import { InvoiceItemType } from "@/zod-schemas/invoice";

type Props = {
  item: InvoiceItemType;
  config: InvoiceConfig;
  cellValueChange: (value: CellEditingEvent<InvoiceItemType>) => void;
};

const DescriptionCell = ({ item, config, cellValueChange }: Props) => {
  if (!config.fields.order_name.visible) {
    return null;
  }

  return (
    <EditableCell
      value={item.order_name}
      onChange={cellValueChange}
      fieldName="order_name"
      item={item}
    />
  );
};
export default DescriptionCell;
