import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import {
  Text,
  Form,
  Checkbox,
  Modal as DSModal
} from "@payconstruct/design-system";
import { useAppDispatch } from "../../../../redux/hooks/store";
import { Spacer } from "../../../../components/Spacer/Spacer";
import { toggleOffRule } from "../../../../services/approvalService/actions";

import style from "../../style.module.css";
interface GroupProps {
  show: boolean;
  isLoading: boolean;
  toggleShow: (value: boolean) => void;
}
const DeactivateApprovalRule: React.FC<GroupProps> = ({
  show,
  isLoading,
  toggleShow
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const [isAcceptedToDeactivate, setToDeactivateApproval] =
    useState<boolean>(true);
  const [isChecked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    setChecked(false);
    form.resetFields();
  }, [form, show]);

  useEffect(() => {
    setToDeactivateApproval(true);
  }, [setToDeactivateApproval, show]);

  const acceptDeactivationRule: any = (
    <div className={style["approval__deactivate-ruleNote"]}>
      {intl.formatMessage({
        id: "deactivateApprovalAccept"
      })}
    </div>
  );

  const deactivateApprovalRule = (e: any) => {
    const isAccepted = e.target.checked;
    setChecked(isAccepted);
    setToDeactivateApproval(!isAccepted);
  };

  const deactivateRule = () => {
    dispatch(toggleOffRule());
  };

  return (
    <>
      <DSModal
        title={intl.formatMessage({
          id: "deactivateApprovalTitle"
        })}
        onCancelText={intl.formatMessage({ id: "cancel" })}
        onOkText="Confirm Deactivation"
        onClickOk={() => form.submit()}
        onClickCancel={() => toggleShow(false)}
        type="warning"
        modalView={show}
        modalWidth={650}
        buttonOkDisabled={isAcceptedToDeactivate}
        btnLoading={isLoading}
        description={
          <div>
            <Text
              size="medium"
              label={intl.formatMessage({
                id: "deactivateApprovalNote"
              })}
            />
            <br />
            <Text
              size="medium"
              label="Are you sure you want to deactivate it?"
            />
            <Spacer size={20} />
            <Text
              size="medium"
              weight="bold"
              label={intl.formatMessage({
                id: "deactivateApprovalWarning"
              })}
            />
            <br />
            <Spacer size={20} />
            <Form
              id="myForm"
              form={form}
              onFinish={deactivateRule}
              initialValues={{
                isAcceptedToDeactivate: isChecked
              }}
            >
              <Form.Item
                name={"isAcceptedToDeactivate"}
                valuePropName="checked"
              >
                <Checkbox
                  onChange={deactivateApprovalRule}
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

export default DeactivateApprovalRule;
