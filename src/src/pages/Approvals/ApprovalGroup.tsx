import React, { useContext } from "react";
import { Card } from "antd";
import { Text, Button } from "@payconstruct/design-system";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/store";
import { Spacer } from "../../components/Spacer/Spacer";
import AddEditGroup from "./Components/Modals/AddEditGroup";
import {
  updateGroupModalShow,
  updateGroupModalType,
  selectGroupModalShow,
  selectGroupModalType,
  // selectApprovalRequired,
  // selectApprovalCount,
  selectedApprovalExist,
  selectLoading
} from "../../config/approval/approvalSlice";
// import {
//   getRule,
//   getApprovalQueue
// } from "../../services/approvalService/actions";
import { GroupModal } from "../../enums/Approval";
import { Users } from "./Approval.Interface";
import { UserRoles } from "@payconstruct/fe-utils/dist/Enum/userManagementEnums";

import style from "./style.module.css";
import { AuthContext } from "@payconstruct/orbital-auth-provider";
import { ApprovalsContext } from "./ApprovalsContext/ApprovalsProvider";

interface GroupProps {
  allUsers: Users[];
  usersCount: Users[];
  isUsersLoading: boolean;
}

const ApprovalGroup: React.FC<GroupProps> = ({
  allUsers,
  usersCount,
  isUsersLoading
}) => {
  const dispatch = useAppDispatch();
  const { userRole } = useContext(AuthContext);
  const { approvers, totalApprovalsRequired, isApprovalRuleActivated } =
    useContext(ApprovalsContext);

  const isLoading = useAppSelector(selectLoading);

  // const isApprovalRuleActivated = useAppSelector(selectApprovalRequired);
  // const totalApprovalsRequired = useAppSelector(selectApprovalCount);

  const approvalQueueExist = useAppSelector(selectedApprovalExist);
  const showGroup = useAppSelector(selectGroupModalShow);
  const groupModalType = useAppSelector(selectGroupModalType);

  // const approvers = useAppSelector((state) => state.approval.approvers);
  // const editPermissionRoles =
  //   UserRoles.SuperAdmin === role || UserRoles.Admin === role;

  // useEffect(() => {
  //   dispatch(getRule());
  //   dispatch(getApprovalQueue());
  // }, [dispatch]);

  const getApprovalsUsers = (data: any) => {
    let returnApprovalUsers = (
      <span className={style["approvers--names"]}>No users are selected</span>
    );
    returnApprovalUsers = data?.length
      ? data
          .map((item: any) => {
            const returnResp = item?.name ? item.name : "";
            return returnResp;
          })
          .join(", ")
      : returnApprovalUsers;
    const approvalUsers: React.ReactNode = (
      <span className={style["approvers--names"]}>{returnApprovalUsers}</span>
    );
    return approvalUsers;
  };

  const getButtonEnablePermission = () => {
    let isButtonEnabled: boolean = true;
    if (
      isApprovalRuleActivated &&
      !approvalQueueExist &&
      (UserRoles.SuperAdmin === userRole || UserRoles.Admin === userRole)
    ) {
      return (isButtonEnabled = false);
    }
    return isButtonEnabled;
  };

  return (
    <>
      <AddEditGroup
        isLoading={isLoading}
        show={showGroup}
        modalType={groupModalType}
        allUsers={allUsers}
        usersCount={usersCount}
        isUsersLoading={isUsersLoading}
      />
      {/* <Message
        show={showMessage}
        modalType={messageModalType}
        toggleShow={() => dispatch(updateMessageModalShow(false))}
      /> */}
      <Spacer size={45} />
      <Text size="medium" weight="bold" label="Approval Group" />
      <Card
        className={
          style[
            approvalQueueExist
              ? "approval__group--card-disable"
              : "approval__group--card"
          ]
        }
      >
        <span className={style["approvers--counts"]}>
          Required number of approvers:{" "}
          <b>{totalApprovalsRequired ? totalApprovalsRequired : 0}</b>
        </span>
        <br /> <Spacer size={10} />
        <span className={style["approvers__title"]}>Approvers:</span>
        <br />
        {getApprovalsUsers(approvers)} <br />
        <div style={{ display: "flex" }}>
          <Button
            className={style["approval__group--btn"]}
            size="medium"
            type={isApprovalRuleActivated ? "primary" : "secondary"}
            disabled={getButtonEnablePermission()}
            label="Edit Group"
            onClick={() => {
              dispatch(updateGroupModalShow(true));
              dispatch(updateGroupModalType(GroupModal.Edit));
            }}
          />
          {!isApprovalRuleActivated ||
            (approvalQueueExist && (
              <span className={style["approval__group--no-edit"]}>
                The approval group can only be edited when the approval queue is
                empty
              </span>
            ))}
        </div>
      </Card>
    </>
  );
};

export default ApprovalGroup;
