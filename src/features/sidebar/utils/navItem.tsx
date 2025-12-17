import { Icons } from "@/components/icons";
export type MenuChild = {
  title: string;
  name: string;
  icon?: React.ReactNode;
  link: string;
};
export interface MenuItem {
  title: string;
  name: string;
  icon?: React.ReactNode;
  child?: MenuChild[];
  link?: string;
  parent: boolean;
}

export const navItem: MenuItem[] = [
  {
    icon: <Icons.HomeIcon />,
    title: "Dashboard",
    name: "dashboard",
    child: undefined,
    parent: false,
    link: "/v1/dashboard",
  },
  {
    icon: <Icons.AllInboxIcon />,
    title: "Orders",
    name: "ord",
    child: undefined,
    parent: false,
    link: "/v1/orders",
  },
  {
    icon: <Icons.InsertChartOutlinedIcon />,
    title: "Productions",
    name: "productions",
    child: undefined,
    parent: false,
    link: "/v1/productions",
  },
  {
    // icon: <BiShoppingBag size={ICON_SIZE} />,
    title: "Sales",
    name: "sales",
    parent: true,
    icon: <Icons.InventoryIcon />,
    child: [
      {
        title: "Customers",
        name: "customers",
        link: "/v1/sales/customers",
        icon: <Icons.PeopleAltIcon />,
      },
      {
        title: "Invoice",
        name: "invoice",
        link: "/v1/sales/invoices",
        icon: <Icons.RequestPageIcon />,
      },
      {
        title: "Payment Received",
        name: "payment-received",
        link: "/v1/sales/payment-received",
        icon: <Icons.PaymentsIcon />,
      },
      {
        title: "Price Quotation",
        name: "price_quotation",
        link: "/v1/sales/price-quotation",
        icon: <Icons.RequestPageIcon />,
      },
    ],
  },
  {
    // icon: <AiOutlineShoppingCart size={ICON_SIZE} />,
    title: "Purchase",
    name: "purchase",
    parent: true,
    icon: <Icons.LocalGroceryStoreIcon />,
    child: [
      {
        title: "Suppliers",
        name: "supplier",
        link: "/v1/purchase/suppliers",
        // icon: <UserGroupIcon className='w-5 h-5' />
      },
      {
        title: "Expenses",
        name: "expenses",
        link: "/v1/purchase/expenses",
        // icon: <BanknotesIcon className='w-5 h-5' />
      },
    ],
  },
  {
    icon: <Icons.ManageAccountsIcon />,
    title: "Accountant",
    name: "accounts",
    parent: true,
    child: [
      {
        title: "Manual Journals",
        name: "manual-journal",
        link: "/v1/accounts/chart-of-accounts/manual-journal",
        // icon: <UserGroupIcon className='w-5 h-5' />
      },
      {
        title: "Chart Of Accounts",
        name: "chart-of-accounts",
        link: "/v1/accounts/chart-of-accounts",
        icon: <Icons.InsightsIcon />,
      },
      {
        title: "Reports",
        name: "reports",
        link: "/v1/accounts/reports",
        icon: <Icons.TaskAltIcon />,
      },
      {
        title: "Recent Transactions",
        name: "transactions",
        link: "/v1/accounts/transactions",
        icon: <Icons.TaskAltIcon />,
      },
    ],
  },
  {
    icon: <Icons.LocalShippingIcon />,
    title: "Challan",
    name: "challan",
    child: undefined,
    parent: false,
    link: "/v1/challan",
  },
  {
    icon: <Icons.PersonIcon />,
    title: "Admin",
    name: "admin",
    parent: true,
    child: [
      {
        title: "Users",
        name: "admin-users",
        link: "/v1/admin/users",
        icon: <Icons.PeopleAltIcon />,
      },
    ],
  },
  {
    icon: <Icons.CalendarMonthIcon />,
    title: "Payroll",
    name: "payroll",
    parent: true,
    child: [
      {
        title: "Employee",
        name: "employee",
        link: "/v1/payroll/employee",
        icon: <Icons.PeopleAltIcon />,
      },
      {
        title: "Payslip",
        name: "payslips",
        link: "/v1/payroll/payslips",
        icon: <Icons.PeopleAltIcon />,
      },
    ],
  },
  {
    icon: <Icons.DesignServices />,
    title: "UI",
    name: "ui",
    parent: true,
    child: [
      {
        title: "Icons",
        name: "ui-icons",
        link: "/v1/ui/ui-icons",
        icon: <Icons.ArchitectureIcon />,
      },
    ],
  },
];
