/// <reference types="react" />

declare module "receivable/listOfPrivateRoutesWrapped" {
  const listOfPrivateRoutes: RouteProps[];
  export default listOfPrivateRoutes;
}

declare module "conversions/listOfPrivateRoutesWrapped" {
  const listOfPrivateRoutes: RouteProps[];
  export default listOfPrivateRoutes;
}

declare module "new_payment/listOfPrivateRoutesWrapped" {
  const listOfPrivateRoutes: RouteProps[];
  export default listOfPrivateRoutes;
}

declare module "payments/listOfPrivateRoutesWrapped" {
  const listOfPrivateRoutes: RouteProps[];
  export default listOfPrivateRoutes;
}

declare module "settings/listOfPrivateRoutesWrapped" {
  const listOfPrivateRoutes: RouteProps[];
  export default listOfPrivateRoutes;
}

declare module "cryptoEcommerce/listOfPrivateRoutesWrapped" {
  const listOfPrivateRoutes: RouteProps[];
  export default listOfPrivateRoutes;
}

declare module "newAccounts/listOfPrivateRoutesWrapped" {
  const listOfPrivateRoutes: RouteProps[];
  export default listOfPrivateRoutes;
}

declare module "new_payment/Payment" {
  const Payment: React.ComponentType<PaymentProps>;
  export default Payment;
}

declare module "payments/Payments" {
  const Payments: React.ComponentType<PaymentProps>;
  export default Payments;
}

declare module "newAccounts/Accounts" {
  const Accounts: React.ComponentType;
  export default Accounts;
}

declare module "payments/PaymentsProvider" {
  const PaymentsProvider: React.ComponentType;
  export default PaymentsProvider;
}

declare module "newAccounts/AccountsProvider" {
  const AccountsProvider: React.ComponentType;
  export default AccountsProvider;
}

declare module "newAccounts/ReceivableList" {
  const ReceivableList: React.ComponentType;
  export default ReceivableList;
}

declare module "newAccounts/ReceivableDetail" {
  const ReceivableDetail: React.ComponentType;
  export default ReceivableDetail;
}

interface PaymentProps {
  onNewBeneficiaryButtonClick?: () => void;
}

declare module "mfe/Example" {
  const Example: React.ComponentType;
  export default Example;
}

interface RouteProps {
  path: string;
  parent?: string;
  title: string;
  isMenuEnabled?: boolean;
  exact?: boolean;
  element: () => JSX.Element;
}
