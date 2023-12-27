import { useEffect, useState } from "react";
import { AllRoutes } from "./PrivateRoutes/MFERoutes";
import { Route, Routes as DOMRoutes } from "react-router-dom";
import { TopBar } from "../components/TopBar";
import { TokenHandler } from "../app/TokenHandler";
import { ProtectRoute } from "@payconstruct/orbital-auth-provider";
import { PublicRoute } from "./PublicRoutes";
import Menu from "../components/SideMenu/Menu";
import { Spin } from "@payconstruct/design-system";
import Upload from "../pages/Upload/Upload";
import * as Sentry from "@sentry/react";

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(DOMRoutes);
//
const LocalRoutes = () => {
  const [allRoutes, setAllRoutes] = useState<RouteProps[]>();

  useEffect(() => {
    AllRoutes().then((routes) => {
      setAllRoutes(routes);
    });
  }, []);

  return (
    <Spin loading={!allRoutes}>
      {allRoutes && (
        <SentryRoutes>
          {PublicRoute.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <>
                  <route.element />
                </>
              }
            />
          ))}

          <Route path="/" element={<ProtectRoute redirectUrl="/login" />}>
            <Route
              path="/"
              element={
                <TokenHandler>
                  <Menu routes={allRoutes} />
                </TokenHandler>
              }
            >
              {allRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <>
                      <TopBar title={route.title} parentPage={route.parent} />
                      <Upload>
                        <route.element />
                      </Upload>
                    </>
                  }
                />
              ))}
            </Route>
          </Route>
        </SentryRoutes>
      )}
    </Spin>
  );
};

export default LocalRoutes;
