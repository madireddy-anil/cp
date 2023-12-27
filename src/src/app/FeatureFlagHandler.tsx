import { flags } from "../config/variables";
import { useLocation } from "react-router-dom";
import PageNotFound from "../pages/4xx/404";
import { useFlags } from "launchdarkly-react-client-sdk";
const FeatureFlag: React.FC = ({ children }) => {
  const location = useLocation();
  const LDFlags = useFlags();

  // CRYPTO
  if (
    !LDFlags[flags.showCryptoCommerceUI] &&
    location.pathname === "/crypto-payments"
  )
    return <PageNotFound />;

  // RECEIVABLES
  if (
    !LDFlags[flags.showReceivables] &&
    (location.pathname.includes("/accounts/receivables") ||
      location.pathname.includes("/accounts/receivable"))
  )
    return <PageNotFound />;

  //* PAYMENTS DASHBOARD
  if (
    !LDFlags[flags.showPayments] &&
    location.pathname
      .split("/")
      .includes("payments" || "beneficiary" || "summary")
  )
    return <PageNotFound />;

  //* /conversions
  if (
    !LDFlags[flags.showConversionsUI] &&
    location.pathname === "/new-conversion"
  )
    return <PageNotFound />;

  //* settings ui
  if (!LDFlags[flags.showAPIKeys] && location.pathname.includes("/settings"))
    return <PageNotFound />;

  //! Default to allow access
  return <>{children}</>;
};

export { FeatureFlag };
