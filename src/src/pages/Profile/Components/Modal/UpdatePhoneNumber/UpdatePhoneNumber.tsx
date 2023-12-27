import React from "react";
import { useIntl } from "react-intl";
import {
  Alert,
  Form,
  TextInput,
  Select,
  Notification
} from "@payconstruct/design-system";
import {
  useAppDispatch,
  useAppSelector
} from "../../../../../redux/hooks/store";
import { updatePhoneNumberAction } from "../../../../../config/auth/authSlice";
import { useUpdatePhoneNumberMutation } from "../../../../../services/authService";
import {
  fieldValidation,
  validationOnData
} from "../../../../../config/transformer";
import { updateProfileLoader } from "../../../../../config/accountSetting/accountSettingSlice";

interface UpdatePhoneNumberProps {
  form?: any;
  setDisabled: (data?: any) => void;
  validateSubmitAction: () => void;
}

const UpdatePhoneNumber: React.FC<UpdatePhoneNumberProps> = ({
  form,
  setDisabled,
  validateSubmitAction
}) => {
  // Global State Part
  const patternForPhone = new RegExp("^[0-9]*$");
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const { profile } = useAppSelector((state) => state.auth);
  const selectedEntityId = validationOnData(profile?.id, "string");
  const { phoneNumber } = useAppSelector((state: any) => state.auth);
  const { phoneNumberCountryCode: phoneNumberPrefix } = useAppSelector(
    (state) => state.auth
  );
  const { countries } = useAppSelector((state) => state.countries);
  const initialValues = {
    phone: phoneNumber
  } as { [key: string]: any };

  // Updating The PhoneNumber Part
  const [updatePhoneNumber] = useUpdatePhoneNumberMutation();

  const onFormChange = () => {
    const values = form.getFieldsValue() as { phone?: any };
    const { phone } = values;
    const phoneValidate = fieldValidation("phoneNumber", phone);
    phoneValidate ? setDisabled(false) : setDisabled(true);
  };

  const onFinish = async (formValues: any) => {
    const { phoneNumberCountryCode, phone } = formValues;
    formValues.phoneNumberPrefix = phoneNumberCountryCode
      ? phoneNumberCountryCode
      : phoneNumberPrefix;
    // const phoneNumber = (phoneNumberCountryCode || "+44").concat(phone);
    console.log(formValues, "FORM_VALUES");
    const data = formValues;

    dispatch(updatePhoneNumberAction({ phoneNumberCountryCode, phone }));
    dispatch(updateProfileLoader(true));
    try {
      await updatePhoneNumber({
        id: selectedEntityId,
        data
      })
        .unwrap()
        .then(() => {
          dispatch(updateProfileLoader(false));
        });
      Notification({
        type: "success",
        message: intl.formatMessage({ id: "phoneNoUpdateSuccessMsg" })
      });
      form.resetFields();
      setDisabled(false);
      validateSubmitAction();
    } catch (err: any) {
      dispatch(updateProfileLoader(false));
      Notification({
        type: "error",
        message: intl.formatMessage({ id: "passwordChangedSuccessMsg" })
      });
    }
  };

  const phoneTypeOptions = countries.map((option: any) => {
    return {
      value: `+${option.telephonePrefix}`,
      label: `+${option.telephonePrefix}`
    };
  });

  const PhoneTypeSelect = (
    <Form.Item name={"phoneNumberCountryCode"} noStyle>
      <Select
        defaultValue={
          <span>{phoneNumberPrefix ? phoneNumberPrefix : "+44"}</span>
        }
        options={phoneTypeOptions}
      />
    </Form.Item>
  );

  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFieldsChange={onFormChange}
      onFinish={onFinish}
    >
      <Form.Item name={"phone"}>
        <TextInput
          key="phone"
          type={"text"}
          name={"phoneNumber"}
          label={"Phone Number"}
          message={"Please input your Phone Number!"}
          floatingLabel={true}
          required={true}
          pattern={patternForPhone}
          addonBefore={PhoneTypeSelect}
        />
      </Form.Item>
      <Alert
        type="info"
        message="Your phone number can be used to deliver important notifications."
      />
    </Form>
  );
};

// Export need to be default for code Splitting
// https://reactjs.org/docs/code-splitting.html#route-based-code-splitting
export { UpdatePhoneNumber as default };
