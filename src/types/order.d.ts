import { OrderCurrenciesEnum, OrderUnitEnum } from "@/constant/order";
import { SearchedCustomer } from "./customer";

export type Inventory = {
  receive_qty: number;
  production_qty: number;
  finishing_qty: number;
  rejection_qty: number;
  delivery_qty: number;
};
export type FormattedOrder = {
  _id: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  exchange_rate: number;
  order_name: string;
  sl_no: string;
  qty: number;
  rate: number;
  currency: string;
  unit: string;
  status: string;
  cover_photo: string;
  organization_id: string;
  inventory: Inventory;
  created_at: Date;
  properties?: { key: string; value: string }[];
};
export type OrdersQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sort_type?: "asc" | "desc";
  sort_key?: string;
  search_by?: string;
  status?: string | "All";
};

interface BOMItem {
  item_name: string;
  quantity: number;
  unit: (typeof OrderUnitEnum)[number];
  description?: string;
  cost?: number;
}

export type CreateOrderBody = {
  customer: SearchedCustomer;
  order_name: string;
  qty: number;
  rate: number;
  currency: (typeof OrderCurrenciesEnum)[number];
  unit: (typeof OrderUnitEnum)[number];
  properties?: { [key: string]: string }[];
  description?: string;
  cover_photo: string;
  exchange_rate?: number;
  bom?: BOMItem[];
};

interface GoodsInoutType {
  _id: string; // Order ID
  color: string; // Color variant
  sizes: string[]; // Available sizes for this color
  total_received: number;
  total_embroidery_reject_delivery: number;
  total_embroidery_reject_receive: number;
  total_fabric_reject_receive: number;
  total_fabric_reject_delivery: number;
  total_delivered: number;
  total_remaining: number;
}
