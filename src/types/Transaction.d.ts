// Define the TRANSACTION_TYPE as a union of string literals
export type TransactionType =
  | "invoice"
  | "payment"
  | "settlement"
  | "purchase"
  | "expense"
  | "custom"
  | "opening-balance"
  | "supplier_payment"
  | "salary_advance";

type Account = {
  _id: string;
  account_name: string;
};

// Define the interface for the createdBy object
interface CreatedBy {
  id: string;
  name: string;
}

// Define the main Transaction interface
export type TransactionFormatted = {
  _id: string;
  date: Date;
  date_formatted: string;
  destination: Account;
  source: Account;
  type: TransactionType;
  amount: number;
  amount_formatted: string;
  description?: string;
  createdBy?: CreatedBy;
  organization_id?: string;
  reference?: string[];
  voucher_no?: string;
  sl_no?: string;
  image?: string;
  customer?: {
    _id: string;
    name: string;
    email: string;
    address: string;
  };
  supplier?: {
    _id: string;
    name: string;
    email: string;
    address: string;
  };
  employee?: {
    _id: string;
    name: string;
    email: string;
  };
  isDeu?: boolean;
};
