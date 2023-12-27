import React, { useState } from "react";
import { useIntl } from "react-intl";
import {
  Modal,
  Form,
  TextInput,
  Button,
  Notification
} from "@payconstruct/design-system";
import {
  ResetTwoFAQrCodeRequest,
  useVerifyPasswordMutation,
  useResetTwoFAQrCodeMutation
} from "../../../services/authService";
import styles from "./VerifyPassword.module.css";

interface VerifyPwdBodyProps {
  form?: any;
  showRecoveryCodeModal?: string;
  onFieldsChange: (e: any) => void;
  onFinish: () => void;
}

const VerifyPwdBody: React.FC<VerifyPwdBodyProps> = ({
  form,
  showRecoveryCodeModal,
  onFieldsChange,
  onFinish
}) => {
  const intl = useIntl();

  return (
    <div className={styles["account-settings-modal"]}>
      <Form form={form} onFieldsChange={onFieldsChange} onFinish={onFinish}>
        <Form.Item name={"password"}>
          <TextInput
            type={"password"}
            name={"password"}
            label={intl.formatMessage({ id: "password" })}
            message={intl.formatMessage({ id: "passwordErrorMsg" })}
            floatingLabel={true}
            required={true}
          />
        </Form.Item>
        {showRecoveryCodeModal === "twoFactorAuthentication" && (
          <Form.Item name={"recoveryCode"}>
            <TextInput
              type={"text"}
              name={"recoveryCode"}
              label={"Enter Recovery Code"}
              message={"Wrong Recovery Code."}
              floatingLabel={true}
              required={true}
            />
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

interface VerifyPwdModalProps {
  show: boolean;
  title: any;
  subTitle: any;
  showRecoveryCodeModal?: string;
  onCancelText: string;
  onOkText: string;
  onClickCancel: () => void;
  onClickOk: (data?: any) => void;
  onClickForgetPwd?: (data?: any) => void;
  forgotPasswordButton: boolean;
}

const VerifyPasswordModal: React.FC<VerifyPwdModalProps> = ({
  show,
  title,
  subTitle,
  showRecoveryCodeModal,
  onCancelText,
  onOkText,
  onClickCancel,
  onClickOk,
  onClickForgetPwd,
  forgotPasswordButton
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [formState, setFormState] = useState<ResetTwoFAQrCodeRequest>({
    authenticatorTypes: ["otp"],
    password: "",
    recoveryCode: ""
  });

  // Access Mutations - Redux Tool Kit API requester to mutate state on API request
  const [verifyPassword, { isLoading: isPasswordLoading }] =
    useVerifyPasswordMutation();
  const [verifyMFAAssociate, { isLoading: isRecoveryCodeLoading }] =
    useResetTwoFAQrCodeMutation();

  const onFieldsChange = (item: any) => {
    setFormState((prev) => ({ ...prev, [item[0].name[0]]: item[0].value }));
  };

  const onFinish = () => {
    const { authenticatorTypes, password, recoveryCode } = formState;
    const formatRecoveryCode = recoveryCode?.replace(/-|\s/g, "");
    showRecoveryCodeModal === "twoFactorAuthentication"
      ? verifyMFAAssociate({
          authenticatorTypes: authenticatorTypes,
          password: password,
          recoveryCode: formatRecoveryCode
        })
          .unwrap()
          .then(() => {
            Notification({
              message: intl.formatMessage({
                id: "2FaRecoveryUpdateSuccessMSg"
              }),
              type: "success"
            });
            form.resetFields();
            onClickOk();
          })
          .catch((err) => {
            Notification({
              message: intl.formatMessage({ id: "2FaRecoveryUpdateErrorMsg" }),
              type: "error"
            });
          })
      : verifyPassword({ password })
          .unwrap()
          .then(() => {
            Notification({
              message: intl.formatMessage({ id: "passwordUpdateSuccessMsg" }),
              type: "success"
            });
            form.resetFields();
            onClickOk();
          })
          .catch((err) => {
            Notification({
              message: intl.formatMessage({ id: "passwordUpdateErrorMsg" }),
              type: "error"
            });
          });
  };

  return (
    <Modal
      modalView={show}
      title={title}
      subTitle={subTitle}
      onCancelText={onCancelText}
      onOkText={onOkText}
      onClickCancel={() => {
        onClickCancel();
        form.resetFields();
      }}
      onClickOk={() => {
        form.submit();
      }}
      description={
        <VerifyPwdBody
          form={form}
          showRecoveryCodeModal={showRecoveryCodeModal}
          onFieldsChange={onFieldsChange}
          onFinish={onFinish}
        />
      }
      btnLoading={isPasswordLoading || isRecoveryCodeLoading}
      customButtons={
        forgotPasswordButton ? (
          <Button
            className={styles["forget__pwd__link__btn"]}
            type="link"
            label="Forgot Password"
            onClick={onClickForgetPwd}
          />
        ) : (
          ""
        )
      }
    />
  );
};

export { VerifyPasswordModal };
