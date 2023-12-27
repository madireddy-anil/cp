import React from "react";
import { NewBeneficiaryModal } from "./NewBeneficiary/NewBeneficiaryModal";

const ModalHandler = React.memo(({ children }) => {
  return (
    <>
      {children}
      <NewBeneficiaryModal currency="" />
    </>
  );
});

export { ModalHandler };
