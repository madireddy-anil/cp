import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app/App";
import reportWebVitals from "./reportWebVitals";
import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";
import { launchDarklyKey } from "./config/variables";
import * as Sentry from "@sentry/react";
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes
} from "react-router-dom";

Sentry.init({
  environment: process.env.REACT_APP_ENV ?? "dev",
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.ModuleMetadata(),
    new Sentry.BrowserTracing({
      // See docs for support of different versions of variation of react router
      // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      )
    }),
    new Sentry.Replay()
  ],
  beforeSend: (event) => {
    const eventValues = event?.exception?.values;

    if (eventValues && eventValues?.length > 0) {
      const frames = eventValues[0].stacktrace?.frames || [];
      // Get all team names in the stack frames
      const teams = frames
        .filter((frame) => frame.module_metadata && frame.module_metadata.team)
        .map((frame) => frame.module_metadata.team);
      // If there are teams, add them as extra data to the event
      if (teams.length > 0) {
        event.extra = {
          ...event.extra,
          teams
        };
      }
    }

    return event;
  },
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  tracesSampleRate: 1.0,
  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});

(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: launchDarklyKey,
    reactOptions: {
      useCamelCaseFlagKeys: false
    }
  });

  ReactDOM.render(
    <LDProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </LDProvider>,
    document.getElementById("root")
  );
})();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
