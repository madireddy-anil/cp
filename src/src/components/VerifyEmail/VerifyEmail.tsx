import { useState } from "react";
import {
  Button,
  Icon,
  Notification,
  Row,
  Col,
  Text,
  Tooltip,
  Spin
} from "@payconstruct/design-system";
import { useIntl } from "react-intl";
import { useNavigate, useLocation } from "react-router-dom";
import { white } from "@payconstruct/design-system/dist/core/Colors/Colors";

import { useAppSelector } from "../../redux/hooks/store";
import {
  useGetProfileQuery,
  useResendEmailMutation
} from "../../services/authService";
import { Spacer } from "../Spacer/Spacer";

import style from "./VerifyEmail.module.css";

interface VerifyEmailProps {
  isButtonDisabled?: boolean;
  handleResendEmailLink?: (e: any) => void;
  handleUpdateEmailAddress?: (e: any) => void;
}

export const VerifyEmail: React.FC<VerifyEmailProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const intl = useIntl();

  const email = useAppSelector((state) => state.auth.email);
  const kycStatus = useAppSelector((state) => state.company.kycStatus);
  const firstName = useAppSelector((state) => state.auth.firstName);
  const emailVerified = useAppSelector((state) => state.auth.emailVerified);

  const [disclaimer] = useState<boolean>(true);
  const [showTooltip, setTooltip] = useState(false);

  const hideOnKycStatus =
    kycStatus === "fail" ||
    kycStatus === "pending" ||
    kycStatus === "review_required";

  const [resendEmailLink, { isLoading: isEmailSentLoading }] =
    useResendEmailMutation();
  const handleMouseToggle = (e: any) => {
    setTooltip(!showTooltip);
  };

  // useGetProfileQuery(email, {
  //   refetchOnFocus: true
  // });

  const disclaimerData = [
    {
      id: 1,
      value: "A full license"
    },
    {
      id: 2,
      value: "A pending license application"
    },
    {
      id: 3,
      value: "A sub- or agent license"
    }
  ];
  const onboardMerchants = () => {
    return (
      <div className={style["disclaimer--section"]}>
        <div className={style["header"]}>
          We can only onboard clients who maintain one or more of the following{" "}
          <span>(if your industry requires so):</span>
        </div>
        <div>
          {(disclaimerData || []).map((item, index) => (
            <div key={index + "disclaimerList"} className={style["content"]}>
              <Icon name={"checkCircle"} size={"medium"} />
              <div style={{ marginLeft: "0.5em" }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
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

  const handleUpdateEmailAddress = () => {
    location.pathname !== "/user/profile" && navigate("/user/profile");
  };

  return (
    <>
      {!emailVerified && (
        <Spin loading={isEmailSentLoading}>
          <div
            className={
              style[
                !emailVerified
                  ? "header__email-not-verified"
                  : "header__email-verified"
              ]
            }
          >
            <Row>
              <Col lg={{ span: 12 }}>
                <h1>Welcome, {firstName}!</h1>
                <h6>Now, let's get your account set up</h6>
              </Col>

              <Col style={{ textAlign: "right" }} lg={{ span: 12 }}>
                <div style={{ float: "right" }}>
                  {" "}
                  {disclaimer && (
                    <div
                      className={style["disclaimer--wrapper"]}
                      onMouseEnter={handleMouseToggle}
                      onMouseLeave={handleMouseToggle}
                    >
                      <Tooltip
                        text={onboardMerchants}
                        bgColor={white.primary}
                        tooltipPlacement="bottom"
                        visible={showTooltip}
                      >
                        <Icon name={"info"} size={"extraSmall"} />
                      </Tooltip>
                      <span>Disclaimer</span>
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            <Spacer size={15} />
            <div className={style["alertbox"]}>
              <Row>
                <Col style={{ textAlign: "left" }} lg={{ span: 1 }}>
                  <span className={style["icon-left"]}>
                    <Icon
                      color="#FFA641"
                      name="warningAmber"
                      className={style["warningicon"]}
                    />
                  </span>
                </Col>
                <Col lg={{ span: 22 }}>
                  <Text
                    color="#303030"
                    weight="bold"
                    label="Verify your email to activate your account"
                  />
                  <div className={style["content"]}>
                    {" "}
                    We sent a verification link to {email} If you didn’t receive
                    it,
                    <Button
                      className={style["linkbutton"]}
                      onClick={handleResendEmail}
                      label="resend the email"
                      size="large"
                      type="link"
                    />
                    or
                    <Button
                      className={style["linkbutton"]}
                      onClick={handleUpdateEmailAddress}
                      label="update your email address"
                      size="large"
                      type="link"
                    />{" "}
                    to verify your account.
                  </div>
                </Col>
                {/* <Col style={{ textAlign: "right" }} lg={{ span: 1 }}>
                <Icon name="close" className={style["closeicon"]} />
              </Col> */}
              </Row>
            </div>
          </div>
        </Spin>
      )}

      {emailVerified &&
        !hideOnKycStatus &&
        location.pathname === "/account-setup" && (
          <div className={style["header__email-verified"]}>
            {" "}
            <Row>
              <Col lg={{ span: 12 }}>
                <h1>Welcome, {firstName}!</h1>
                <h6>Now, let's get your account set up</h6>
              </Col>

              <Col style={{ textAlign: "right" }} lg={{ span: 12 }}>
                <div style={{ float: "right" }}>
                  {" "}
                  {disclaimer && (
                    <div
                      className={style["disclaimer--wrapper"]}
                      onMouseEnter={handleMouseToggle}
                      onMouseLeave={handleMouseToggle}
                    >
                      <Tooltip
                        text={onboardMerchants}
                        bgColor={white.primary}
                        tooltipPlacement="bottom"
                        visible={showTooltip}
                      >
                        <Icon name={"info"} size={"extraSmall"} />
                      </Tooltip>
                      <span>Disclaimer</span>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        )}
    </>
  );
};
