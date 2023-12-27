import React from "react";
import { useIntl } from "react-intl";
import {
  Text,
  Form,
  Button,
  Modal as DSModal
} from "@payconstruct/design-system";
import { useAppDispatch } from "../../../../redux/hooks/store";
import { Spacer } from "../../../../components/Spacer/Spacer";
import { PaymentModal } from "../../../../enums/Approval";
import {
  approvePayment,
  rejectPayment
} from "../../../../services/approvalService/actions";
interface GroupProps {
  show: boolean;
  modalType: string;
  title?: string;
  paymentId: string;
  isLoading: boolean;
  toggleShow: (value: boolean) => void;
}
const AcceptRejectPayment: React.FC<GroupProps> = ({
  show,
  modalType = PaymentModal.Approve,
  isLoading,
  paymentId,
  toggleShow
}) => {
  const [form] = Form.useForm();
  // const dispatch = useAppDispatch();
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const handlePayment = () => {
    if (modalType === PaymentModal.Approve) {
      dispatch(approvePayment(paymentId));
    } else {
      dispatch(rejectPayment(paymentId));
    }
  };

  const getCustomButtons = () => {
    return (
      <div>
        <Button
          style={{ marginRight: "15px" }}
          type="secondary"
          label={intl.formatMessage({ id: "cancel" })}
          onClick={() => toggleShow(false)}
          disabled={isLoading}
        />
        <Button
          type="primary"
          icon={{
            name: modalType === PaymentModal.Approve ? "check" : "x",
            position: "left"
          }}
          label={
            modalType === PaymentModal.Approve
              ? "Approve Payment"
              : "Reject Payment"
          }
          loading={isLoading}
          onClick={handlePayment}
        />
      </div>
    );
  };

  const APPROVE_PAYMENT_MESSAGES = (
    <div>
      <Text
        size="medium"
        label="Please check the details of this payment thoroughly before approving this payment. "
      />
      <Text
        size="medium"
        weight="bold"
        label="Once approved, the decision cannot be reversed."
      />
      <Spacer size={20} />
      <Text
        size="medium"
        weight="bold"
        label={intl.formatMessage({
          id: "approvePaymentWarning"
        })}
      />
    </div>
  );

  const REJECT_PAYMENT_MESSAGES = (
    <>
      <Text
        size="medium"
        weight="bold"
        label="Once rejected, the decision cannot be reversed."
      />
      <br />
      <Spacer size={10} />
      <Text
        size="medium"
        label={intl.formatMessage({
          id: "rejectPaymentWarning"
        })}
      />
    </>
  );

  return (
    <>
      <DSModal
        title={
          modalType === PaymentModal.Approve
            ? intl.formatMessage({
                id: "approvePaymentTitle"
              })
            : intl.formatMessage({
                id: "rejectPaymentTitle"
              })
        }
        onClickOk={() => form.submit()}
        onClickCancel={() => toggleShow(false)}
        type="warning"
        modalView={show}
        modalWidth={650}
        description={
          <div>
            {modalType === PaymentModal.Approve
              ? APPROVE_PAYMENT_MESSAGES
              : REJECT_PAYMENT_MESSAGES}
          </div>
        }
        customButtons={getCustomButtons()}
      />
    </>
  );
};

export default AcceptRejectPayment;
