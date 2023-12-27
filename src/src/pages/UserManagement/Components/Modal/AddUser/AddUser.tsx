import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import {
  Modal,
  Form,
  Select,
  Text,
  TextInput
} from "@payconstruct/design-system";
import {
  useAppSelector,
  useAppDispatch
} from "../../../../../redux/hooks/store";
import {
  updateFormValue,
  updateAddUserShow
} from "../../../../../config/userManagement/userManagementSlice";
import { Roles } from "../../../../../services/userManagementService";
import { sortData } from "../../../../../config/transformer";
import style from "../../../style.module.css";
import { formatRoleText } from "../../../../Trades/Helpers/roles";

interface AddUserModalProps {
  show: boolean;
  title: string;
  form: any;
  roles: Roles[];
  onCancelText: string;
  onOkText: string;
  onClickCancel: () => void;
  onClickOk: (data?: any) => void;
  refetchUserList: () => void;
  toggleShow: (value: boolean) => void;
  onChangeHandler: (value: string) => void;
}

interface FormFields {
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
}

const AddUser: React.FC<AddUserModalProps> = ({
  show,
  title,
  form,
  roles,
  onCancelText,
  onOkText,
  onClickCancel,
  onChangeHandler
}) => {
  roles = roles?.slice().sort(sortData);
  const dispatch = useAppDispatch();

  /* Global State */
  const { initialFormData } = useAppSelector((state) => state.userManagement);

  const [formState, setFormState] = useState<FormFields>({
    firstName: "",
    lastName: "",
    email: "",
    roleId: ""
  });

  // Set the Initial form Values for Website Modal
  useEffect(() => {
    if (initialFormData) {
      form.setFieldsValue(initialFormData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, initialFormData]);

  const hasWhiteSpace = (s: string) => {
    return /^[-a-zA-Z]+(\s+[^\s]+)*$/.test(s);
  };

  const validateDisableButton = () => {
    let btnStatus: boolean = true;
    btnStatus =
      formState?.firstName &&
      formState?.lastName &&
      formState?.email &&
      formState?.roleId &&
      hasWhiteSpace(formState.firstName) &&
      hasWhiteSpace(formState.lastName)
        ? false
        : true;
    return btnStatus;
  };

  const editUserModalBody = () => {
    /* Update Users Details*/
    const onFinish = async (formValues: FormFields) => {
      dispatch(updateAddUserShow(false));
      dispatch(updateFormValue(formValues));
    };

    const onFieldsChange = (item: any) => {
      setFormState((prev: any) => ({
        ...prev,
        [item[0]?.name[0]]: item[0]?.value
      }));
    };

    const roleTypeOptions: any = roles?.map((option: Roles) => {
      return [option.id, formatRoleText(option.name)];
    });

    const ERROR = (
      <div className={style["adduser-err"]}>
        This field must include at least one letter and must start with a
        letter.
      </div>
    );

    return (
      <>
        <Form
          form={form}
          initialValues={{
            phoneNumberPrefix: "United Kingdom"
          }}
          onFinish={onFinish}
          onFieldsChange={onFieldsChange}
        >
          <Row>
            <Col span={24}>
              <Form.Item name={"firstName"}>
                <TextInput
                  type={"text"}
                  name={"firstName"}
                  label={"Name"}
                  message={" "}
                  floatingLabel={true}
                />
              </Form.Item>
              {formState?.firstName && !hasWhiteSpace(formState.firstName)
                ? ERROR
                : ""}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name={"lastName"}>
                <TextInput
                  type={"text"}
                  name={"lastName"}
                  label={"Surname"}
                  message={" "}
                  floatingLabel={true}
                />
              </Form.Item>
              {formState?.lastName && !hasWhiteSpace(formState.lastName)
                ? ERROR
                : ""}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name={"email"}>
                <TextInput
                  type="email"
                  name={"email"}
                  label={"Email"}
                  message={
                    "This field must contain letters, symbols and numbers only"
                  }
                  floatingLabel={true}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name={"roleId"}
                rules={[
                  {
                    required: true,
                    message: <Text label="Role is required!" size="xxsmall" />
                  }
                ]}
              >
                <Select
                  label={"Role"}
                  placeholder={"Select role"}
                  style={{ marginBottom: "-30px" }}
                  optionlist={roleTypeOptions}
                  onChange={onChangeHandler}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </>
    );
  };

  return (
    <Modal
      modalView={show}
      modalWidth={500}
      title={title}
      onCancelText={onCancelText}
      onOkText={onOkText}
      onClickCancel={() => {
        onClickCancel();
        form.resetFields();
      }}
      onClickOk={() => form.submit()}
      description={editUserModalBody()}
      buttonOkDisabled={validateDisableButton()}
    />
  );
};

export { AddUser };
