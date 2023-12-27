import { Spin } from "@payconstruct/design-system";
import { AuthContext } from "@payconstruct/orbital-auth-provider";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { useContext, useEffect, useState } from "react";

const LaunchDarklyContext: React.FC = ({ children }) => {
  const { orgId } = useContext(AuthContext);
  const ldClient = useLDClient();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (orgId)
      ldClient?.identify({ key: orgId }).then(() => setIsInitialized(true));
  }, [orgId, ldClient]);

  if (!isInitialized && orgId) return <Spin />;

  return <>{children}</>;
};

export { LaunchDarklyContext };
