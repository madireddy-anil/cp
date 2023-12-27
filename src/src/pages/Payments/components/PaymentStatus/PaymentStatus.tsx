import React from "react";
import {
  TradeStatus as DSPaymentStatus,
  Button
} from "@payconstruct/design-system";
import { useAppSelector } from "../../../../redux/hooks/store";
import PageWrapper from "../../../../components/Wrapper/PageWrapper";
import { Spacer } from "../../../../components/Spacer/Spacer";
import { useNavigate, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PaymentStatus: React.FC = () => {
  let navigate = useNavigate();
  let query = useQuery();

  const orderReference = query.get("orderReference");

  const status = "approved";

  const { selectedBeneficiary } = useAppSelector((state) => state.beneficiary);

  return (
    <PageWrapper>
      <Spacer size={50} />
      <DSPaymentStatus
        type={status}
        heading="Payment Submitted Successfully!"
        message={
          <>
            <p>
              Your payment with reference <strong>{orderReference}</strong> has
              been successfully submitted.
            </p>
            {selectedBeneficiary?.status === "new" && (
              <p>
                As this payment is being sent to a new beneficiary, it may take
                longer than normal to complete.
              </p>
            )}
          </>
        }
        // link={
        //   <Button
        //     type="link"
        //     onClick={() => console.log("view payment btn clicked")}
        //   >
        //     View Payment confirmation
        //   </Button>
        // }
        actions={[
          <Button
            key="backToHome"
            label="Back to home"
            onClick={() => {
              navigate("/accounts");
            }}
            style={{ height: "40px", width: "140px" }}
            type="primary"
          />,
          <Button
            key="newPayment"
            label="Make New Payment"
            onClick={() => {
              navigate("/new-payment");
            }}
            style={{ height: "40px", width: "140px" }}
            type="secondary"
          />
        ]}
      />
    </PageWrapper>
  );
};

export { PaymentStatus as default };
