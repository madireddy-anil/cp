import React, { useContext } from "react";
import { useIntl } from "react-intl";
import { Modal as DSModal, Button, Text } from "@payconstruct/design-system";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks/store";
import { updateNotificationModal } from "../../../../config/approval/approvalSlice";
import { ModalProps } from "../../Approval.Interface";
import { ApprovalsContext } from "../../ApprovalsContext/ApprovalsProvider";

const NotificationModal: React.FC<ModalProps> = ({
  show,
  title,
  text,
  textOne,
  modalType
}) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  show = useAppSelector((state) => state.approval.notificationModal.show);
  title = useAppSelector((state) => state.approval.notificationModal.title);
  modalType = useAppSelector(
    (state) => state.approval.notificationModal.modalType
  );
  text = useAppSelector((state) => state.approval.notificationModal.text);
  textOne = useAppSelector((state) => state.approval.notificationModal.textOne);

  const { refetchApprovalConfig } = useContext(ApprovalsContext);

  return (
    <>
      <DSModal
        title={intl.formatMessage({ id: title })}
        type={modalType}
        modalView={show}
        modalWidth={650}
        description={
          <>
            <Text
              size="medium"
              label={intl.formatMessage({
                id: text
              })}
            />
            {textOne && (
              <>
                <br />
                <br />
                <Text
                  size="medium"
                  label={intl.formatMessage({
                    id: textOne
                  })}
                />
              </>
            )}
          </>
        }
        customButtons={
          <Button
            type={modalType === "success" ? "primary" : "secondary"}
            label="Done"
            onClick={() => {
              refetchApprovalConfig();
              dispatch(
                updateNotificationModal({ show: false, title: "o", text: "o" })
              );
            }}
          />
        }
      />
    </>
  );
};

export default NotificationModal;
