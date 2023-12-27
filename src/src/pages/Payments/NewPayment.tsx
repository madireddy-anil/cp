import { Colors } from "@payconstruct/design-system";
import { useEffect, lazy, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/store";
import {
  setToInitialStep,
  nextStepAction,
  previousStepAction,
  selectPaymentStep
} from "./PaymentSlice";
import { Steps } from "../../components/Steps/Steps";

import { OldConfirmPaymentModal } from "./components/OldPaymentModal/OldPaymentConfirmModal";
import { setToInitialAccount } from "../Components/AccountSelection/AccountSelectionSlice";
import { setToInitialBeneficiary } from "../Components/Beneficiary/BeneficiarySlice";
import { setToInitialFormState } from "../Components/DepositAmount/DepositAmountSlice";
import { ProductGroup } from "../../enums/products/Products";

import "./NewPayment.css";

const NewPayment = () => {
  const dispatch = useAppDispatch();
  const step = useAppSelector(selectPaymentStep);

  useEffect(() => {
    dispatch(setToInitialAccount());
    dispatch(setToInitialBeneficiary());
    dispatch(setToInitialFormState());
    dispatch(setToInitialStep());
  }, [dispatch]);

  const AccountSelection = lazy(
    () => import("../Components/AccountSelection/AccountSelection")
  );

  const Beneficiary = lazy(
    () => import("./components/PaymentBeneficiary/Beneficiary")
  );

  const DepositAmount = lazy(() => import("./components/Amount/amount"));

  const onNextStepActionHandler = useCallback(() => {
    dispatch(nextStepAction());
  }, [dispatch]);

  const onPreviousStepActionHandler = useCallback(() => {
    dispatch(previousStepAction());
  }, [dispatch]);

  const steps = useMemo(() => {
    return [
      {
        key: 0,
        title: "Account",
        content: (
          <AccountSelection
            nextStepHandler={onNextStepActionHandler}
            filterByProductGroup={ProductGroup.GlobalPayments}
            hideUnavailableBalance
            pageFor="payments"
          />
        )
      },
      {
        key: 1,
        title: "Beneficiary",
        content: (
          <Beneficiary
            nextStepHandler={onNextStepActionHandler}
            previousStepHandler={onPreviousStepActionHandler}
          />
        )
      },
      {
        key: 2,
        title: "Amount",
        content: (
          <DepositAmount
            nextStepHandler={onNextStepActionHandler}
            previousStepHandler={onPreviousStepActionHandler}
            confirmBtnLabel={"Confirm Payment"}
          />
        )
      }
    ];
  }, [
    AccountSelection,
    Beneficiary,
    DepositAmount,
    onPreviousStepActionHandler,
    onNextStepActionHandler
  ]);

  return (
    <main
      className="steps-wrapper"
      style={{
        padding: "40px",
        margin: 0,
        height: "calc(100vh - 56px)",
        overflowY: "auto",
        background: Colors.grey.neutral50
      }}
    >
      <Steps steps={steps} currentStep={step} />
      <OldConfirmPaymentModal />
    </main>
  );
};

export { NewPayment as default };
