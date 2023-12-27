import {
  Badge,
  Colors,
  Dropdown,
  Topbar as DSTopBar,
  Spacer,
  TopbarContent
} from "@payconstruct/design-system";
import { useLocation, useNavigate } from "react-router-dom";
import { flags, logoutUrl } from "../../config/variables";
import React, { useContext, useMemo } from "react";
import { AuthContext } from "@payconstruct/orbital-auth-provider";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/store";
import {
  selectApprovalQueue,
  selectedApprovalExist
} from "../../config/approval/approvalSlice";
import { useFlags } from "launchdarkly-react-client-sdk";

import {
  Permissions,
  UserRoles
} from "@payconstruct/fe-utils/dist/Enum/userManagementEnums";
import { Hooks } from "@payconstruct/fe-utils";
import styles from "./TopBarStyle.module.css";
import { updateMenuShow } from "../../config/general/generalSlice";
import { ApprovalsContext } from "../../pages/Approvals/ApprovalsContext/ApprovalsProvider";

const { useCheckPermissions } = Hooks;
interface TopbarProps {
  title: string;
  parentPage?: string;
}

const TopBar: React.FC<TopbarProps> = ({ title, parentPage }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { orgId, listOfOrganizations, logout, authenticateOrganization } =
    useContext(AuthContext);
  const { isUserApprover, refetchApprovalConfig } =
    useContext(ApprovalsContext);

  const approvalQueueExist = useAppSelector(selectedApprovalExist);
  const approvalQueueCount = useAppSelector(selectApprovalQueue);
  // const isUserApprover = useAppSelector(selectUserExistInApprovers);

  const { hasPermission, userRole } = useCheckPermissions();

  const goBackAction = () => {
    if (parentPage === "unknown") return navigateToPrev();
    if (parentPage) return navigate(parentPage);
    return navigate(-1);
  };
  const navigateToPrev = () => {
    navigate(-1);
    dispatch(updateMenuShow(true));
  };

  const ListOfCompanies = useMemo(() => {
    return listOfOrganizations?.map((org) => {
      return {
        key: org.organisationId,
        title: org.registeredCompanyName,
        issubmenu: false,
        onClick: () => authenticateOrganization(org.organisationId)
      };
    });
  }, [listOfOrganizations, authenticateOrganization]);

  const selectedCompany = useMemo(() => {
    if (!orgId) return "Waiting for company selection...";
    if (!ListOfCompanies) return "Company Loading...";

    return ListOfCompanies?.find((org) => org.key === orgId)?.title;
  }, [ListOfCompanies, orgId]);

  const showNotification: boolean =
    (hasPermission(Permissions.paymentsWrite) && approvalQueueExist) ||
    (isUserApprover && approvalQueueExist && UserRoles.Viewer === userRole);

  const hasPermissionToViewApproval =
    (hasPermission(Permissions.paymentsWrite) ||
      (isUserApprover && UserRoles.Viewer === userRole)) &&
    UserRoles.ECommerceViewer !== userRole;

  const hasNoPermissionToViewPricing = UserRoles.ECommerceViewer === userRole;

  const LDFlags = useFlags();

  const showAPIKeys = LDFlags[flags.showAPIKeys];

  const hasPermissionToViewAPIKey =
    showAPIKeys &&
    (UserRoles.Admin === userRole || UserRoles.SuperAdmin === userRole);

  return (
    <>
      {/* Create same space as the Top bar, because it's use fixed position it scape layout */}
      <Spacer size={77} />
      <DSTopBar
        showBack={!!parentPage}
        showBackIcon={"leftArrow"}
        goBackAction={goBackAction}
        title={parentPage ? title : ""}
      >
        <TopbarContent.RightSide>
          <Dropdown
            label="Topbar menu"
            text={selectedCompany}
            showNotification={showNotification}
            type="button_menu"
            dropdownmenu={[
              {
                issubmenu: false,
                key: "01",
                title: "Profile Settings",
                disabled: false,
                style: {
                  borderBottom: `1px solid ${Colors.grey.neutral100}`,
                  padding: "15px 25px"
                },
                onClick: (e) => {
                  location.pathname !== "/user/profile" &&
                    navigate("/user/profile");
                }
              },
              {
                issubmenu: false,
                key: "02",
                title: "User Management",
                disabled: false,
                onClick: () => navigate("/user-management")
              },
              {
                issubmenu: false,
                key: "03",
                title: (
                  <span style={{ width: "100%" }}>
                    <span
                      className={
                        styles[
                          approvalQueueCount?.length
                            ? "menu_approval-title-bold"
                            : "menu_approval-title"
                        ]
                      }
                    >
                      Transaction approval
                    </span>
                    {approvalQueueExist && (
                      <span className={styles["notification_count"]}>
                        <Badge
                          dotsize="small"
                          count={approvalQueueCount?.length}
                        />
                      </span>
                    )}
                  </span>
                ),
                menuiconname: "",
                disabled: false,
                hidden: !hasPermissionToViewApproval,
                onClick: () => {
                  refetchApprovalConfig();
                  navigate("/transactions/approvals");
                }
              },
              {
                issubmenu: false,
                key: "04",
                title: "Pricing",
                disabled: false,
                onClick: () => navigate("/pricing"),
                hidden: hasNoPermissionToViewPricing
              },
              {
                issubmenu: false,
                key: "05",
                title: "API Keys",
                disabled: false,
                onClick: () => navigate("/settings"),
                hidden: !hasPermissionToViewAPIKey
              },
              {
                issubmenu: false,
                key: "06",
                title: "Logout",
                disabled: false,
                onClick: () => {
                  logout({ returnTo: logoutUrl });
                }
              },
              {
                key: "07",
                title: "Switch entity",
                disabled: false,
                issubmenu: true,
                hidden:
                  listOfOrganizations == null ||
                  listOfOrganizations?.length <= 1,
                submenu: ListOfCompanies?.filter((org) => org.key !== orgId),
                onClick: (org) => {
                  authenticateOrganization(org.key);
                }
              }
            ]}
          />
        </TopbarContent.RightSide>
      </DSTopBar>
    </>
  );
};

export { TopBar };
