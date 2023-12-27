import { Icon } from "@payconstruct/design-system";
import { Permissions } from "@payconstruct/fe-utils/dist/Enum/userManagementEnums";

export type MenuItemType = {
  order: number;
  key: string;
  title?: string;
  icon?: React.ReactNode;
  url?: string;
  heading?: string;
  permission?: Permissions;
  showOnKYCPass: boolean;
};
export type MenuItemsType = MenuItemType[];

export const menuItems: MenuItemsType = [
  {
    order: 0,
    key: "account_setup",
    title: "Account Setup",
    icon: <Icon name="account" color="white" size="small" />,
    url: "/account-setup",
    showOnKYCPass: false
  },
  {
    order: 1,
    key: "accounts",
    title: "Accounts",
    icon: <Icon name="account" color="white" size="small" />,
    url: "/accounts",
    showOnKYCPass: true
  },
  {
    order: 2,
    key: "transaction",
    heading: "TRANSACTION",
    showOnKYCPass: true
  },
  {
    order: 4,
    key: "exotic_fx",
    title: "Exotic FX",
    icon: <Icon name="exoticEfx" color="white" size="small" />,
    url: "/orders",
    showOnKYCPass: true,
    permission: Permissions.efxRead
  },
  {
    order: 5,
    key: "new-payment",
    title: "New Payment",
    icon: <Icon name="newPayment" color="white" size="small" />,
    url: "/new-payment",
    showOnKYCPass: true,
    permission: Permissions.paymentsWrite
  }
];

export const cryptoMenuItem: MenuItemType = {
  order: 6,
  key: "crypto_payments",
  title: "eCommerce",
  icon: <Icon name="dollarCircle" color="white" size="small" />,
  url: "/crypto-payments",
  showOnKYCPass: true,
  permission: Permissions.eCommUserRead
};

export const paymentsMenuItem: MenuItemType = {
  order: 3,
  key: "payments",
  title: "Payments",
  icon: <Icon name="newPayment" color="white" size="small" />,
  url: "/payments",
  showOnKYCPass: true,
  permission: Permissions.paymentsRead
};

export const receivablesMenuItem: MenuItemType = {
  order: 3,
  key: "receivables",
  title: "Receivables",
  icon: <Icon name="dollarCircle" color="white" size="small" />,
  url: "/receivables",
  showOnKYCPass: true,
  permission: Permissions.paymentsRead
};

export const conversionsItem: MenuItemType = {
  order: 3,
  key: "conversions",
  title: "Conversions",
  icon: (
    <Icon
      name="convert"
      color="white"
      size="medium"
      customStyle={{ marginLeft: "3px" }}
    />
  ),
  url: "/conversions",
  showOnKYCPass: true,
  permission: Permissions.paymentsRead
};
