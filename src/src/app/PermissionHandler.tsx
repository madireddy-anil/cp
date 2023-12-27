import { Spin } from "@payconstruct/design-system";
import { AuthContext } from "@payconstruct/orbital-auth-provider";
import { useContext, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Hooks } from "@payconstruct/fe-utils";
import {
  Permissions,
  UserRoles
} from "@payconstruct/fe-utils/dist/Enum/userManagementEnums";
import { ApprovalsContext } from "../pages/Approvals/ApprovalsContext/ApprovalsProvider";

const { useCheckPermissions } = Hooks;

const PermissionsHandler: React.FC = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const { isUserApprover } = useContext(ApprovalsContext);

  const { hasPermission, userRole, isFetching } = useCheckPermissions();
  const location = useLocation();

  const [pathUrls] = useState([
    { url: "/new-payment", permission: Permissions.paymentsWrite },
    { url: "/new-conversion", permission: Permissions.paymentsWrite },
    { url: "/order/deposit", permission: Permissions.efxWrite },
    { url: "/transactions/approvals", permission: Permissions.paymentsWrite }
  ]);

  const [restrictedPath] = useMemo(() => {
    return pathUrls.filter((item) => item.url === location.pathname);
  }, [location, pathUrls]);

  if (isFetching && isAuthenticated) return <Spin loading={true} />;

  if (restrictedPath && restrictedPath.url === "/transactions/approvals") {
    if (
      isUserApprover ||
      UserRoles.ECommerceViewer !== userRole ||
      hasPermission(restrictedPath.permission)
    )
      return <>{children}</>;
  }

  if (restrictedPath) {
    if (hasPermission(restrictedPath.permission)) return <>{children}</>;
    return <Navigate to={"/"} />;
  }

  return <>{children}</>;
};

export { PermissionsHandler };
