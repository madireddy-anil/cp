import React from "react";
import {
  TradeStatus as DSTradeStatus,
  Button
} from "@payconstruct/design-system";
import PageWrapper from "../../../components/Wrapper/PageWrapper";
import { Spacer } from "../../../components/Spacer/Spacer";
import { useNavigate, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const TradeStatus: React.FC = () => {
  let navigate = useNavigate();
  let query = useQuery();

  const orderReference = query.get("orderReference");
  const id = query.get("id");

  const status = "approved";

  return (
    <PageWrapper>
      <Spacer size={50} />
      <DSTradeStatus
        type={status}
        heading="Your order was successful"
        message={
          <>
            <p>Your EFX order has been submitted succesfully.</p>
            <p>Order reference number: {orderReference}</p>
          </>
        }
        link={
          <Button
            type="link"
            onClick={() => {
              navigate(`/order/${id}`);
            }}
            label="View transaction confirmation"
          />
        }
        actions={[
          <Button
            label="Back to EFX Dashboard"
            onClick={() => {
              navigate("/orders");
            }}
            style={{ height: "40px", width: "140px" }}
            type="primary"
          />,
          <Button
            label="New EFX Order"
            onClick={() => {
              navigate("/order/deposit");
            }}
            style={{ height: "40px", width: "140px" }}
            type="secondary"
          />
        ]}
      />
    </PageWrapper>
  );
};

export { TradeStatus as default };
