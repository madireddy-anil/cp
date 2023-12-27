import {
  Modal,
  Form,
  Select,
  TextInput,
  Row,
  Col,
  TextareaInput,
  NumberInput,
  Colors,
  Text,
  Notification
} from "@payconstruct/design-system";
import styles from "./NewVendorAccount.module.css";
import React from "react";
import { Spacer } from "../../../../../components/Spacer/Spacer";
import { useAppSelector } from "../../../../../redux/hooks/store";
import { selectTimezone } from "../../../../../config/general/generalSlice";
import moment from "moment-timezone";
import { TimePicker } from "antd";
import copy from "copy-to-clipboard";
import { fractionFormat } from "../../../../../utilities/transformers";

export interface DepositDetailsForm {
  orderId: string;
  leg: "exchange" | "local";
  currency: string;
  vendorName: string;
  vendorId: string;
  expected?: string;
  remitted?: string;
  deposited?: string;
  accountNumber?: string;
  maxAmount?: number;
  minAmount?: number;
  notes?: string;
  instructions?: string;
}

interface NewVendorAccountBodyProps {
  viewOnly?: boolean;
  vendor: DepositDetailsForm;
  onAccountCreation: () => void;
  form?: any;
}

const ModalBody: React.FC<NewVendorAccountBodyProps> = ({
  viewOnly,
  form,
  vendor,
  onAccountCreation
}) => {
  const dateFormat = "HH:mm";
  const selectedTimezone = useAppSelector(selectTimezone);
  const TIMEZONE = moment().tz(selectedTimezone).format("(UTC Z) z");
  const timezonePlace = selectedTimezone.replace("_", " ");
  const formattedTimezone = TIMEZONE + ` (${timezonePlace})`;
  const formattedTime = moment();

  const initialValues = {
    ...vendor,
    timeZone: formattedTimezone,
    time: formattedTime
  };

  form.setFieldsValue(initialValues);

  return (
    <div className={styles["new-vendor-modal"]}>
      <Form form={form} initialValues={initialValues}>
        <Row gutter={15}>
          <Col span={24}>
            <Form.Item name={"vendorId"} hidden>
              <TextInput label="Vendor" required disabled={viewOnly} />
            </Form.Item>
            <Form.Item name={"currency"}>
              <Select
                aria-required
                disabled
                label="Currency"
                optionlist={[["THB", "THB"]]}
                placeholder="Select Options"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={15}>
          <Col span={24}>
            <Form.Item name={"accountNumber"}>
              <TextInput
                label={"Account number"}
                required
                disabled={viewOnly}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={15}>
          <Col span={24}>
            <Form.Item name={"expected"} hidden={!viewOnly}>
              <TextInput
                label={"Expected deposit amount"}
                required
                disabled={viewOnly}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={15}>
          <Col span={24}>
            <Form.Item name={"instructions"}>
              <TextareaInput
                name={"instructions"}
                type="textarea"
                label={"Bank deposit details"}
                required
                disabled={viewOnly}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={15}>
          <Col span={24}>
            <Form.Item name={"notes"}>
              <TextareaInput
                name={"notes"}
                label={"Notes"}
                placeholder={"Enter deposit notes"}
                disabled={viewOnly}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={15}>
          <Col span={12}>
            <Form.Item name={"minAmount"}>
              <NumberInput
                label={"Min. Transaction size"}
                required
                min={0}
                disabled={viewOnly}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"maxAmount"}>
              <NumberInput
                label={"Max. Transaction size"}
                required
                min={0}
                disabled={viewOnly}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={15}>
          <Col span={24}>
            <Text
              label="Transfer deadline"
              weight="bold"
              size="xsmall"
              color={Colors.grey.neutral900}
            />
            <Spacer size={10} />
          </Col>
        </Row>
        <Row gutter={15}>
          <Col span={18}>
            <Form.Item name={"timeZone"}>
              <Select
                label="TimeZone"
                disabled
                optionlist={[[formattedTimezone, formattedTimezone]]}
                placeholder="Select options"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={"time"}>
              <TimePicker
                disabled={viewOnly}
                size="large"
                format={dateFormat}
                style={{
                  width: "100%",
                  borderColor: Colors.grey.neutral200,
                  height: "46px",
                  borderRadius: "5px"
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

interface NewVendorAccountProps {
  viewOnly?: boolean;
  vendor: DepositDetailsForm;
  show: boolean;
  onClickCancel: () => void;
  onClickOk: (data?: any) => void;
}

const copyVendorDepositInfo = (info: DepositDetailsForm) => {
  const data = `
  ------------------------
  Deposit Information: 

  Currency: ${info.currency}
  Account Number: ${info.accountNumber}
  Amount to Deposit: ${fractionFormat(info.expected)}
  Min Transaction: ${fractionFormat(info.minAmount)}
  Max Transaction: ${fractionFormat(info.maxAmount)}
  Bank Deposit Details: \n\t- ${info.instructions?.replace(/\n/g, "\n\t  ")}
  Notes: \n\t- ${info.notes?.replace(/\n/g, "\n\t  ")}
  -------------------------
  `;

  copy(data, {
    onCopy: Notification({
      type: "info",
      message: "Copied Successfully"
    })
  });
};

const NewVendorAccount: React.FC<NewVendorAccountProps> = ({
  viewOnly,
  vendor,
  show,
  onClickCancel,
  onClickOk
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      modalView={show}
      title={viewOnly ? "Account Deposit Details" : "New Account"}
      onCancelText={"Cancel"}
      onOkText={viewOnly ? "Share" : "Create Account"}
      onClickCancel={onClickCancel}
      onClickOk={() => {
        if (viewOnly) {
          copyVendorDepositInfo(form.getFieldsValue());
          return;
        }
        form.submit();
      }}
      description={
        <ModalBody
          form={form}
          vendor={vendor}
          onAccountCreation={onClickOk}
          viewOnly={viewOnly}
        />
      }
    />
  );
};

export { NewVendorAccount };
