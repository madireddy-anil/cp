import {
  Colors,
  Modal,
  Text,
  Form,
  Upload,
  Row,
  Col,
  Spin,
  Notification
} from "@payconstruct/design-system";
import { DeleteOutlined } from "@ant-design/icons";

import moment from "moment";
import { Spacer } from "../../../../../components/Spacer/Spacer";
import styles from "./ReceiptModal.module.css";
import React, { useState } from "react";
import { useAuth } from "../../../../../redux/hooks/useAuth";
import {
  dummyRequest,
  handleUploadFiles,
  checkFileType
} from "../../../Helpers/imageUploader";
import { fieldCurrencyFormatter } from "../../../../../utilities/transformers";
import { UploadChangeParam } from "antd/lib/upload/interface";
import { OrderDepositDetails } from "../../../../../services/ExoticFX/Finance/financeService";

interface ReceiptModalBodyProps {
  deposit: OrderDepositDetails;
  loading: boolean;
  onChangeAmount: (value: string) => void;
  setDocuments: (data: string[]) => void;
  setLoading: (checked: boolean) => void;
}

const ModalBody: React.FC<ReceiptModalBodyProps> = ({
  deposit,
  onChangeAmount,
  setDocuments,
  setLoading,
  loading
}) => {
  const { auth } = useAuth();
  const { depositDocument } = deposit;
  const fileCount = depositDocument.length;
  const maxUploadSize = 10 - fileCount;

  const UploadOnChange = (info: UploadChangeParam) => {
    const {
      fileList,
      file: { name }
    } = info;

    const isFileIncluded = fileList.filter((file) => file.name === name);
    const isFileRemoved = isFileIncluded.length === 0;
    const getFileListSize = fileList.length;

    if (getFileListSize >= maxUploadSize && isFileRemoved) {
      Notification({
        message: "Maximum 10 files are allowed",
        description: "Please remove some files to upload new ones",
        type: "error"
      });
      return;
    }

    handleUploadFiles(info, deposit, auth.token, setLoading, setDocuments);
  };

  const initialValues = {
    sell: deposit.currency,
    amount: fieldCurrencyFormatter(0, deposit.currency),
    expected: fieldCurrencyFormatter(deposit.expected, deposit.currency),
    date: moment()
  };

  return (
    <div className={styles["receipt-modal"]}>
      <Form initialValues={initialValues}>
        <Row gutter={15}>
          <Col span={24}>
            <Text
              label="Optional Document"
              weight="bold"
              size="xsmall"
              color={Colors.grey.neutral900}
            />
            <Spacer size={5} />
            <div style={{ display: "inline-block", width: "100%" }}>
              <Upload
                accept="png, jpg, jpeg, pdf"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={checkFileType}
                listSize="standard"
                listType="text"
                maxCount={maxUploadSize}
                multiple={true}
                // @ts-ignore
                customRequest={dummyRequest}
                onChange={UploadOnChange}
                showUploadList={{
                  removeIcon: loading ? <Spin /> : <DeleteOutlined />,
                  showRemoveIcon: true
                }}
              >
                <p>
                  Drag-n-drop here or{" "}
                  <b style={{ color: Colors.blue.blue500 }}>Upload</b> file from
                  your PC
                </p>
                {loading && <Spin />}
              </Upload>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

interface ReceiptModalProps {
  documents: string[];
  loading: boolean;
  onClickCancel: () => void;
  onClickOk: (data?: any) => void;
  setDocuments: (data?: any) => void;
  deposit: any;
  setLoading: (checked: boolean) => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({
  onClickCancel,
  onClickOk,
  setDocuments,
  setLoading,
  loading,
  deposit
}) => {
  const [amount, setAmount] = useState("");

  return (
    <Modal
      modalView={true}
      title={"Upload Receipt"}
      subTitle={"Maximum 10 files can be uploaded (png, jpg, jpeg, pdf only)"}
      onCancelText={"Cancel"}
      onOkText={"Upload Receipt"}
      buttonOkDisabled={loading}
      onClickCancel={() => {
        onClickCancel();
      }}
      onClickOk={() => {
        onClickOk({ amount });
      }}
      description={
        <ModalBody
          setLoading={setLoading}
          loading={loading}
          onChangeAmount={(value) => setAmount(value)}
          deposit={deposit}
          setDocuments={setDocuments}
        />
      }
    />
  );
};

export { ReceiptModal };
