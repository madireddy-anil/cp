import React from "react";
import { Row, Col } from "@payconstruct/design-system";
import { useAppSelector } from "../../redux/hooks/store";
import Messages from "./Messages";
import AccountSetup from "./AccountSetup";

const Main = () => {
  const { kycStatus } = useAppSelector((state) => state.company);
  const firstName = useAppSelector((state) => state.auth.firstName);

  return (
    <main>
      {kycStatus !== null && kycStatus === "new" ? (
        <AccountSetup />
      ) : (
        kycStatus !== null && (
          <Row>
            <Col span={12} offset={6}>
              <Messages name={firstName} kycStatus={kycStatus} />
            </Col>
          </Row>
        )
      )}
    </main>
  );
};

// Export need to be default for code Splitting
// https://reactjs.org/docs/code-splitting.html#route-based-code-splitting
export { Main as default };
