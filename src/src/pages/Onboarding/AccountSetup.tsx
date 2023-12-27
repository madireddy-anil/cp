import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import {
  ActivationPage as AccountSetup,
  Notification,
  Modal,
  Form,
  Input,
  Switch,
  Spin
} from "@payconstruct/design-system";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/store";
import {
  updateMenuShow,
  updateTopBarShow
} from "../../config/general/generalSlice";

import { useAuth } from "../../redux/hooks/useAuth";

// import {
//   api,
//   useGetDocumentQuestionsQuery
// } from "../../services/documentService";

import {
  // api as countryApi
  useGetProductsQuery
} from "../../services/companyService";

import {
  UpdateEmailRequest,
  useUpdateEmailAddressMutation,
  useGetProfileQuery,
  useGetUserByIdQuery
} from "../../services/authService";

import { showSetupMFAModalAction } from "../../config/auth/authSlice";
import { updateCanFetchAPI } from "../../config/company/companySlice";
import { SetupTwoFactorAuth } from "../../components/Modals/SetupTwoFactorAuth/SetupTwoFactorAuth";
import LiveChat from "../../config/plugins/LiveChat";

import {
  useResendEmailMutation,
  useGetTwoFAQrCodeMutation
} from "../../services/authService";

import { generateRandomName } from "../../config/transformer";

const Account = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  let navigate = useNavigate();

  useEffect(() => {
    dispatch(updateMenuShow(true));
  }, [dispatch]);

  const [formUpdateEmailState, setUpdateEmailFormState] =
    useState<UpdateEmailRequest>({
      email: ""
    });
  const isEntitySwitched = useAppSelector(
    (state) => state.auth.isEntitySwitched
  );

  const [modalView, setModalView] = useState(false);
  const [emailUpdateLoader, setEmailUpdatedLoader] = useState(false);
  // const [getRequiredDocuments] = useState(generateRandomName);
  const [getBrands] = useState(generateRandomName);
  // const [getProfile] = useState(generateRandomName);

  const { auth } = useAuth();
  const {
    email,
    firstName,
    token,
    emailVerified,
    showSetupMFAModal,
    isMFAset
  } = auth;

  const [isButtonDisabled, setButtonDisabled] = useState<boolean | undefined>(
    false
  );
  const [mfaMode]: any = useState(isMFAset);
  const [switchToggle, setSwitchToggle]: any = useState(false);
  const canFetchAPI = useAppSelector((state) => state.company.canFetchAPI);
  const userId = useAppSelector((state) => state.auth.id);
  const { progressLogs } = useAppSelector((state) => state.company);
  const {
    isCompanyInformationDone,
    isCompanyRequirementsDone,
    isOperationInformationDone,
    isRegulatoryInformationDone,
    isDocumentsUploadedDone,
    isCompanyStakeholdersAddedDone
  } = progressLogs;

  const overAllAboutCompanyStatus =
    isCompanyInformationDone &&
    isCompanyRequirementsDone &&
    isOperationInformationDone &&
    isRegulatoryInformationDone;

  const overAllDocumentsAndShareholders =
    isDocumentsUploadedDone && isCompanyStakeholdersAddedDone;

  useGetProductsQuery(getBrands, {
    refetchOnMountOrArgChange: 5,
    skip: token === null || canFetchAPI
  });

  // useGetDocumentQuestionsQuery(getRequiredDocuments, {
  //   refetchOnMountOrArgChange: 5,
  //   skip: token === null || canFetchAPI
  // });

  const [resendEmailLink] = useResendEmailMutation();
  const [
    updateEmailAddress,
    { isSuccess: isEmailUpdated, isError: updateEmailFail }
  ] = useUpdateEmailAddressMutation();

  // Profile Fix
  const { isLoading: isProfileLoading } = useGetProfileQuery("Profile", {
    skip: isEntitySwitched === true
  });

  useGetUserByIdQuery(userId);

  useEffect(() => {
    if (isEmailUpdated) {
      setModalView(false);
      Notification({
        type: "success",
        message: intl.formatMessage({ id: "emailUpdateSuccessMsg" })
      });
      // getProfile();
    }
    if (updateEmailFail) {
      setModalView(false);
      Notification({
        type: "error",
        message: intl.formatMessage({ id: "emailUpdateErrMsg" })
      });
    }
    // eslint-disable-next-line
  }, [isEmailUpdated, updateEmailFail]);

  const handleVerifyDirectorAndUploadLink = () => {
    dispatch(updateTopBarShow(true));
    navigate("/account-setup/upload-documents");
  };

  const [getTwoFAQrCode, { isLoading }] = useGetTwoFAQrCodeMutation();

  const onChangeTwoFactorSetup = (isEnable: boolean) => {
    dispatch(updateCanFetchAPI(true));
    if (isEnable) {
      getTwoFAQrCode({
        useMfa: isEnable,
        authenticatorTypes: ["otp"]
      })
        .unwrap()
        .then(() => {
          dispatch(showSetupMFAModalAction(isEnable));
        });
      setSwitchToggle(isEnable);
    }
  };

  const handleAboutCompanyLink = () => {
    dispatch(updateTopBarShow(true));
    navigate("/account-setup/company-details");
  };
  const handleResendEmail = async () => {
    try {
      await resendEmailLink({
        email
      }).unwrap();
      Notification({
        message: intl.formatMessage({ id: "Email sent successfully!" }),
        type: "success"
      });
    } catch (err) {
      Notification({
        message: intl.formatMessage({ id: "emailVerifiedMsg" }),
        type: "warning"
      });
    }
  };
  const handleResendEmailLink = () => {
    if (emailVerified) {
      Notification({
        message: intl.formatMessage({ id: "emailVerifiedMsg" }),
        type: "warning"
      });
    } else {
      handleResendEmail();
    }
    setButtonDisabled(true);
    setTimeout(() => {
      setButtonDisabled(false);
    }, 30000);
  };

  const handleUpdateEmailAddress = () => {
    // setModalView(true);
    navigate("/user/profile");
  };

  const onClickOkHandler = () => {
    setEmailUpdatedLoader(true);
    if (formUpdateEmailState.email !== email) {
      updateEmailAddress(formUpdateEmailState)
        .unwrap()
        .then(() => {
          setEmailUpdatedLoader(false);
        });
    } else {
      setEmailUpdatedLoader(false);
      Notification({
        message: "Use different email!",
        description: "Email already in use!",
        type: "warning"
      });
    }
  };

  const onClickCancelHandler = () => {
    setModalView(false);
  };

  const onChangeModalInput = (item: any) => {
    const name = item.target.id;
    const value = item.target.value;
    setUpdateEmailFormState((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const getAboutCompanyTest = () => {
    const returnResp =
      isCompanyInformationDone ||
      isCompanyRequirementsDone ||
      isOperationInformationDone ||
      isRegulatoryInformationDone;
    return returnResp ? "Continue" : "Start now";
  };

  const aboutPeopleText = () => {
    const returnResp =
      isDocumentsUploadedDone || isCompanyStakeholdersAddedDone;
    return returnResp ? "Continue" : "Start now";
  };

  const overAllStatus: any = (status: boolean) => {
    return status ? "completed" : "incomplete";
  };

  const switchLink = (
    <Switch
      switchSize={"large"}
      checked={switchToggle ? switchToggle : mfaMode}
      disabled={isMFAset}
      onChange={onChangeTwoFactorSetup}
    />
  );

  return (
    <main>
      <Spin label="loading..." loading={isProfileLoading || isLoading}>
        <LiveChat />
        <AccountSetup
          email={email}
          clientName={firstName}
          aboutCompanyText={aboutPeopleText()}
          aboutPeopleText={getAboutCompanyTest()}
          accountSetupText="Let's get your account set up"
          hasDisclaimer
          verifyEmailStatus={overAllStatus(emailVerified)}
          twoStepAuthStatus={overAllStatus(isMFAset)}
          aboutCompanyStatus={overAllStatus(overAllAboutCompanyStatus)}
          verifyDirectorStatus={overAllStatus(overAllDocumentsAndShareholders)}
          isEmailAccorditionDisabled={emailVerified}
          isTwoStepAccorditionDisabled={false}
          isCompanyAccorditionDisabled={
            emailVerified && isMFAset ? false : true
          }
          isDirectorAccorditionDisabled={
            overAllAboutCompanyStatus && isMFAset && emailVerified
              ? false
              : true
          }
          isButtonDisabled={isButtonDisabled}
          isMFADisabled={isMFAset}
          isMFAEnabled={mfaMode}
          handleResendEmailLink={handleResendEmailLink}
          handleUpdateEmailAddress={handleUpdateEmailAddress}
          onChangeTwoFactorSetup={onChangeTwoFactorSetup}
          handleAboutCompanyLink={handleAboutCompanyLink}
          handleVerifyDirectorAndUploadLink={handleVerifyDirectorAndUploadLink}
          switchLink={switchLink}
        />
        <SetupTwoFactorAuth
          verificationStage="settings"
          show={showSetupMFAModal}
          setSelected={setSwitchToggle}
        />
        <Modal
          type="default"
          title="Update your email address"
          onOkText="Save"
          onCancelText="Cancel"
          btnLoading={emailUpdateLoader}
          modalView={modalView}
          onClickOk={onClickOkHandler}
          onClickCancel={onClickCancelHandler}
          description={
            <Form>
              <Input
                name="email"
                type="email"
                size="large"
                label="Email"
                required
                style={{ width: "100%" }}
                onChange={onChangeModalInput}
              />
            </Form>
          }
        />
      </Spin>
    </main>
  );
};

// Export need to be default for code Splitting
// https://reactjs.org/docs/code-splitting.html#route-based-code-splitting
export { Account as default };
