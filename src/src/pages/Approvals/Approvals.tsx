import React, { useContext } from "react";
import { useAppSelector } from "../../redux/hooks/store";
import { Spin } from "@payconstruct/design-system";
import {
  selectApprovalQueue,
  selectLoading
} from "../../config/approval/approvalSlice";
import { useGetAllUsersQuery } from "../../services/userManagementService";
import {
  Permissions,
  UserRoles
} from "@payconstruct/fe-utils/dist/Enum/userManagementEnums";

import NotificationModal from "./Components/Modals/Notification";
import PageWrapper from "../../components/Wrapper/PageWrapper";
import ApprovalHeader from "./Components/ApprovalHeader";
import ApprovalGroup from "./ApprovalGroup";
import ApprovalQueue from "./ApprovalQueue";
import { useCheckPermissions } from "../../customHooks/useCheckPermissions";
import { ApprovalsContext } from "./ApprovalsContext/ApprovalsProvider";

const Approvals: React.FC = () => {
  const isLoading = useAppSelector(selectLoading);
  const approvalQueue = useAppSelector(selectApprovalQueue);
  const entityId = useAppSelector((state) => state.auth.clientId);

  const { hasPermission } = useCheckPermissions();
  const { isUserApprover } = useContext(ApprovalsContext);

  /* all Users By EntityID Api Query */
  const { allUsers = [], isUsersLoading } = useGetAllUsersQuery(entityId, {
    refetchOnMountOrArgChange: true,
    selectFromResult: ({ data, isLoading }) => ({
      allUsers: data?.data?.users?.length
        ? data?.data?.users?.filter(
            (user) => user?.role !== UserRoles.ECommerceViewer
          )
        : [],
      isUsersLoading: isLoading
    })
  });
  const usersCount = allUsers?.slice(0, -1);

  return (
    <Spin loading={approvalQueue?.length ? false : isLoading || isUsersLoading}>
      <PageWrapper>
        <NotificationModal />
        <ApprovalHeader users={allUsers} />
        <ApprovalGroup
          allUsers={allUsers}
          usersCount={usersCount ? usersCount : []}
          isUsersLoading={isUsersLoading}
        />
        {(hasPermission(Permissions.paymentsWrite) || isUserApprover) && (
          <ApprovalQueue />
        )}
      </PageWrapper>
    </Spin>
  );
};

export default Approvals;
