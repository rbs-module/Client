import { InvoiceConfig } from "@/constant/invoice-configs/inv-config";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";
import { InvoiceItemType } from "@/zod-schemas/invoice";
import Image from "next/image";
import { BorderedTableCell } from "./cell";

type Props = {
  item: InvoiceItemType;
  config: InvoiceConfig;
};
const DesignCell = ({ item, config }: Props) => {
  if (!config.fields.design.visible) {
    return null;
  }

  return (
    <BorderedTableCell sx={{ py: 0.1 }}>
      <Image
        src={ImageUrlConfig(item.cover_photo, "w_70,h_40")}
        width={70}
        height={40}
        alt="Des"
      />
    </BorderedTableCell>
  );
};
export default DesignCell;
