export type BillPayment = {
  name: string;
  bill: number;
  payment: number;
  balance: number;
  bill_formatted: string;
  payment_formatted: string;
  balance_formatted: string;
};
export type BillPaymentReport = {
  report: BillPayment[];
  totals: BillPayment;
};
