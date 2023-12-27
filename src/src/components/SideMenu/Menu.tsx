import { Fragment, useEffect, useMemo } from "react";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  selectMenuCollapsed,
  updateMenuCollapse
} from "../../config/general/generalSlice";
import { getKycStatus } from "../../config/company/companySlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/store";
import SideMenu from "./SideMenu";
import {
  cryptoMenuItem,
  conversionsItem,
  menuItems,
  paymentsMenuItem,
  receivablesMenuItem
} from "./MenuData";
import "./Menu.module.css";
import { useFlags } from "launchdarkly-react-client-sdk";
import { flags } from "../../config/variables";
interface MenuProps {
  routes: RouteProps[];
}

const Menu: React.FC<MenuProps> = ({ routes }) => {
  const dispatch = useAppDispatch();
  const isMenuCollapsed = useAppSelector(selectMenuCollapsed);
  const kycStatus = useAppSelector(getKycStatus);
  const LDFlags = useFlags();
  const location = useLocation();

  //* Default to true if route.isMenuEnabled is not found
  const isMenuEnabled = useMemo(() => {
    const route = routes.find((route) => route.path === location.pathname);

    if (route && route.isMenuEnabled != null) {
      return route.isMenuEnabled;
    }

    return true;
  }, [location, routes]);

  // Menu Has 3 States
  // Not showing: 0px
  // Showing Not collapsed: 300px
  // Showing collapsed: 80px
  // Content removes 300px
  const [menuShowingNotCollapsedStyle] = useState<React.CSSProperties>({
    width: `calc(100% - 300px)`,
    background: "#f7f8fa",
    marginLeft: "300px",
    position: "relative",
    display: "inline-block",
    transform: "translate3d(0, 0, 0)"
  });

  const [menuShowingCollapsedStyle] = useState<React.CSSProperties>({
    width: `calc(100% - 80px)`,
    background: "#f7f8fa",
    marginLeft: "80px",
    position: "relative",
    display: "inline-block",
    transform: "translate3d(0, 0, 0)"
  });

  const [menuHidden] = useState<React.CSSProperties>({
    width: `calc(100% - 0px)`,
    background: "#f7f8fa",
    marginLeft: "0px",
    position: "relative",
    display: "inline-block",
    transform: "translate3d(0, 0, 0)"
  });

  const [mainStyle, setMainStyle] = useState(menuShowingNotCollapsedStyle);

  const handleCollapse = (isCollapsed: boolean) => {
    dispatch(updateMenuCollapse(isCollapsed));

    if (isCollapsed) {
      setMainStyle(menuShowingCollapsedStyle);
      return;
    }
    setMainStyle(menuShowingNotCollapsedStyle);
  };

  useEffect(() => {
    if (isMenuEnabled) {
      if (isMenuCollapsed) {
        setMainStyle(menuShowingCollapsedStyle);
        return;
      }
      setMainStyle(menuShowingNotCollapsedStyle);
      return;
    }
    setMainStyle(menuHidden);
  }, [
    isMenuEnabled,
    isMenuCollapsed,
    menuShowingNotCollapsedStyle,
    menuShowingCollapsedStyle,
    menuHidden
  ]);

  const conditionalMenuItems = useMemo(() => {
    let modifiedMenuItems = [...menuItems];
    //! Hide from menu if we want to show new payment flow (By design).

    if (LDFlags[flags.showNewPaymentFlow]) {
      modifiedMenuItems = modifiedMenuItems.filter(
        (item) => item.key !== "new-payment"
      );
    }

    if (LDFlags[flags.showPayments]) {
      modifiedMenuItems = [...modifiedMenuItems, paymentsMenuItem];
    }

    if (LDFlags[flags.showCryptoCommerceUI])
      modifiedMenuItems = [...modifiedMenuItems, cryptoMenuItem];

    // if (LDFlags[flags.showNewAccountsUI]) {
    //   modifiedMenuItems = [...modifiedMenuItems, newAccountsMenuItem];

    //   modifiedMenuItems = modifiedMenuItems.filter(
    //     (item) => item.key !== "account"
    //   );
    // }

    if (LDFlags[flags.showConversionsDashboardUI]) {
      modifiedMenuItems = [...modifiedMenuItems, conversionsItem];
    }

    if (LDFlags[flags.showReceivables]) {
      modifiedMenuItems = [...modifiedMenuItems, receivablesMenuItem];
    }

    //* re-order menu items
    modifiedMenuItems.sort((a, b) => a.order - b.order);

    return modifiedMenuItems;
  }, [LDFlags]);

  return (
    <Fragment>
      <SideMenu
        sideMenuData={conditionalMenuItems}
        isMenuCollapsed={isMenuCollapsed}
        isMenuEnabled={isMenuEnabled}
        onCollapse={handleCollapse}
        disabled={kycStatus}
      />
      <div style={mainStyle}>
        <Outlet />
      </div>
    </Fragment>
  );
};

export { Menu as default };
