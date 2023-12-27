import React from "react";
import { Modal as DSModal, Button, Text } from "@payconstruct/design-system";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks/store";
import { updateNotificationModal } from "../../../../config/userManagement/userManagementSlice";
import { ModalProps } from "../../UserManagement.Interface";

const NotificationModal: React.FC<ModalProps> = ({
  show,
  title,
  noteOne,
  noteTwo,
  modalType
}) => {
  const dispatch = useAppDispatch();

  show = useAppSelector((state) => state.userManagement.notificationModal.show);
  title = useAppSelector(
    (state) => state.userManagement.notificationModal.title
  );
  modalType = useAppSelector(
    (state) => state.userManagement.notificationModal.modalType
  );
  noteOne = useAppSelector(
    (state) => state.userManagement.notificationModal.noteOne
  );
  noteTwo = useAppSelector(
    (state) => state.userManagement.notificationModal.noteTwo
  );

  return (
    <>
      <DSModal
        title={title}
        type={modalType}
        modalView={show}
        modalWidth={650}
        description={
          <>
            <Text size="medium" label={noteOne} />
            <br />
            {noteTwo && (
              <>
                <br />
                <Text size="medium" label={noteTwo} />
              </>
            )}
          </>
        }
        customButtons={
          <Button
            type={modalType === "success" ? "primary" : "secondary"}
            label="Done"
            onClick={() =>
              dispatch(
                updateNotificationModal({
                  show: false,
                  title: "o",
                  noteOne: "o"
                })
              )
            }
          />
        }
      />
    </>
  );
};

export default NotificationModal;
