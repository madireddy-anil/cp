import React from "react";
import { lazy } from "react";
import { ServiceNotAvailable } from "../../pages/Error/ServiceNotAvailable";
import { store } from "../../redux/store";
import { flags } from "../../config/variables";
import { useFlags } from "launchdarkly-react-client-sdk";
import * as Sentry from "@sentry/react";

const OldPayment = lazy(() => import("../../pages/Payments/NewPayment"));

const Payment = lazy(() => import("new_payment/Payment"));
const Accounts = lazy(() => import("newAccounts/Accounts"));

const AccountSetup = lazy(() => import("../../pages/Onboarding/Main"));
const CompanyDetails = lazy(
  () => import("../../pages/Onboarding/Company/Company")
);
const Trades = lazy(() => import("../../pages/Trades/Trades"));
const Deposit = lazy(() => import("../../pages/Trades/Deposit/Deposit"));
const TradeStatus = lazy(
  () => import("../../pages/Trades/TradeStatus/TradeStatus")
);
const TradeOffer = lazy(
  () => import("../../pages/Trades/TradeOffer/TradeOffer")
);

const Documents = lazy(
  () => import("../../pages/Onboarding/Documents/Documents")
);
const Pricing = lazy(() => import("../../pages/Pricing/Pricing"));

const PaymentStatus = lazy(
  () => import("../../pages/Payments/components/PaymentStatus/PaymentStatus")
);

// Profile
const Profile = lazy(() => import("../../pages/Profile/Profile"));
const TermsOfService = lazy(
  () => import("../../pages/TermsAndServices/TermAndServices")
);

const ApprovedApplication = lazy(
  () => import("../../pages/ApprovedApplication/ApprovedApplication")
);

const OrbitalLoader = lazy(
  () => import("../../components/OrbitalLoader/OrbitalLoader")
);

const UserManagement = lazy(
  () => import("../../pages/UserManagement/UserManagement")
);

const Approvals = lazy(() => import("../../pages/Approvals/Approvals"));

const PageNotFound = lazy(() => import("../../pages/4xx/404"));

const kycStatus = store.getState().company.kycStatus;
const showAccountActivation = kycStatus && kycStatus === "pass";

const AccountsWrapper: React.FC = () => {
  return (
    <Sentry.ErrorBoundary
      fallback={<ServiceNotAvailable />}
      // onError={ErrorHandler}
      onReset={() => {
        console.log("Reset?");
      }}
    >
      <Accounts />
    </Sentry.ErrorBoundary>
  );
};

const PaymentWrapper: React.FC = () => {
  const LDFlags = useFlags();

  return (
    <Sentry.ErrorBoundary
      fallback={<ServiceNotAvailable />}
      // onError={ErrorHandler}
      onReset={() => {
        console.log("Reset?");
      }}
    >
      {LDFlags[flags.showNewPaymentFlow] ? <Payment /> : <OldPayment />}
    </Sentry.ErrorBoundary>
  );
};

export const routes = [
  {
    path: "*",
    exact: false,
    title: "Not Found",
    isMenuEnabled: false,
    element: () => <PageNotFound />
  },
  {
    path: "/",
    exact: true,
    title: showAccountActivation ? "Account Activation" : "Accounts",
    isMenuEnabled: true,
    element: () =>
      showAccountActivation ? <AccountSetup /> : <AccountsWrapper />
  },
  {
    path: "/account-setup",
    title: "Account Activation",
    exact: true,
    isMenuEnabled: true,
    element: () => <AccountSetup />
  },
  {
    path: "/account-setup/company-details",
    title: "Company Details",
    exact: true,
    isMenuEnabled: false,
    element: () => <CompanyDetails />
  },
  {
    path: "/orders",
    exact: true,
    title: "Exotic FX",
    isMenuEnabled: true,
    element: () => <Trades />
  },
  {
    path: "/order/:id",
    parent: "/orders",
    exact: true,
    title: "Exotic FX Order",
    isMenuEnabled: true,
    element: () => <TradeOffer />
  },
  {
    path: "/order/deposit",
    parent: "/orders",
    exact: true,
    title: "Exotic FX Order",
    isMenuEnabled: false,
    element: () => <Deposit />
  },
  {
    path: "/order/deposit/status",
    parent: "/orders",
    exact: true,
    title: "Exotic FX Order",
    isMenuEnabled: true,
    element: () => <TradeStatus />
  },
  {
    path: "/account-setup/upload-documents",
    title: "Documents and Shareholders",
    exact: true,
    isMenuEnabled: false,
    element: () => <Documents />
  },
  {
    path: "/pricing",
    exact: true,
    title: "Pricing",
    isMenuEnabled: true,
    element: () => <Pricing />
  },
  {
    path: "/new-payment/payment-status",
    exact: true,
    title: "Payment Status",
    isMenuEnabled: true,
    element: () => <PaymentStatus />
  },
  {
    path: "/user/profile",
    exact: true,
    title: "Account Settings",
    isMenuEnabled: true,
    element: () => <Profile />
  },
  {
    path: "/terms-of-service",
    exact: false,
    title: "Terms of Service",
    isMenuEnabled: false,
    element: () => <TermsOfService />
  },
  {
    path: "/approved-application",
    exact: false,
    title: "Approved Application",
    isMenuEnabled: false,
    element: () => <ApprovedApplication />
  },
  {
    path: "/application-loading",
    exact: false,
    title: "Application",
    isMenuEnabled: true,
    element: () => <OrbitalLoader />
  },
  {
    path: "/transactions/approvals",
    exact: true,
    title: "Payment Approvals",
    isMenuEnabled: true,
    element: () => <Approvals />
  },
  {
    path: "/user-management",
    exact: false,
    title: "User Management",
    isMenuEnabled: true,
    element: () => <UserManagement />
  },
  {
    path: "/new-payment",
    exact: true,
    title: "Payment",
    parent: "unknown",
    isMenuEnabled: false,
    element: () => <PaymentWrapper />
  }
] as RouteProps[];
