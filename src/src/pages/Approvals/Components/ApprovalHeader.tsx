import React, { useContext, useEffect } from "react";
import { useIntl } from "react-intl";
import { Switch, Text, Tooltip, Form } from "@payconstruct/design-system";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/store";
import { Header, HeaderContent } from "../../../components/PageHeader/Header";
import {
  selectLoading,
  updateGroupModalShow,
  updateGroupModalType,
  // selectApprovalRequired,
  updateDeactivateModalShow,
  selectDeactivateModalShow,
  selectApprovalQueue,
  selectApprovalRequired,
  selectApprovalToggleOff
} from "../../../config/approval/approvalSlice";
import DeactivateApprovalRule from "./Modals/DeactivateApprovalRule";
import { toggleOnRule } from "../../../services/approvalService/actions";
import { GroupModal } from "../../../enums/Approval";
import { UserRoles } from "@payconstruct/fe-utils/dist/Enum/userManagementEnums";
import { Users } from "../Approval.Interface";
import { AuthContext } from "@payconstruct/orbital-auth-provider";
import { ApprovalsContext } from "../ApprovalsContext/ApprovalsProvider";
import { updateApprovalRule } from "../ApprovalsContext/ApprovalsActions";

interface Approval {
  users: Users[];
}

const ApprovalHeader: React.FC<Approval> = ({ users }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { userRole } = useContext(AuthContext);
  const { dispatch: approvalDispatch, isApprovalRuleActivated } =
    useContext(ApprovalsContext);
  const isLoading = useAppSelector(selectLoading);

  // const isApprovalRuleActiavted: boolean = useAppSelector(
  //   selectApprovalRequired
  // );
  const showDeactivateRule = useAppSelector(selectDeactivateModalShow);
  const approvalQueue = useAppSelector(selectApprovalQueue);
  const approvalsRequired = useAppSelector(selectApprovalRequired);
  const isToggleOff = useAppSelector(selectApprovalToggleOff);

  useEffect(() => {
    form.setFieldsValue({
      activate: isApprovalRuleActivated
    });
  }, [isApprovalRuleActivated, form]);

  useEffect(() => {
    if (isToggleOff) {
      approvalDispatch &&
        approvalDispatch(updateApprovalRule(approvalsRequired));
    }
  }, [isToggleOff, approvalDispatch]);

  const handleActivateRule = (isSwitched: any) => {
    if (isSwitched) {
      dispatch(toggleOnRule(isSwitched));
      dispatch(updateGroupModalShow(isSwitched));
      dispatch(updateGroupModalType(GroupModal.Add));
    } else dispatch(updateDeactivateModalShow(true));
  };
  const noCallback = () => {};

  const getTooltipText = () => {
    let returnTooltipText;
    if (isApprovalRuleActivated) {
      returnTooltipText = intl.formatMessage({ id: "approvalRuleTurnOffNote" });
    } else if (users.length === 1) {
      returnTooltipText = intl.formatMessage({ id: "approvalRuleEnableNote" });
    } else returnTooltipText = "";
    return returnTooltipText;
  };

  const getToggleCss = () => {
    let returnCssName = "not-allowed";
    if (users?.length === 1 && !isApprovalRuleActivated) {
      returnCssName = "not-allowed";
    } else if (approvalQueue?.length && isApprovalRuleActivated) {
      returnCssName = "not-allowed";
    } else returnCssName = "pointer";
    return returnCssName;
  };

  return (
    <>
      <Header>
        <DeactivateApprovalRule
          isLoading={isLoading}
          show={showDeactivateRule}
          toggleShow={(value) => dispatch(updateDeactivateModalShow(value))}
        />
        <HeaderContent.LeftSide>
          <HeaderContent.Title>Transaction approval</HeaderContent.Title>
        </HeaderContent.LeftSide>
        {userRole === UserRoles.SuperAdmin && (
          <HeaderContent.RightSide>
            <div style={{ marginTop: "9px", fontWeight: "bold" }}>
              Approval required{" "}
            </div>

            <Form
              id="myForm"
              form={form}
              initialValues={{ activate: isApprovalRuleActivated }}
            >
              <Form.Item name="activate">
                <Tooltip tooltipPlacement="bottom" text={getTooltipText()}>
                  <Switch
                    switchSize="large"
                    checked={isApprovalRuleActivated}
                    onChange={
                      approvalQueue?.length <= 0 || !isApprovalRuleActivated
                        ? users?.length > 1
                          ? handleActivateRule
                          : isApprovalRuleActivated
                          ? handleActivateRule
                          : noCallback
                        : noCallback
                    }
                    style={{
                      marginLeft: "12px",
                      cursor: getToggleCss()
                    }}
                  />
                </Tooltip>
              </Form.Item>
            </Form>
          </HeaderContent.RightSide>
        )}
      </Header>
      <div style={{ marginTop: "-25px", lineHeight: "1.5715" }}>
        <Text size="small">
          {intl.formatMessage({ id: "approvalHeaderNote" })}
        </Text>
      </div>
      <br />
    </>
  );
};

export default ApprovalHeader;
