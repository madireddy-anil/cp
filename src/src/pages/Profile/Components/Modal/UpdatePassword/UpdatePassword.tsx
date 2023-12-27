import { useIntl } from "react-intl";
import { Form, TextInput, Notification } from "@payconstruct/design-system";
import {
  useAppSelector,
  useAppDispatch
} from "../../../../../redux/hooks/store";
import { useChangePasswordMutation } from "../../../../../services/authService";
import { fieldValidation } from "../../../../../config/transformer";
import { updateProfileLoader } from "../../../../../config/accountSetting/accountSettingSlice";
import Styles from "./updatePassword.module.css";

interface UpdatePasswordProps {
  form?: any;
  setDisabled: (data?: any) => void;
  validateSubmitAction: () => void;
}

const UpdatePassword: React.FC<UpdatePasswordProps> = ({
  form,
  setDisabled,
  validateSubmitAction
}) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const { token } = useAppSelector((state) => state.auth);

  // Global State Part
  const patternForPwd = new RegExp(
    "^^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{8,1000}$"
  );

  // Updating The Password Part
  const [changePassword] = useChangePasswordMutation();

  const onFormChange = () => {
    const values = form.getFieldsValue() as {
      newPassword?: any;
      confirmPassword?: any;
    };
    const { newPassword, confirmPassword } = values;
    const newPasswordValidate = fieldValidation("password", newPassword);
    const confirmPasswordValidate = fieldValidation(
      "password",
      confirmPassword
    );
    newPassword === confirmPassword &&
    newPasswordValidate &&
    confirmPasswordValidate
      ? setDisabled(false)
      : setDisabled(true);
  };

  const onFinish = async (formValues: any) => {
    const { newPassword, confirmPassword } = formValues;
    const formatData = {
      newPassword: newPassword,
      confirmPassword: confirmPassword,
      token: token
    };
    dispatch(updateProfileLoader(true));
    try {
      await changePassword(formatData)
        .unwrap()
        .then(() => {
          dispatch(updateProfileLoader(false));
        });
      Notification({
        type: "success",
        message: intl.formatMessage({ id: "passwordChangedSuccessMsg" })
      });
      form.resetFields();
      setDisabled(false);
      validateSubmitAction();
    } catch (err: any) {
      dispatch(updateProfileLoader(false));
      Notification({
        type: "error",
        message: intl.formatMessage({ id: "passwordChangedErrorMsg" })
      });
    }
  };

  return (
    <div className={Styles["update__pwdForm"]}>
      <Form form={form} onFieldsChange={onFormChange} onFinish={onFinish}>
        <Form.Item name={"newPassword"}>
          <TextInput
            type={"password"}
            name={"newPassword"}
            label={intl.formatMessage({ id: "newPassword" })}
            message={intl.formatMessage({ id: "passwordErrorMsg" })}
            floatingLabel={true}
            pattern={patternForPwd}
          />
        </Form.Item>
        <Form.Item name={"confirmPassword"} style={{ margin: 0 }}>
          <TextInput
            type={"password"}
            name={"confirmPassword"}
            label={intl.formatMessage({ id: "confirmPassword" })}
            message={intl.formatMessage({ id: "passwordErrorMsg" })}
            floatingLabel={true}
            pattern={patternForPwd}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

// Export need to be default for code Splitting
// https://reactjs.org/docs/code-splitting.html#route-based-code-splitting
export { UpdatePassword as default };
