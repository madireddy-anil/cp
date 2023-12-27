import React from "react";
import { TwoFaSetup, Notification } from "@payconstruct/design-system";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/store";
import { useIntl } from "react-intl";
import {
  useTwoFactorAuthenticationMutation,
  useVerfiyMFACodeMutation
  // useDisableTwoFAQrCodeMutation
} from "../../../services/authService";
// import { showSetupMFAModalAction } from "../../../config/auth/authSlice";
import { updateCanFetchAPI } from "../../../config/company/companySlice";
import { useAuth } from "../../../redux/hooks/useAuth";

interface TwoFactorAuthProps {
  show: boolean;
  verificationStage: string;
  setSelected?: (e: boolean) => void;
}

export const SetupTwoFactorAuth: React.FC<TwoFactorAuthProps> = ({
  show,
  verificationStage,
  setSelected
}) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { auth } = useAuth();

  const { email, barcodeUri } = useAppSelector((state) => state.auth);
  const twoFactorRcoveryCode = useAppSelector(
    (state) => state.auth.recovery_codes
  );

  const [settingsTwoFactorAuth, { isLoading: settingsOTPLoading }] =
    useVerfiyMFACodeMutation();
  const [loginTwoFactorAuth, { isLoading: loginOTPLoading }] =
    useTwoFactorAuthenticationMutation();

  const onSubmit = async (code: string) => {
    try {
      (await verificationStage) === "login"
        ? loginTwoFactorAuth({
            mfa_token: auth.mfa_token,
            email,
            code
          })
            .unwrap()
            .then(() => {
              dispatch(updateCanFetchAPI(false));
            })
        : settingsTwoFactorAuth({
            refreshToken: auth.refresh_token,
            otp: code
          })
            .unwrap()
            .then(() => {
              dispatch(updateCanFetchAPI(false));
            });
    } catch (err) {
      Notification({
        message: intl.formatMessage({ id: "mfaError" }),
        description: intl.formatMessage({ id: "mfaErrorDescription" }),
        type: "error"
      });
    }
  };

  // const [disableTwoFAQrCode, { isLoading }] = useDisableTwoFAQrCodeMutation();
  const modalShowCancel = (e: any) => {
    // if (verificationStage === "settings" && isMfaSwitchToggled) {
    //   disableTwoFAQrCode({
    //     authenticatorTypes: ["otp"]
    //   })
    //     .unwrap()
    //     .then(() => {
    //       dispatch(showSetupMFAModalAction(false));
    //       setSelected?.(false);
    //       dispatch(updateCanFetchAPI(false));
    //     });
    // } else {
    //   dispatch(showSetupMFAModalAction(false));
    // }

    console.log("DO_NOTHING_ON_CANCEL_ACTION");
    // do nothing on cancel------Need to enhance from BE
  };

  return (
    <TwoFaSetup
      key="2FA"
      title={intl.formatMessage({ id: "mfaModalTitle" })}
      token={barcodeUri}
      setupDescription={intl.formatMessage({ id: "setupMfaSubDescription" })}
      description={intl.formatMessage({ id: "setupMfaDescription" })}
      onTryAgainLater={() => {
        console.log("Try Again click");
      }}
      btnLoading={loginOTPLoading || settingsOTPLoading}
      show={show}
      titleForRecoveryCodes="Recovery code"
      RecoveryCodes={twoFactorRcoveryCode}
      modalShowCancel={modalShowCancel}
      onSubmit={onSubmit}
      // @ts-ignore
      // cancelBtnLoading={isLoading}
    />
  );
};
