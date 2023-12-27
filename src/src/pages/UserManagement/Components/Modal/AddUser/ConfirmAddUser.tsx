import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Text,
  Form,
  Checkbox,
  Modal as DSModal
} from "@payconstruct/design-system";
import {
  useAppDispatch,
  useAppSelector
} from "../../../../../redux/hooks/store";
import {
  updateFormValue,
  updateSearchQuery,
  updateNotificationModal
} from "../../../../../config/userManagement/userManagementSlice";
import {
  selectOrganizationId,
  updateOrganizationToken
} from "../../../../../config/organisation/organisationSlice";
import { updateAccessToken } from "../../../../../config/auth/authSlice";
import { Spacer } from "../../../../../components/Spacer/Spacer";
import { UserRoles } from "@payconstruct/fe-utils/dist/Enum/userManagementEnums";
import { useCreateUserMutation } from "../../../../../services/userManagementService";
import { useRevokeOrganisationTokenMutation } from "../../../../../services/orgTokenService";

import { audience } from "../../../../../config/variables";

import style from "../../../style.module.css";
interface GroupProps {
  show?: boolean;
  refetchUserList: () => void;
  role: string;
}
const ConfirmAddUser: React.FC<GroupProps> = ({
  show,
  refetchUserList,
  role
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { getAccessTokenWithPopup } = useAuth0();

  const organisationId = useAppSelector(selectOrganizationId);
  show = useAppSelector((state) => state.userManagement.initialFormData.roleId)
    ? true
    : false;
  const addUserData = useAppSelector(
    (state) => state.userManagement.initialFormData
  );
  const accessToken = useAppSelector((state) => state.auth.token);

  const [isAcceptedToDeactivate, setToDeactiveApproval] =
    useState<boolean>(true);
  const [ischecked, setChecked] = useState<boolean>(false);

  const [createNewUser, { isLoading }] = useCreateUserMutation();
  const [revokeOrgToken] = useRevokeOrganisationTokenMutation();

  useEffect(() => {
    setChecked(false);
    form.resetFields();
  }, [form, show]);

  useEffect(() => {
    setToDeactiveApproval(true);
  }, [setToDeactiveApproval, show]);

  const acceptDeactivationRule: any = (
    <div className={style["add__user-checkbox"]}>
      {role === UserRoles.Admin
        ? "I confirm that I am authorised to add users on behalf of the company. I recognise that by adding this user as admin to this platform, they will have access to priviliged information about the company, view or create accounts or carry out transactions on behalf of the company. They will also be able to add other users and assign them a role, as well as assigning approver entitlement."
        : "I confirm that I am authorised to add users on behalf of the company. I recognise that by adding this user to this platform, they will have access to priviliged information about the company, view or create accounts or carry out transactions on behalf of the company."}
    </div>
  );

  // verify MFA and get new token and upon success create new user
  const getAccessTokenPopup = async () => {
    dispatch(updateOrganizationToken(accessToken));
    const token = await getAccessTokenWithPopup({
      organization: organisationId,
      audience: audience,
      ignoreCache: true,
      portal: "cms"
    });
    await dispatch(
      updateAccessToken({
        token,
        refreshToken: ""
      })
    );
    token && addNewUser();
  };

  // onclick add new user confirmation
  const AddNewUser = () => {
    getAccessTokenPopup();
  };

  // add new user
  const addNewUser = async () => {
    try {
      await createNewUser({
        ...addUserData
      })
        .unwrap()
        .then(() => {
          revokeOrgToken();
          refetchUserList();
          dispatch(updateFormValue({}));
          dispatch(updateSearchQuery(""));
          dispatch(
            updateNotificationModal({
              show: true,
              title: "The user has been added succesfully",
              noteOne:
                "An invitation with a login link and temporary password has been emailed to the user.",
              noteTwo:
                "Once they log in, they must update the password as soon as possible.",
              modalType: "success"
            })
          );
        });
      if (form?.resetFields) form?.resetFields();
    } catch (err: any) {
      dispatch(updateFormValue({}));
      dispatch(
        updateNotificationModal({
          show: true,
          title: "Error in adding user",
          noteOne:
            "We apologise for the inconvenience. Please get in touch with your customer service representative.",
          modalType: "error"
        })
      );
    }
  };

  const termsAccepted = (e: any) => {
    const isAccepted = e.target.checked;
    setToDeactiveApproval(!isAccepted);
  };

  return (
    <>
      <DSModal
        title={
          role === UserRoles.Admin
            ? "Are you sure you want to add this admin user?"
            : "Are you sure you want to add this user?"
        }
        onCancelText={intl.formatMessage({ id: "cancel" })}
        onOkText="Send Invite"
        onClickOk={() => form.submit()}
        onClickCancel={() => dispatch(updateFormValue({}))}
        type="warning"
        modalView={show}
        modalWidth={650}
        buttonOkDisabled={isAcceptedToDeactivate}
        btnLoading={isLoading}
        description={
          <div>
            <Text
              weight="bold"
              label={
                role === UserRoles.Admin
                  ? "Warning: If you add this user on to this platform and assign them the admin role, they will have access to your accounts and will be able to view priviliged information or carry out transactions on behalf of your entity. They will also be able to add other users on this platform and assign approver entitlement."
                  : "Warning: If you add this user on to this platform, they will have access to your accounts and will be able to view priviliged information or carry out transactions on behalf of your entity."
              }
            />
            <Spacer size={5} />
            <br />
            <Text label="Please double-check the user details and email, and consult the roles before adding a user to the platform and assigning them a role." />
            <Spacer size={20} />
            <Form
              id="myForm"
              form={form}
              onFinish={AddNewUser}
              initialValues={{
                isAcceptedToDeactivate: ischecked
              }}
            >
              <Form.Item
                name={"isAcceptedToDeactivate"}
                valuePropName="checked"
              >
                <Checkbox
                  onChange={termsAccepted}
                  label={acceptDeactivationRule}
                />
              </Form.Item>
            </Form>
          </div>
        }
      />
    </>
  );
};

export default ConfirmAddUser;
