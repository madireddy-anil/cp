import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useAuth0 } from "@auth0/auth0-react";
import { Modal, Notification, Checkbox } from "@payconstruct/design-system";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/store";
import {
  updateSearchQuery,
  updateNotificationModal
} from "../../../../config/userManagement/userManagementSlice";
import {
  Roles,
  useUpdateUserMutation
} from "../../../../services/userManagementService";
import {
  selectOrganizationId,
  updateOrganizationToken
} from "../../../../config/organisation/organisationSlice";
import { updateAccessToken } from "../../../../config/auth/authSlice";
import { useRevokeOrganisationTokenMutation } from "../../../../services/orgTokenService";
import { audience } from "../../../../config/variables";

import style from "../../style.module.css";
interface EditUserModalProps {
  show: boolean;
  title: string;
  form: any;
  roles: Roles[];
  onCancelText: string;
  onOkText: string;
  userId: string;
  onClickCancel: () => void;
  onClickOk: (data?: any) => void;
  refetchUserList: () => void;
  toggleShow: (value: boolean) => void;
  selectedrole: Roles;
}

const EditUser: React.FC<EditUserModalProps> = ({
  show,
  title,
  onCancelText,
  onOkText,
  userId,
  toggleShow,
  onClickCancel,
  refetchUserList,
  selectedrole
}) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { getAccessTokenWithPopup } = useAuth0();

  /* Global State */
  const organisationId = useAppSelector(selectOrganizationId);
  const accessToken = useAppSelector((state) => state.auth.token);
  const { isUserEditLoading } = useAppSelector((state) => state.userManagement);

  const [isAcceptedToDeactivate, setToDeactiveApproval] =
    useState<boolean>(true);

  const [updateUser] = useUpdateUserMutation();
  const [revokeOrgToken] = useRevokeOrganisationTokenMutation();

  const selectedvalue = { roleId: selectedrole?.id, role: selectedrole?.name };
  const data = selectedvalue;

  const editUserModalBody = () => {
    const ChangeRoleHandler = (e: any) => {
      const isAccepted = e.target.checked;
      setToDeactiveApproval(!isAccepted);
    };

    const acceptToUpdateRoleNote: any = (
      <div className={style["edit__role-checkbox"]}>
        I confirm that I am authorised to change user roles on behalf of the
        company.
        <br />I recognise that by changing this user’s role they will have the
        rights assigned to them as per the role definition.
      </div>
    );

    return (
      <Checkbox
        onChange={(e) => {
          e.target.value = e.target.checked;
          ChangeRoleHandler(e);
        }}
        label={acceptToUpdateRoleNote}
      />
    );
  };

  const onClickokHandler = () => getAccessTokenPopup();

  // verify MFA and get new token and upon success edit user role
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
    token && editUserRole();
  };

  const editUserRole = async () => {
    try {
      await updateUser({ userId, data })
        .unwrap()
        .then(() => {
          revokeOrgToken();
          refetchUserList();
          toggleShow(false);
          dispatch(updateSearchQuery(""));
          Notification({
            message: "The user role was changed successfully",
            description: intl.formatMessage({
              id: "The user’s platform access has been updated according to their new role. Please consult the role definitions to find out more."
            }),
            type: "success"
          });
        });
    } catch (err: any) {
      console.log(err, "ERROR_ON_ROLE_UPDATE");
      toggleShow(false);
      dispatch(
        updateNotificationModal({
          show: true,
          modalType: "error",
          title: "Error in editing user role",
          noteOne:
            "We apologise for the inconvenience. Please get in touch with your customer service representative."
        })
      );
    }
  };

  return (
    <Modal
      modalView={show}
      modalWidth={600}
      title={title}
      type="warning"
      onCancelText={onCancelText}
      onOkText={onOkText}
      onClickCancel={() => {
        onClickCancel();
      }}
      onClickOk={onClickokHandler}
      description={editUserModalBody()}
      btnLoading={isUserEditLoading}
      buttonOkDisabled={isAcceptedToDeactivate}
    />
  );
};

export { EditUser };
