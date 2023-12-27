import { useIntl } from "react-intl";
import { Form, TextInput, Notification } from "@payconstruct/design-system";
import {
  useAppDispatch,
  useAppSelector
} from "../../../../../redux/hooks/store";
import { updateEmailAction } from "../../../../../config/auth/authSlice";
import {
  useUpdateEmailAddressMutation,
  useRefreshTokenMutation
} from "../../../../../services/authService";
import { fieldValidation } from "../../../../../config/transformer";
import { updateProfileLoader } from "../../../../../config/accountSetting/accountSettingSlice";
import { useEffect } from "react";

interface UpdateEmailProps {
  form?: any;
  setDisabled: (data?: any) => void;
}

const UpdateEmail: React.FC<UpdateEmailProps> = ({ form, setDisabled }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { email } = useAppSelector((state) => state.auth);
  const refreshToken = useAppSelector((state) => state.auth.refresh_token);
  const initialValues = {
    email: email
  } as { [key: string]: any };

  // Updating The Email Part
  const [updateEmailAddress] = useUpdateEmailAddressMutation();
  const [getRefreshAccessToken, { isSuccess: isRefreshTokenSuccess }] =
    useRefreshTokenMutation();

  useEffect(() => {
    if (isRefreshTokenSuccess) {
      dispatch(updateProfileLoader(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefreshTokenSuccess]);

  const onFormChange = () => {
    const values = form.getFieldsValue() as { email?: any };
    const { email } = values;
    const emailValidate = fieldValidation("email", email);
    if (emailValidate) {
      return setDisabled(false);
    }
    setDisabled(true);
  };

  const onFinish = async (formValues: any) => {
    const { email } = formValues;
    dispatch(updateEmailAction(email));
    dispatch(updateProfileLoader(true));
    try {
      await updateEmailAddress({ email })
        .unwrap()
        .then(() => {
          getRefreshAccessToken({
            refresh_token: refreshToken,
            isAccessTokenRequired: true
          });
        });
      Notification({
        type: "success",
        message: intl.formatMessage({ id: "emailUpdateSuccessMsg" })
      });
      form.resetFields();
      setDisabled(false);
    } catch (err: any) {
      dispatch(updateProfileLoader(false));
      Notification({
        type: "error",
        message: intl.formatMessage({ id: "emailUpdateErrMsg" })
      });
    }
  };

  return (
    <Form
      id="myForm"
      form={form}
      initialValues={initialValues}
      onFieldsChange={onFormChange}
      onFinish={onFinish}
    >
      <Form.Item name={"email"}>
        <TextInput
          key="email"
          type={"email"}
          name={"email"}
          label={intl.formatMessage({ id: "email" })}
          message={intl.formatMessage({ id: "emailErrorMsg" })}
          floatingLabel={true}
          placeholder={"Enter email"}
        />
      </Form.Item>
    </Form>
  );
};

// Export need to be default for code Splitting
// https://reactjs.org/docs/code-splitting.html#route-based-code-splitting
export { UpdateEmail as default };
