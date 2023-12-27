import { useCallback, useMemo } from "react";
import {
  SideMenu as DSSideMenu,
  MenuItem,
  MenuItemGroup
} from "@payconstruct/design-system";
import { Link, useLocation } from "react-router-dom";
import { MenuItemsType, MenuItemType } from "./MenuData";
import { getKycStatus } from "../../config/company/companySlice";
import { useAppSelector } from "../../redux/hooks/store";
import { useCheckPermissions } from "../../customHooks/useCheckPermissions";

interface SideMenuDataProps {
  sideMenuData: MenuItemsType;
  isMenuCollapsed: boolean;
  isMenuEnabled: boolean;
  onCollapse: (collapsed: boolean) => void;
  disabled?: boolean;
}

const SideMenu: React.FC<SideMenuDataProps> = ({
  sideMenuData,
  isMenuCollapsed,
  isMenuEnabled,
  onCollapse,
  disabled
}) => {
  const location = useLocation();

  const kycStatus = useAppSelector(getKycStatus);
  const { hasPermission } = useCheckPermissions();

  const filterKYCStatus = useCallback(
    ({ showOnKYCPass }: MenuItemType) => {
      if (kycStatus === "pass" && showOnKYCPass) return true;
      return false;
    },
    [kycStatus]
  );

  const filterKYCPermission = useCallback(
    ({ permission }: MenuItemType) => {
      if (permission) return hasPermission(permission);
      //* Return item if no permission is set.
      return true;
    },
    [hasPermission]
  );

  const selectedMenuItem = useMemo(() => {
    const item = sideMenuData.find((item) => item.url === location.pathname);
    if (item) return [item.key];
    return [""];
  }, [location, sideMenuData]);

  const menuData = useMemo(() => {
    return sideMenuData
      .filter(filterKYCStatus)
      .filter(filterKYCPermission)
      .map(({ key, title, icon, url, heading }) => {
        if (heading) return <MenuItemGroup key={key} title={heading} />;

        return (
          <MenuItem disabled={!disabled} key={key} title={title} icon={icon}>
            {url && <Link to={url}>{title}</Link>}
          </MenuItem>
        );
      });
  }, [sideMenuData, disabled, filterKYCPermission, filterKYCStatus]);

  return (
    <DSSideMenu
      theme="dark"
      collapsed={isMenuCollapsed}
      showBack={isMenuEnabled}
      collapsible={true}
      onCollapse={onCollapse}
      selectedKeys={selectedMenuItem}
      // defaultSelectedKeys={selectedMenuItem}
      style={{
        height: "100vh",
        left: 0,
        overflow: "auto",
        position: "fixed"
      }}
    >
      {menuData}
    </DSSideMenu>
  );
};

export default SideMenu;
