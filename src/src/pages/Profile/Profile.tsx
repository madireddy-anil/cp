import React, { useEffect, useState } from "react";
import { Space } from "antd";
import {
  Icon,
  Text,
  Spin,
  Modal,
  Notification
} from "@payconstruct/design-system";
import PageWrapper from "../../components/Wrapper/PageWrapper";
import { Header, HeaderContent } from "../../components/PageHeader/Header";
import AccountSettings from "./Components/Card/AccountSettings";
import VerifyPasswordModal from "../../components/Modals/VerifyPassword";
import { ResetPassword } from "../../components/Modals/ResetPassword/ResetPassword";
import { UpdateClientInfoModal } from "./Components/Modal/UpdateClientInfo";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/store";
// import { generateRandomName } from "../../config/transformer";
import { showSetupMFAModalAction } from "../../config/auth/authSlice";
import { useAuth } from "../../redux/hooks/useAuth";
import {
  useGetProfileQuery,
  useResetPasswordMutation
} from "../../services/authService";
import { useIntl } from "react-intl";
import { SetupTwoFactorAuth } from "../../components/Modals/SetupTwoFactorAuth/SetupTwoFactorAuth";
import Styles from "./profile.module.css";

type TContentData = {
  id: number;
  key: string;
  label: string;
  value: any;
  editIcon: boolean;
}[];

const Profile: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<any>({});
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [forgetPwdModal, setForgetPwdModal] = useState<boolean>(false);
  const [modalView, setModalView] = useState(false);
  const [emailUpdateLoader, setEmailUpdatedLoader] = useState(false);
  const [updateClientInfoModal, setUpdateClientInfoModal] =
    useState<boolean>(false);
  // const [getProfile] = useState<any>(generateRandomName);
  const [, setSelected] = useState<boolean>(false);
  const [noData] = useState<any>("--");

  // Global State
  const { auth } = useAuth();
  const { showSetupMFAModal } = auth;
  // const addresses = useAppSelector(
  //   (state) => state.auth.profile?.entity?.genericInformation?.addresses[0]
  // );

  const {
    firstName = "",
    lastName = "",
    email = "",
    isMFAset = "",
    phoneNumber = "",
    phoneNumberCountryCode = ""
  }: any = auth;

  //! Not coming from the backend
  // const dateOfBirth = "";

  // const { street = "", city = "", country = "", postCode = "" } = addresses;

  const name = firstName + " " + lastName || noData;
  // const dob = dateOfBirth.split("/").reverse().join("/") || noData;
  // const userAddress =
  //   Object.entries(addresses).length > 0
  //     ? `${street} ${city} ${country} ${postCode}`
  //     : noData;

  const phone = phoneNumberCountryCode?.concat(phoneNumber) || noData;

  // Show the Recovery Code Modal
  const showRecoveryCodeModal = formData?.filterData?.key;

  // const phone = useState<any>(
  //   phoneNumber.replaceAll(" ", "").slice(-10) || noData
  // );
  const { canFetchProfileAPI } = useAppSelector((state) => state.auth);
  const isLoading = useAppSelector((state) => state.accountSetting.isLoading);

  // Get Profile Data By Api Query
  const { refetch } = useGetProfileQuery(email);

  const [resetPassword] = useResetPasswordMutation();

  useEffect(() => {
    if (canFetchProfileAPI) {
      refetch();
      setUpdateClientInfoModal(false);
    }
  }, [canFetchProfileAPI, refetch]);

  // const WhereYouAreLogin = () => (
  //   <div className={Styles["login__system__info"]}>
  //     <Text
  //       size="default"
  //       weight="bold"
  //       color={Colors.grey.neutral700}
  //       label={"Windows PC - London, UK"}
  //     />
  //     <Spacer size={4} />
  //     <div style={{ fontSize: "11px" }}>
  //       Chrome -{" "}
  //       <span style={{ color: Colors.green.green400 }}>Active Now</span>
  //     </div>
  //   </div>
  // );

  const TwoFactorIcon = () => {
    return (
      <>
        {isMFAset ? (
          <Space size={5}>
            <Icon name="checkCircle" size="medium" />
            <div style={{ paddingBottom: 5 }} className="uc-first">
              On
            </div>
          </Space>
        ) : (
          <Space size={5}>
            <Icon name="closeCircle" size="medium" />
            <div style={{ paddingBottom: 5 }} className="uc-first">
              Off
            </div>
          </Space>
        )}
      </>
    );
  };

  // ned to enable once the form of contact is enabled---

  // const addCommaAfterEachWord = (data: any[]) => {
  //   return (
  //     <p style={{ fontSize: "14px", fontWeight: "bold" }}>
  //       {data?.length > 0
  //         ? data
  //             .map((word: any) => {
  //               const returnResp = !word ? noData : word.communicationType;
  //               return capitalize(returnResp);
  //             })
  //             .join(", ")
  //         : noData}
  //     </p>
  //   );
  // };

  // const BasicInfoData: TContentData = [
  //   { id: 1, key: "name", label: "Name", value: name }
  //   { id: 2, key: "birthday", label: "Birthday", value: dob },
  //   {
  //     id: 3,
  //     key: "address",
  //     label: "Address",
  //     value: userAddress
  //   }
  // ];

  const GeneralInfoData: TContentData = [
    { id: 11, key: "name", label: "Name", value: name, editIcon: false },
    { id: 12, key: "email", label: "Email", value: email, editIcon: true },
    {
      id: 13,
      key: "phone",
      label: "Phone Number",
      value: phone,
      editIcon: true
    }
    // {
    //   id: 14,
    //   key: "formOfContact",
    //   label: "Preferred Form Of Contact",
    //   value: "--",
    //   editIcon: true
    // }
  ];

  const SecurityAndLoginInfoData: TContentData = [
    {
      id: 21,
      key: "password",
      label: "Password",
      value: "********",
      editIcon: true
    },
    {
      id: 22,
      key: "twoFactorAuthentication",
      label: "Two Factor Authentication",
      value: TwoFactorIcon(),
      editIcon: true
    }
    // {
    //   id: 23,
    //   key: "whereLoggedIn",
    //   label: "Where you're logged in",
    //   value: WhereYouAreLogin()
    // }
  ];

  const onClickEdit = (data: any): any => {
    if (data.key !== "email" && data.key !== "twoFactorAuthentication") {
      const overallData = GeneralInfoData.concat(SecurityAndLoginInfoData);
      const filterData = overallData.find((d: any) => d.id === data.id);
      setShowPasswordModal(data.key === "password" ? false : true);
      data.key === "password" && setModalView(true);
      setFormData({ ...formData, filterData });
    }
  };

  const onClickForgotPassword = (data: any): any => {
    setShowPasswordModal(false);
    setForgetPwdModal(true);
  };

  const getModalTitle = (key: string | undefined): string | undefined => {
    if (key) {
      switch (key) {
        case "email":
          return "Update Email";
        case "phone":
          return "Update Phone Number";
        case "formOfContact":
          return "Update Form of contact";
        case "password":
          return "Update Password";
        case "twoFactorAuthentication":
          if (isMFAset) {
            return "Two Factor Authentication";
          }
          return "Protect Your Account";
        default:
          return "";
      }
    }
    return undefined;
  };

  const getModalSubtitle = (key: string | undefined): string | undefined => {
    if (key) {
      switch (key) {
        case "email":
          return "When updated, the updated email will be used to log-in to your account.";
        case "phone":
          return "This phone number is added to your account.";
        case "password":
          return "Choose a strong password.";
        case "twoFactorAuthentication":
          return "Add an Extra layer of security with Two Factor Authentication.";
        default:
          return "";
      }
    }
    return undefined;
  };

  const getModalOkText = (key: string | undefined): string | undefined => {
    if (key) {
      switch (key) {
        case "email":
          return "Update Email";
        case "phone":
          return "Update Number";
        case "password":
          return "Change Password";
        case "twoFactorAuthentication":
          return "Send";
        default:
          return "";
      }
    }
    return undefined;
  };

  // const mainSubTitle: any = (
  //   <Text label="Manage your personal account settings." />
  // );
  const modalSubTitle: any = (
    <Text color="#8A929D" label="To continue, first verify its you" />
  );
  const handleResendPasswordresetEmail = async () => {
    try {
      setEmailUpdatedLoader(true);
      await resetPassword({
        email
      }).unwrap();
      setModalView(false);
      setEmailUpdatedLoader(false);
      Notification({
        message: intl.formatMessage({ id: "emailSentMsg" }),
        type: "success"
      });
    } catch (err) {
      Notification({
        message: intl.formatMessage({ id: "Error" }),
        description: intl.formatMessage({ id: "Email sent failed" }),
        type: "error"
      });
      console.log("Failed to change password:", err);
    }
  };

  const onClickCancelHandler = () => {
    setModalView(false);
  };

  return (
    <>
      <PageWrapper>
        <Header>
          <HeaderContent.LeftSide>
            <HeaderContent.Title>
              User Settings &#38; Configuration
            </HeaderContent.Title>
          </HeaderContent.LeftSide>
        </Header>
        <Spin loading={isLoading}>
          <div className={Styles["account_settings_card__Wrapper"]}>
            {/* <AccountSettings
              headingTitle="Personal Information"
              // headingSubTitle="Personal info and options to manage it."
              contentData={BasicInfoData}
            /> */}
            <AccountSettings
              headingTitle="General Information"
              contentData={GeneralInfoData}
              onClickEdit={onClickEdit}
            />
            <AccountSettings
              headingTitle="Security and Login"
              contentData={SecurityAndLoginInfoData}
              onClickEdit={onClickEdit}
            />
          </div>
        </Spin>
        <VerifyPasswordModal
          show={showPasswordModal}
          title={getModalTitle(formData?.filterData?.key)}
          subTitle={modalSubTitle}
          showRecoveryCodeModal={showRecoveryCodeModal}
          onCancelText={"Cancel"}
          onOkText={"Next"}
          onClickCancel={() => {
            setShowPasswordModal(false);
            showRecoveryCodeModal === "twoFactorAuthentication"
              ? dispatch(showSetupMFAModalAction(false))
              : setUpdateClientInfoModal(false);
          }}
          onClickOk={() => {
            setShowPasswordModal(false);
            showRecoveryCodeModal === "twoFactorAuthentication"
              ? dispatch(showSetupMFAModalAction(true))
              : setUpdateClientInfoModal(true);
          }}
          onClickForgetPwd={onClickForgotPassword}
          forgotPasswordButton={false}
        />
        <ResetPassword show={forgetPwdModal} toggleShow={setForgetPwdModal} />
        <UpdateClientInfoModal
          fieldName={formData?.filterData?.label}
          show={updateClientInfoModal}
          loading={isLoading}
          title={getModalTitle(formData?.filterData?.key)}
          subTitle={getModalSubtitle(formData?.filterData?.key)}
          onCancelText={"Cancel"}
          onOkText={getModalOkText(formData?.filterData?.key)}
          onClickCancel={() => {
            setUpdateClientInfoModal(false);
          }}
          onClickOk={() => {
            setUpdateClientInfoModal(false);
          }}
        />
        <SetupTwoFactorAuth
          show={showSetupMFAModal}
          verificationStage="settings"
          setSelected={setSelected}
        />
        {/* <UpdatePassword show={modalview} toggleShow={setresetPwdModal} /> */}
        <Modal
          type="default"
          title="Reset Password"
          onOkText="Send reset link"
          onCancelText="Cancel"
          btnLoading={emailUpdateLoader}
          modalView={modalView}
          onClickOk={handleResendPasswordresetEmail}
          onClickCancel={onClickCancelHandler}
          description="To reset your password we'll need to send you a link to your email."
        />
      </PageWrapper>
    </>
  );
};

// Export need to be default for code Splitting
// https://reactjs.org/docs/code-splitting.html#route-based-code-splitting
export { Profile as default };
