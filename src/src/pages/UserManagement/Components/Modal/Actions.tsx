import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Modal, Notification } from "@payconstruct/design-system";
import {
  useResendEmailMutation,
  useResetPasswordMutation
} from "../../../../services/authService";
import {
  useResetMFAMutation,
  useRemoveUserMutation
} from "../../../../services/userManagementService";
import { updateNotificationModal } from "../../../../config/userManagement/userManagementSlice";
import { ActionTypes } from "../../../../enums/UserManagement";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks/store";
import {
  selectEntityId,
  updateAccessToken
} from "../../../../config/auth/authSlice";
import { useRevokeOrganisationTokenMutation } from "../../../../services/orgTokenService";
import {
  selectOrganizationId,
  updateOrganizationToken
} from "../../../../config/organisation/organisationSlice";
import { User } from "../../../../services/userService";

import { audience } from "../../../../config/variables";
interface ViewUserModalProps {
  show: boolean;
  title: string;
  userRecord: User;
  toggleShow: (value: boolean) => void;
  refetchUserList: () => void;
}

const Actions: React.FC<ViewUserModalProps> = ({
  show,
  title,
  userRecord,
  toggleShow,
  refetchUserList
}) => {
  const { getAccessTokenWithPopup } = useAuth0();
  const dispatch = useAppDispatch();
  const organisationId = useAppSelector(selectOrganizationId);
  const entityId = useAppSelector(selectEntityId);

  const accessToken = useAppSelector((state) => state.auth.token);

  const [isLoading, setLoading] = useState<boolean>(false);

  const [resendEmailLink, { isLoading: isEmailSentLoading }] =
    useResendEmailMutation();
  const [resetPassword, { isLoading: isResetPasswordLoading }] =
    useResetPasswordMutation();
  const [resetMFA, { isLoading: isResetMFALoading }] = useResetMFAMutation();
  const [removeUser, { isLoading: isRemoveUserLoading }] =
    useRemoveUserMutation();
  const [revokeOrgToken] = useRevokeOrganisationTokenMutation();

  const getAccessTokenPopup = async (userRecord: any, actionType: string) => {
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
    if (token && actionType === ActionTypes.InviteUser) {
      resendEmail(userRecord.email);
    }
    if (token && actionType === ActionTypes.ResetPassword) {
      passwordChange(userRecord?.email);
    }
    if (token && actionType === ActionTypes.ResetMFA) {
      resetTwoFactorAuth(userRecord?.id);
    }
    if (token && actionType === ActionTypes.RemoveUser) {
      removeUserFromOrganisation(userRecord?.id);
    }
  };

  const resendEmail = async (email: string) => {
    try {
      await resendEmailLink({
        email
      })
        .unwrap()
        .then(() => {
          // refetchUserList();
          revokeOrgToken();
          toggleShow(false);
          Notification({
            message: "The invite has been resent to the user",
            description:
              "An email invitation has been sent to the user on their listed email address. ",
            type: "success"
          });
        });
    } catch (err) {
      Notification({
        message: "There was an error in resending the invite",
        description:
          "We apologise for the inconvenience. Please get in touch with your customer service representative.",
        type: "warning"
      });
    }
  };

  const passwordChange = async (email: string) => {
    try {
      await resetPassword({
        email
      })
        .unwrap()
        .then(() => {
          // refetchUserList();
          revokeOrgToken();
          toggleShow(false);
          Notification({
            message: "The user has been sent a password reset link",
            description:
              "An email password reset link has been sent to the user on their listed email address.",
            type: "success"
          });
          // dispatch(
          //   updateNotificationModal({
          //     show: true,
          //     modalType: "success",
          //     title: "User password change was successful",
          //     noteOne:
          //       "The user will need to change their password to log in to the platform."
          //   })
          // );
        });
    } catch (err: any) {
      Notification({
        message: "Error in changing the user’s password",
        description:
          "We apologise for the inconvenience. Please get in touch with your customer service representative.",
        type: "warning"
      });
      // dispatch(
      //   updateNotificationModal({
      //     show: true,
      //     modalType: "error",
      //     title: "Error in changing the user’s password",
      //     noteOne:
      //       "We apologise for the inconvenience. Please get in touch with your customer service representative."
      //   })
      // );
    }
  };

  const resetTwoFactorAuth = async (userId: string) => {
    try {
      await resetMFA({
        userId: userId
      })
        .unwrap()
        .then(() => {
          // refetchUserList();
          revokeOrgToken();
          toggleShow(false);
          dispatch(
            updateNotificationModal({
              show: true,
              modalType: "success",
              title: "User 2FA reset was successful",
              noteOne:
                "The user will be able to reset their 2FA when they log in."
            })
          );
        });
    } catch (err: any) {
      dispatch(
        updateNotificationModal({
          show: true,
          modalType: "error",
          title: "Error in resetting user’s 2FA",
          noteOne:
            "We apologise for the inconvenience. Please get in touch with your customer service representative."
        })
      );
    }
  };

  const removeUserFromOrganisation = async (userId: string) => {
    try {
      await removeUser({ userId, entityId })
        .unwrap()
        .then(() => {
          toggleShow(false);
          dispatch(
            updateNotificationModal({
              show: true,
              modalType: "success",
              title: "The user has been removed succesfully",
              noteOne: "The user will no longer have access to the platform."
            })
          );
          refetchUserList();
          revokeOrgToken();
        });
    } catch (err: any) {
      dispatch(
        updateNotificationModal({
          show: true,
          modalType: "error",
          title: "Error in removing user",
          noteOne:
            "We apologise for the inconvenience. Please get in touch with your customer service representative."
        })
      );
    }
  };

  useEffect(() => {
    setLoading(
      isEmailSentLoading ||
        isResetPasswordLoading ||
        isResetMFALoading ||
        isRemoveUserLoading
    );
  }, [
    isEmailSentLoading,
    isResetPasswordLoading,
    isResetMFALoading,
    isRemoveUserLoading
  ]);

  const handleUserAction = async (record: any, actionType: string) => {
    getAccessTokenPopup(record, actionType);
    // if (title === "Resend Invite") {
    //   resendEmail(record?.email);
    // }
    // if (title === "Reset Password") {
    //   passwordChange(record?.email);
    // }
    // if (title === "Reset 2FA") {
    //   resetTwoFactorAuth(record?.id);
    // }
    // if (title === "Remove User") {
    //   removeUserFromOrganisation(record?.id);
    // }
  };

  const getActionDetails = (type: string) => {
    let returnResp;
    if (title === ActionTypes.ResetPassword) {
      returnResp = {
        title: "Confirm user password change",
        note: "The user will not be able to log into the platform until they change their password. "
      };
    }
    if (title === ActionTypes.ResetMFA) {
      returnResp = {
        title: "Are you sure you want to reset the user’s 2FA?",
        note: "For security reasons, please make sure you have properly identified the person that has requested the reset. "
      };
    }
    if (title === ActionTypes.RemoveUser) {
      returnResp = {
        title: "Are you sure you want to remove this user?",
        note: "After you remove this user, they will no longer have access to this platform."
      };
    }
    if (title === ActionTypes.InviteUser) {
      returnResp = {
        title: "Confirm user resend invite",
        note: "The user will receive an email invitation upon resend"
      };
      // resendEmail(userRecord?.email);
    }
    return type === "title" ? returnResp?.title : returnResp?.note;
  };

  return (
    <Modal
      modalView={show}
      modalWidth={560}
      title={getActionDetails("title")}
      onCancelText={"Cancel"}
      onOkText={title}
      type="warning"
      btnLoading={isLoading}
      onClickCancel={() => toggleShow(false)}
      onClickOk={() => handleUserAction(userRecord, title)}
      description={<span>{getActionDetails("note")}</span>}
    />
  );
};

export { Actions };
