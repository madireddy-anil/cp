import { Colors } from "@payconstruct/design-system";
import React, { useEffect, lazy } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/store";
import { updateDepositForm, selectDeposit } from "./DepositSlice";
import { Steps } from "../../../components/Steps/Steps";
import {
  selectCompanyName,
  selectEntityId,
  selectIndustries
} from "../../../config/auth/authSlice";
import { nextStepAction, previousStepAction } from "./DepositSlice";
import { ConfirmTrade } from "../../Trades/Components/Modal/ConfirmTrade";
import { ProductGroup } from "../../../enums/products/Products";
import "./deposit.css";

interface DepositProps {}
const Deposit: React.FC<DepositProps> = () => {
  const dispatch = useAppDispatch();

  const { step } = useAppSelector(selectDeposit);
  const industries = useAppSelector(selectIndustries);

  const email = useAppSelector((state) => state.auth.email);
  const firstName = useAppSelector((state) => state.auth.firstName);
  const lastName = useAppSelector((state) => state.auth.lastName);
  const userId = useAppSelector((state) => state.auth.id);
  const portal = useAppSelector((state) => state.auth.portal);
  const entityId = useAppSelector(selectEntityId);
  const clientName = useAppSelector(selectCompanyName);

  useEffect(() => {
    dispatch(
      updateDepositForm({
        clientId: entityId,
        clientName,
        industries: industries?.map((el: any) => el?.industryType),
        createdBy: {
          email: email ?? "",
          firstName: firstName ?? "",
          lastName: lastName ?? "",
          userId: userId ?? "",
          portal: portal ?? ""
        }
      })
    );
  }, [
    dispatch,
    entityId,
    clientName,
    email,
    userId,
    industries,
    firstName,
    lastName,
    portal
  ]);

  const AccountSelection = lazy(
    () => import("../../Components/AccountSelection/AccountSelection")
  );
  const DepositAmount = lazy(
    () => import("../Components/DepositAmount/DepositAmount")
  );
  const Beneficiary = lazy(
    () => import("../Components/TradesBeneficiary/Beneficiary")
  );

  const onNextStepActionHandler = () => {
    dispatch(nextStepAction());
  };

  const onPreviousStepActionHandler = () => {
    dispatch(previousStepAction());
  };

  const steps = [
    {
      key: 0,
      title: "Sell currency",
      content: (
        <AccountSelection
          nextStepHandler={onNextStepActionHandler}
          hideUnavailableBalance={false}
          filterByProductGroup={ProductGroup.EFX}
          treasurySolutions="efx"
          pageFor="efx"
        />
      )
    },
    {
      key: 1,
      title: "Amount",
      content: (
        <DepositAmount
          nextStepHandler={onNextStepActionHandler}
          previousStepHandler={onPreviousStepActionHandler}
        />
      )
    },
    {
      key: 2,
      title: "Beneficiary",
      content: (
        <Beneficiary
          ConfirmModal={ConfirmTrade}
          confirmBtnLabel="Confirm Order"
          previousStepHandler={onPreviousStepActionHandler}
        />
      )
    }
  ];

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
    </main>
  );
};

export { Deposit as default };
