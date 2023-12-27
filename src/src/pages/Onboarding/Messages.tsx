import React from "react";
import { CheckSvg, Text } from "@payconstruct/design-system";
import { Spacer } from "../../components/Spacer/Spacer";
import styles from "./style.module.css";

interface MessagesProps {
  kycStatus: string | null;
  name?: string | null;
}

const Messages: React.FC<MessagesProps> = ({ kycStatus, name }) => {
  const approved = () => {
    return (
      <div>
        <CheckSvg status="approved" />
        <Spacer size={15} />
        <Text
          color="#595c97"
          size="small"
          weight="bold"
          label="You're application has been approved!!"
        />
        <br />
        <Spacer size={15} />
        <Text size="medium" weight="bold" label="What to do next ?" />
        <br />
        <Spacer size={15} />
        <Text
          size="small"
          label="Tell your friends your now a part of the borderless financial planet!"
        />
        <br />
        <Spacer size={15} />
        <Text
          size="small"
          label="Click Get Started  below to start using your products."
        />
        <br />
        <Spacer size={15} />
        <Text
          size="small"
          label="P.s. we recommend watching or reading the user guide for the platform, it will help
          you get started faster!"
        />
        <Spacer size={15} />
        <Text
          size="small"
          label="We look forward to welcoming you as one of our value clients"
        />
        <br />
        <Spacer size={25} />
        <div className={styles.cc_start_btn}>
          <a href="https://www.getorbital.com/" target="orbital">
            <span style={{ color: "#fff" }}>GET STARTED</span>
          </a>
        </div>
      </div>
    );
  };
  const declined = () => {
    return (
      <div>
        <CheckSvg status="rejected" />
        <Spacer size={15} />
        <Text
          color="#595c97"
          size="small"
          weight="bold"
          label={`You're application has been declined`}
        />
        <br />
        <Spacer size={15} />
        <Text
          size="medium"
          weight="bold"
          label="We are sorry to say that, unfortunately your application has been declined. This means your application has been rejected and we cannot onboard you as one of our clients."
        />
        <br />
        <Spacer size={15} />
        <Text
          size="small"
          label="Please reach out to our onboarding team for more information."
        />
      </div>
    );
  };
  const pending = () => {
    return (
      <div>
        <CheckSvg status="pending" />
        <Spacer size={15} />
        <Text
          size="small"
          weight="bold"
          label={`Thanks ${name}, We appreciate all your help in activating your account. You’ve done your bit, now we’ll do ours. Your application is being reviewed by compliance team, it should take between 24 - 48 hours. We will let you know on the portal, and via email with a result.`}
        />
      </div>
    );
  };

  const otherMessage = () => {
    return (
      <div>
        <Text
          size="xlarge"
          weight="bold"
          label={kycStatus === null ? "" : "Page Not Found! 404 Error"}
        />
      </div>
    );
  };

  const getMessageBasedonKycStatus = (status: string | null) => {
    let returnResp;
    switch (status) {
      case "pass":
        returnResp = approved();
        break;
      case "pending":
        returnResp = pending();
        break;
      case "review_required":
        returnResp = pending();
        break;
      case "fail":
        returnResp = declined();
        break;
      default:
        returnResp = otherMessage();
        break;
    }
    return returnResp;
  };

  return (
    <main style={{ textAlign: "center", marginTop: "150px" }}>
      {getMessageBasedonKycStatus(kycStatus)}
    </main>
  );
};

// Export need to be default for code Splitting
// https://reactjs.org/docs/code-splitting.html#route-based-code-splitting
export { Messages as default };
