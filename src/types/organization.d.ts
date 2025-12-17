export interface Organization {
  _id: string;
  organization_name: string;
  organization_email: string;
  organization_phone: string;
  organization_address: string;
  organization_contact_person: string;
  createdBy: CreatedBy;
  is_active: boolean;
  createdAt: string;
  __v: number;
}

interface CreatedBy {
  id: string;
  name: string;
}

export type OrganizationAccounts = {
  cash_account: string;
  receivable_account: string;
  payable_account: string;
  settlement_account: string;
  sales_account: string;
};
