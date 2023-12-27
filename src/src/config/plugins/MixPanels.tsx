import { useContext, useEffect } from "react";
import { AuthContext } from "@payconstruct/orbital-auth-provider";
import mixpanel from "mixpanel-browser";
import { mixPanelsKey } from "../variables";

const MixPanels = () => {
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    if (userId) mixpanel.identify(userId);
  }, [userId]);

  mixpanel.init(mixPanelsKey, {
    debug: true,
    track_pageview: true,
    persistence: "localStorage"
  });
  return null;
};

export { MixPanels };

// Set this to a unique identifier for the user performing the event.

// Track an event. It can be anything, but in this example, we're tracking a Sign Up event.
// mixpanel.track("Sign Up", {
//   "Signup Type": "Referral"
// });
