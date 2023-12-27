import React from "react";
import { useIntl } from "react-intl";
import { Modal as DSModal, Text } from "@payconstruct/design-system";
import { MessageModal } from "../../../../enums/Approval";

interface GroupProps {
  show: boolean;
  modalType: string;
  toggleShow: (value: boolean) => void;
}
const Message: React.FC<GroupProps> = ({
  show,
  modalType = MessageModal.Success,
  toggleShow
}) => {
  const intl = useIntl();

  return (
    <>
      <DSModal
        title={
          modalType === MessageModal.Success
            ? intl.formatMessage({
                id: "addRuleSuccessTitle"
              })
            : intl.formatMessage({
                id: "addRuleErrorTitle"
              })
        }
        onOkText="Done"
        type={modalType === MessageModal.Success ? "success" : "error"}
        modalView={show}
        modalWidth={650}
        onClickOk={() => toggleShow(false)}
        description={
          <div style={{ marginTop: "-5px" }}>
            {modalType === MessageModal.Success ? (
              <>
                <Text
                  size="medium"
                  label={intl.formatMessage({
                    id: "addRuleSuccessNoteOne"
                  })}
                />{" "}
                <br />
                <Text
                  size="medium"
                  label={intl.formatMessage({
                    id: "addRuleSuccessNoteTwo"
                  })}
                />
              </>
            ) : (
              <Text
                size="medium"
                label={intl.formatMessage({
                  id: "addRuleErrorNote"
                })}
              />
            )}
          </div>
        }
      />
    </>
  );
};

export default Message;
