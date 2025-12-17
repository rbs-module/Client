export type Customer = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  balance: number;
  organization_id: string;
  is_active?: boolean;
};

export type SupplierType = Customer;
export type SearchedCustomer = {
  name: string;
  _id: string;
  balance: number;
};
export type FindCustomersQuery = {
  page?: number;
  limit?: number;
  sort_type?: "desc" | "asc";
  sort_key?: string;
  date_format?: string;
  active?: boolean;
  search?: string;
  search_by?: string;
  start_date?: string;
  end_date?: string;
  email?: string;
  phone?: string;
  address?: string;
};

export type CustomerChart = {
  chart: {
    dateLabel: string;
    debit_amount: number;
    credit_amount: number;
  }[];
  group_by: string;
  date_range: string;
  customer: Customer;
};
export type CustomerChartQueryType = {
  dateLabel: string;
  start_date: string;
  end_date: string;
  group_by: "day" | "month" | "year";
};

export type CustomerTransaction = {
  _id: string;
  type: string;
  date: Date;
  date_formatted: string;
  description?: string;
  running_balance: number;
  running_balance_formatted: string;
  debit: number;
  debit_formatted: string;
  credit: number;
  credit_formatted: string;
};

export type CustomerStatementType = {
  data: {
    customer: Customer;
    openingBalance: number;
    invoiceAmount: number;
    paymentAmount: number;
    settlementAmount: number;
    closingBalance: number;
    start_date: Date;
    end_date: Date;
    transactions: CustomerTransaction[];
  };
  pagination: Pagination;
};
export type CustomerStatementQueryType = {
  page?: number;
  start_date?: string;
  end_date?: string;
  limit?: number;
  label?: string;
  expand?: "yes" | "no";
};
export type CreateCustomerBodyType = {
  name: string;
  email: string;
  phone: string;
  address: string;
  balance: number;
};

type CreateSupplierPaymentBody = {
  source: string;
  supplier: string;
  amount: number;
  description: string;
  date: string;
};

export type SupplierStatementType = {
  data: {
    supplier: Customer;
    openingBalance: number;
    invoiceAmount: number;
    paymentAmount: number;
    settlementAmount: number;
    closingBalance: number;
    start_date: Date;
    end_date: Date;
    transactions: CustomerTransaction[];
  };
  pagination: Pagination;
};
