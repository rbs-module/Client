import { DefaultQueryParamsDTOType } from "@/zod-schemas/default-query-paramsDTO";
import { SearchedCustomer } from "./customer";
import { SearchOrders } from "@/features/search-orders";

interface Customer {
  _id: string;
  name: string;
  email: string;
  address: string;
}

export interface ChallanFormatted {
  _id: string;
  date: Date;
  date_formatted: string;
  organization_id: string;
  challan_no: string;
  type: "Receive" | "Delivery";
  customer: Customer;
  total_qty: number;
}

// details =====================>>
interface OrderData {
  cover_photo: string;
  currency: string;
  exchange_rate: number;
  order_name: string;
  rate: number;
  sl_no: string;
  unit: string;
  _id: string;
}

interface SizeInfo {
  qty: number;
  embroider_reject: number;
  fabric_reject: number;
}
interface ColorInfo {
  [size: string]: SizeInfo; // Key: size (e.g., "xl", "m"), Value: SizeInfo
}

interface Item {
  order_data: OrderData;
  info: Record<string, ColorInfo>; // Key: color (e.g., "Red"), Value: ColorInfo
}

export interface ChallanOutput {
  _id: string;
  challan_no: string;
  customer: Customer;
  date: string;
  date_formatted: string;
  organization_id: string;
  type: string;
  items: Item[];
  created_by: { id: string; name: string };
}
// details =====================<<

export type FindChallanQuery = Partial<
  DefaultQueryParamsDTOType & { type: "Receive" | "Delivery"; label?: string }
>;

// create Body
export type CreateChallanBody = {
  date: string;
  challan_no: number;
  carrier_name: string;
  type: "Receive" | "Delivery";
  customer?: SearchedCustomer;
  items: {
    color: string;
    size: string;
    qty: number;
    embroidery_reject: number;
    fabric_reject: number;

    order_data: SearchOrders;
  }[];
};
