import { UserRoles } from "@payconstruct/fe-utils/dist/Enum/userManagementEnums";
import { Roles } from "../../../services/userManagementService";
import { capitalizeString } from "../../../config/transformer";

export const sortRolesOrder = (a: Roles, b: Roles) => {
  const order = [
    "super admin",
    "admin",
    "creator",
    "viewer",
    "eCommerce viewer"
  ];
  const aIndex = order.indexOf(a.name);
  const bIndex = order.indexOf(b.name);
  return aIndex - bIndex;
};

export const formatRoleText = (role: string) => {
  return role === UserRoles.ECommerceViewer
    ? "eCommerce Viewer"
    : capitalizeString(role);
};
