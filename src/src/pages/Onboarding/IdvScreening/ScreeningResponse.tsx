import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckSvg, Text, Spin } from "@payconstruct/design-system";
import { useAppSelector } from "../../../redux/hooks/store";

declare const window: any;

const ScreeningResult: React.FC = () => {
  let navigate = useNavigate();
  const isScreeningSuccess = useAppSelector(
    (state) => state.idvScreening.isScreeningSuccess
  );
  const errMessage = useAppSelector((state) => state.idvScreening.errMessage);

  useEffect(() => {
    window.onload = disableBack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window]);

  const disableBack = () => {
    navigate("/screening-response");
  };

  const Spacer = <div style={{ marginTop: "10px" }} />;
  const success = () => {
    return (
      <>
        <CheckSvg status="approved" />
        <br />
        {Spacer}
        <Text
          size="large"
          weight="bold"
          label=" Nice smile! We have successfully collected your documents"
        />

        <br />
        {Spacer}
        <Text size="small" label="We are currently verifying your identity." />
        <br />
        <Text
          size="small"
          label="The person who is managing the application will receive confirmation
          of verifiction when this is complete."
        />
        <br />
        {Spacer}
        <Text size="small" label="You can now close this window." />
      </>
    );
  };

  const fail = () => {
    return (
      <>
        <CheckSvg status="rejected" />
        <br />
        {Spacer}
        <Text
          size="large"
          weight="bold"
          label="Please try again... or please contact our support team!"
        />
        <br />
        {Spacer}
        <Text
          size="small"
          label={
            errMessage !== undefined && typeof errMessage === "string"
              ? errMessage
              : "Something is went wrong!"
          }
        />
      </>
    );
  };

  const loader = () => {
    return (
      <>
        <div>
          <Text size="large" weight="bold" label="Wait for response..." />
        </div>
        {Spacer}
        <Text size="medium" weight="regular" label="Don't refresh the page" />
        {Spacer}
        <Spin label="loading..." loading={true} />
      </>
    );
  };
  console.log(isScreeningSuccess);
  return (
    <main>
      <div style={{ padding: "90px", textAlign: "center" }}>
        {isScreeningSuccess === null
          ? loader()
          : isScreeningSuccess
          ? success()
          : fail()}
      </div>
    </main>
  );
};

export { ScreeningResult as default };
