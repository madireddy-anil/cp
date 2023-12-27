import React, { useState, useEffect, useContext } from "react";
import { useIntl } from "react-intl";
import { Card } from "antd";
import {
  Spin,
  Text,
  Form,
  Select,
  Checkbox,
  CheckboxGroup,
  Modal as DSModal
} from "@payconstruct/design-system";
import { useAppDispatch } from "../../../../redux/hooks/store";
import { Spacer } from "../../../../components/Spacer/Spacer";
import {
  updateGroupModalShow
  // selectApprovalCount
} from "../../../../config/approval/approvalSlice";
// import { selectCurrentUserId } from "../../../../config/auth/authSlice";
// import { useGetAllUsersQuery } from "../../../../services/userManagementService";
import { Users, ApproverUserIds } from "../../Approval.Interface";
import { GroupModal } from "../../../../enums/Approval";
import { postRule } from "../../../../services/approvalService/actions";
import { toggleOnRule } from "../../../../services/approvalService/actions";

import style from "../../style.module.css";
import { ApprovalsContext } from "../../ApprovalsContext/ApprovalsProvider";

interface InitialForm {
  totalApprovalsRequired: number;
  approvers: ApproverUserIds[];
}

interface GroupProps {
  show: boolean;
  modalType: string;
  isLoading: boolean;

  allUsers: Users[];
  usersCount: Users[];
  isUsersLoading: boolean;
}
const AddEditGroup: React.FC<GroupProps> = ({
  show,
  modalType,
  isLoading,
  allUsers,
  usersCount,
  isUsersLoading
}) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const { approvalsUserIds, totalApprovalsRequired } =
    useContext(ApprovalsContext);

  const dispatch = useAppDispatch();

  // const entityId = useAppSelector((state) => state.auth.clientId);
  // const approvalCount = useAppSelector(selectApprovalCount);
  // const userId = useAppSelector(selectCurrentUserId);
  // const selectedApprovers = useAppSelector(
  //   (state) => state.approval.selectedApprovers
  // );
  const [formState, setFormState] = useState<InitialForm>({
    totalApprovalsRequired: 1,
    approvers: []
  });

  useEffect(() => {
    if (modalType === GroupModal.Edit) {
      form.setFieldsValue({
        totalApprovalsRequired: approvalsUserIds?.length
          ? totalApprovalsRequired
          : 1,
        approvers: approvalsUserIds?.length ? approvalsUserIds : []
      });
    }
    if (modalType === GroupModal.Add) {
      form.setFieldsValue({
        totalApprovalsRequired: 1,
        approvers: []
      });
      setFormState({
        totalApprovalsRequired: 1,
        approvers: []
      });
    }
  }, [modalType, show, totalApprovalsRequired, form, approvalsUserIds]);

  /* all Users By EntityID Api Query */
  // const { allUsers, usersCount, isUsersLoading } = useGetAllUsersQuery(
  //   entityId,
  //   {
  //     refetchOnMountOrArgChange: true,
  //     selectFromResult: ({ data, isLoading }) => ({
  //       allUsers: data?.data?.users?.length ? data?.data?.users : [],
  //       usersCount:
  //         data?.data?.users?.length === 1
  //           ? data?.data?.users
  //           : data?.data?.users?.slice(0, -1),
  //       isUsersLoading: isLoading
  //     })
  //   }
  // );

  const approvalCountOptions: any[] = (usersCount || [])?.map(
    (_, index: number) => {
      return [index + 1, index + 1];
    }
  );

  const onFinish = (formValues: any) => {
    const approvers: ApproverUserIds[] = [];
    formValues.approvers.forEach((item: string) => {
      const user = allUsers.find((user: Users) => user.id === item);
      user &&
        approvers.push({
          name: `${user.firstName} ${user.lastName}`,
          id: user.id
        });
    });
    formValues.approvers = approvers;
    formValues.approvalsRequired = formValues.totalApprovalsRequired;
    delete formValues.totalApprovalsRequired;
    dispatch(postRule(formValues));
  };

  const onFieldsChange = (item: any) => {
    setFormState((prev: any) => ({
      ...prev,
      [item[0]?.name[0]]: item[0]?.value
    }));
  };

  const getLabelName = (user: Users) => {
    let label: any = (
      <Text
        size="small"
        label={`${user?.firstName}  ${user?.lastName},  ${user?.email}`}
      />
    );
    return label;
  };

  const validateDisableButton = () => {
    let btnStatus: boolean = true;
    btnStatus =
      formState?.totalApprovalsRequired > 0 &&
      formState?.approvers?.length >= formState?.totalApprovalsRequired
        ? false
        : true;
    return btnStatus;
  };

  return (
    <>
      <DSModal
        title={intl.formatMessage({
          id:
            modalType === GroupModal.Add
              ? "approvalAddRuleTitle"
              : "approvalEditRuleTitle"
        })}
        onOkText={
          modalType === GroupModal.Add
            ? intl.formatMessage({ id: "continue" })
            : intl.formatMessage({ id: "save" })
        }
        onCancelText={intl.formatMessage({ id: "cancel" })}
        onClickOk={() => form.submit()}
        onClickCancel={() => {
          if (!isLoading) {
            modalType === GroupModal.Add && dispatch(toggleOnRule(false));
            dispatch(updateGroupModalShow(!show));
          }
        }}
        buttonOkDisabled={validateDisableButton()}
        btnLoading={isLoading}
        modalView={show}
        modalWidth={650}
        description={
          <>
            <Text
              size="small"
              label={intl.formatMessage({
                id:
                  modalType === GroupModal.Add
                    ? "approvalAddRuleSubTitle"
                    : "approvalEditRuleSubTitle"
              })}
            />
            <Spacer size={30} />
            <Form
              id="myForm"
              form={form}
              onFinish={onFinish}
              initialValues={{
                approvalsRequired: totalApprovalsRequired,
                approvers: approvalsUserIds
              }}
              onFieldsChange={onFieldsChange}
            >
              <Form.Item key={"0"} name={"totalApprovalsRequired"}>
                <Select
                  label={"Required number of approvers"}
                  placeholder={"Select number"}
                  optionlist={approvalCountOptions}
                />
              </Form.Item>

              <Card className={style["approval__users--card"]}>
                <Text size="small" weight="bold" label={"Approvers"} />
                <br />
                <Spacer size={10} />
                <Spin loading={isUsersLoading}>
                  <Form.Item key={"2"} name={"approvers"}>
                    <CheckboxGroup>
                      {allUsers.map((option: Users) => {
                        return (
                          <span key={option.id}>
                            <Checkbox
                              className={style["approval__users"]}
                              key={option.id}
                              label={getLabelName(option)}
                              value={option.id}
                            >
                              {option}
                            </Checkbox>
                            <br />
                          </span>
                        );
                      })}
                    </CheckboxGroup>
                  </Form.Item>{" "}
                </Spin>
              </Card>
              <Spacer size={15} />
              <Text
                size="small"
                label={intl.formatMessage({
                  id:
                    modalType === GroupModal.Add
                      ? "approvalAddRuleNote"
                      : "approvalEditRuleNote"
                })}
              />
            </Form>
          </>
        }
      />
    </>
  );
};

export default AddEditGroup;
