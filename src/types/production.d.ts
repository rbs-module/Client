export type FindProductionsQueryType = {
  end_date?: string;
  start_date?: string;
  page?: number;
  limit?: number;
  sort_key?: string;
  sort_type?: "asc" | "desc";
  label?: string;
};
// export type ProductionDetailsType = z.infer<typeof ProductionSchema>;
// export type ProductionCrateDtoType = z.infer<typeof createProductionDto>;

export type OrderProduction = {
  date: Date;
  shift: string;
  qty: number;
  id: string;
};

export type ProductionType = {
  date: Date;
  shift: ProductionDetailsType["shift"];
  amount: number;
  created_by: {
    id: string;
    name: string;
  };
  organization_id: string;
  _id: string;
  createdAt: string;
};
export type ProductionDetailsType = ProductionType & {
  items: ProductionItemType[];
};

export type ProductionsChartQueryType = {
  end_date?: string;
  start_date?: string;
  group_by?: "day" | "month" | "year";
  label: string;
};

export type ProductionsChartType = {
  dateLabel: string;
  amount: number;
};

interface OrderData {
  rate: number;
  exchange_rate: number;
  unit: string;
  cover_photo: string;
  currency: string;
  sl_no: string;
  order_name: string;
  _id: string;
}

interface ProductionItemType {
  amount: number;
  qty: number;
  order_data: OrderData;
  machine_no: number;
  _id: string;
  remarks: string;
  operator: {
    id: string;
    name: string;
  };
}

interface CreatedBy {
  id: string;
  name: string;
}

export type ProductionPdfDataType = {
  Date: string;
  "Day Shift": number;
  "Night Shift": number;
  Total: number;
};

// export type ProductionCrateDtoType = {
//   date: string;
//   shift: ProductionType["shift"];
//   items: {
//     qty: number;
//     order_data: string;
//     machine_no: number;
//     operator: {
//       id: string;
//       name: string;
//     };
//   }[];
// };
