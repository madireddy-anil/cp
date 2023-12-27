import { ForgetPasswordModal, Notification } from "@payconstruct/design-system";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useResetPasswordMutation } from "../../../services/authService";

interface ResetPasswordProps {
  show: boolean;
  toggleShow: (value: boolean) => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({
  show,
  toggleShow
}) => {
  const intl = useIntl();

  const [forgetPasswordInput, setForgetPasswordInput] = useState({ email: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);

  // Access Reset Password Mutation
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onChangePasswordModal = ({
    target: { value }
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (value) setButtonDisabled(false);
    setForgetPasswordInput({ email: value });
  };

  return (
    <ForgetPasswordModal
      description={intl.formatMessage({ id: "forgotPasswordDescription" })}
      buttonOkDisabled={buttonDisabled}
      onChange={onChangePasswordModal}
      onClickOk={async () => {
        try {
          await resetPassword(forgetPasswordInput)
            .unwrap()
            .then(() => {
              Notification({
                type: "success",
                message: "",
                description: intl.formatMessage({ id: "emailSentMsg" })
              });
            });
          toggleShow(false);
        } catch (err) {
          Notification({
            message: intl.formatMessage({ id: "Invalid email" }),
            description: intl.formatMessage({
              id: "Email does not exist, check if you typed the correct email and try again"
            }),
            type: "error"
          });
        }
      }}
      btnLoading={isLoading}
      onClickCancel={() => toggleShow(false)}
      onCancelText={intl.formatMessage({ id: "cancel" })}
      errorMessage="Required field"
      title={intl.formatMessage({ id: "forgotPassword" })}
      modalView={show}
    />
  );
};
