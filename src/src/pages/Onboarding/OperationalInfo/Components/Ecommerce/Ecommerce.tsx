import React from "react";
import { Spacer } from "../../../../../components/Spacer/Spacer";
import EcommerceDeposit from "./Deposit";
import EcommercePayout from "./Payout";

import OperationalInfoHeader from "../../Header";

const EcommercePayment: React.FC = () => {
  return (
    <div>
      <OperationalInfoHeader
        title="E-Commerce Payments"
        isFilterEnabled={false}
      />
      <EcommerceDeposit />
      <Spacer size={20} />
      <EcommercePayout />
    </div>
  );
};

export { EcommercePayment as default };
