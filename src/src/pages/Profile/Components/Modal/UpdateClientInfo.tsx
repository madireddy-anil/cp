import React, { useState } from "react";
import { Modal, Form } from "@payconstruct/design-system";
import UpdateEmail from "./UpdateEmail/UpdateEmail";
import UpdatePhoneNumber from "./UpdatePhoneNumber/UpdatePhoneNumber";
import UpdatePassword from "./UpdatePassword/UpdatePassword";

interface UpdateClientInfoBodyProps {
  form?: any;
  fieldName: string;
  setDisabled: (e: boolean) => void;
  validateSubmitAction: () => void;
}

const UpdateClientInfoModalBody: React.FC<UpdateClientInfoBodyProps> = ({
  form,
  fieldName,
  setDisabled,
  validateSubmitAction
}) => {
  const getFormBody = (fieldName: string | undefined): any => {
    if (fieldName) {
      switch (fieldName) {
        case "Email":
          return <UpdateEmail form={form} setDisabled={setDisabled} />;
        case "Phone Number":
          return (
            <UpdatePhoneNumber
              form={form}
              setDisabled={setDisabled}
              validateSubmitAction={validateSubmitAction}
            />
          );
        case "Password":
          return (
            <UpdatePassword
              form={form}
              setDisabled={setDisabled}
              validateSubmitAction={validateSubmitAction}
            />
          );
        default:
          return "";
      }
    }
    return undefined;
  };

  return <div>{getFormBody(fieldName)}</div>;
};

interface UpdateClientInfoProps {
  show: boolean;
  title: any;
  subTitle: any;
  fieldName: string;
  onCancelText: string;
  onOkText: any;
  loading: boolean;
  onClickCancel: () => void;
  onClickOk: (data?: any) => void;
}

const UpdateClientInfoModal: React.FC<UpdateClientInfoProps> = ({
  show,
  title,
  subTitle,
  fieldName,
  onCancelText,
  onOkText,
  loading,
  onClickCancel,
  onClickOk
}) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState<boolean>(false);

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
      buttonOkDisabled={disabled}
      btnLoading={loading}
      description={
        <UpdateClientInfoModalBody
          form={form}
          fieldName={fieldName}
          setDisabled={setDisabled}
          validateSubmitAction={onClickOk}
        />
      }
    />
  );
};

export { UpdateClientInfoModal };
