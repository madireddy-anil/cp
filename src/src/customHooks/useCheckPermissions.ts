import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "@payconstruct/orbital-auth-provider";
import { Permissions } from "@payconstruct/fe-utils/dist/Enum/userManagementEnums";

const useCheckPermissions = () => {
  const {
    permissions = [],
    userRole = "viewer",
    isAuthenticated,
    orgId
  } = useContext(AuthContext);

  const [isFetching, setIsFetching] = useState(true);

  const hasPermission = useCallback(
    (permission: Permissions) => {
      return permissions.includes(permission);
    },
    [permissions]
  );

  useEffect(() => {
    if (permissions.length > 0 && isAuthenticated && !!orgId) {
      setIsFetching(false);
      return;
    }
    setIsFetching(true);
  }, [permissions, isAuthenticated, orgId]);

  // console.log("permissions", permissions);
  // console.log("isAuthenticated", isAuthenticated);
  // console.log("orgId", orgId);

  return {
    hasPermission,
    userRole: userRole,
    isFetching
  };
};

export { useCheckPermissions };
