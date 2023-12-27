import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/store";
import PageWrapper from "../../components/Wrapper/PageWrapper";

import { Spacer } from "../../components/Spacer/Spacer";
import { CheckSvg, Text } from "@payconstruct/design-system";

const ApprovedApplication: React.FC = () => {
  let navigate = useNavigate();
  const showApplicationApproved = useAppSelector(
    (state) => state.termsOfServiceDocument.showApplicationApproved
  );
  !showApplicationApproved && navigate(-1);

  return (
    <PageWrapper>
      <div style={{ textAlign: "center" }}>
        <CheckSvg status="approved" />
        <Spacer size={15} />
        <Spacer size={15} />
        <Text
          color="#595c97"
          size="small"
          weight="bold"
          label="Your application has been approved!!"
        />
        <br />
        <Spacer size={15} />
        <Text
          size="small"
          weight="bold"
          label="Last step is accepting the terms of service."
        />
        <br />
        <Spacer size={15} />
        <Text
          size="small"
          weight="bold"
          label="All authorised persons have been presented the terms of service to accept."
        />
        <br />
        <Spacer size={15} />
        <Text
          size="small"
          weight="bold"
          label="Once accepted you will be notified on the platform and via email."
        />
        {/* <div style={{ marginBottom: "-25px", marginTop: "19px" }}>
          <Button
            type="link"
            label="Cancel"
            onClick={() => dispatch({ type: userLogoutAction })}
          />
        </div> */}
      </div>
    </PageWrapper>
  );
};

export { ApprovedApplication as default };
