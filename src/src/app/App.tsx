import { Suspense, lazy, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { hotjar } from "../config/plugins/Hotjar";
import { analytics } from "../config/plugins/Analytics";
import ReduxProvider from "./ReduxWrapper";
import { AuthContextWrapper } from "@payconstruct/orbital-auth-provider";
import { Notification, Spin } from "@payconstruct/design-system";
import {
  clientId,
  audience,
  domain,
  redirectionUrl,
  logoutUrl,
  environment,
  authProviderKey
} from "../config/variables";
import { PermissionsHandler } from "./PermissionHandler";
import { ModalHandler } from "./ModalHandler/ModalHandler";
import CommonAPIHandler from "./CommonAPIHandler/CommonAPIHandler";
import { FeatureFlag } from "./FeatureFlagHandler";
import { Environment } from "@payconstruct/orbital-auth-provider/dist/auth0/AuthState";
import LocalRoutes from "../routes/Routes";
import { LaunchDarklyContext } from "./ContextProviders/LDProvider";
import { MixPanels } from "../config/plugins/MixPanels";

const AccountsProvider = lazy(() => import("newAccounts/AccountsProvider"));

const App: React.FC = () => {
  // App expiry time TST 5 hours and PRD 15 minutes
  const [appExpireTime] = useState(environment === "tst" ? 18000000 : 900000);

  return (
    <HelmetProvider>
      <Helmet>
        <script type="text/javascript">{hotjar}</script>
        {process.env.NODE_ENV === "production" && (
          <script type="text/javascript">{analytics}</script>
        )}
      </Helmet>
      <BrowserRouter>
        <AuthContextWrapper
          environment={environment as Environment}
          logoutUrl={logoutUrl}
          domain={domain}
          clientId={clientId}
          audience={audience}
          redirectUri={redirectionUrl}
          cacheLocation="localstorage"
          useRefreshTokens={true}
          encryptKey={authProviderKey}
          idleTime={appExpireTime}
          onLogout={(logoutType: any) => {
            if (logoutType === "sessionExpired")
              Notification({
                type: "warning",
                message: `Your session has expired!`
              });

            if (logoutType === "userAction")
              Notification({
                type: "success",
                message: `User logged out!`
              });
          }}
        >
          <Suspense fallback={<Spin />}>
            <LaunchDarklyContext>
              <ReduxProvider>
                {process.env.REACT_APP_ENV === "prd" && <MixPanels />}
                {/* //! Need decoupling, but we can't have error bounder inside another. */}
                <AccountsProvider>
                  <FeatureFlag>
                    <PermissionsHandler>
                      <CommonAPIHandler>
                        <ModalHandler>
                          <LocalRoutes />
                        </ModalHandler>
                      </CommonAPIHandler>
                    </PermissionsHandler>
                  </FeatureFlag>
                </AccountsProvider>
              </ReduxProvider>
            </LaunchDarklyContext>
          </Suspense>
        </AuthContextWrapper>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
