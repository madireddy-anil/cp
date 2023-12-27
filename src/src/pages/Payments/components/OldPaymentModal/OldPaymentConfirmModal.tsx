import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Text,
  CurrencyTag,
  Button,
  List,
  Colors,
  Notification
} from "@payconstruct/design-system";
import { showModalAction } from "../../../Components/DepositAmount/DepositAmountSlice";
import { setToInitialStep } from "../../PaymentSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/store";
import { Spacer } from "../../../../components/Spacer/Spacer";

import { isCurrencyPresent } from "../../../Components/Helpers/currencyTag";
import { useCreateNewPaymentMutation } from "../../../../services/paymentService";
import { Card } from "../../../Components/Card/Card";
import { fractionFormat } from "../../../../utilities/transformers";
import styles from "./OldPaymentConfirmModal.module.css";

const OldConfirmPaymentModal: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [createNewPayment, { isLoading, isSuccess }] =
    useCreateNewPaymentMutation();

  const showConfirmationModal = useAppSelector(
    (state) => state.depositAmount.showModal
  );

  const { selectedAccount }: any = useAppSelector(
    (state) => state.selectAccount
  );
  const { paymentDetails } = useAppSelector((state) => state.payment);
  const beneficiaries = useAppSelector((state) => state.beneficiary);
  const sendAmount = useAppSelector((state) => state.depositAmount.sendAmount);
  const paymentRemarks = useAppSelector(
    (state) => state.depositAmount.paymentRemarks
  );

  const {
    selectedInternalAccount,
    selectedBeneficiary,
    settlementType,
    newBeneficiary
  } = beneficiaries;

  const beneficiary =
    settlementType === "internal"
      ? selectedInternalAccount
      : selectedBeneficiary;

  const sendAmountString = sendAmount?.toString();

  const onCancel = () => {
    dispatch(showModalAction(false));
  };

  const getCreditor = (beneData: any) => {
    let value = "";
    if (settlementType === "internal") {
      value = getAccountNumber(beneData?.accountIdentification);
    } else {
      value = getAccountNumber(beneData?.accountDetails);
    }
    return value;
  };

  const getAccountNumber = (account: any) => {
    if (account?.accountNumber) {
      return account?.accountNumber;
    } else if (account?.IBAN || account?.iban) {
      return account?.IBAN || account?.iban;
    }
    return "Account Number Not Available";
  };

  const getName = (bene: any) => {
    if (bene?.accountName) {
      return bene?.accountName;
    } else {
      return (
        bene?.beneficiaryDetails?.name ||
        bene?.beneficiaryDetails?.nameOnAccount
      );
    }
  };

  const currencyName = (iconName: string | undefined): any => {
    const currency = iconName && isCurrencyPresent(iconName);
    if (currency) return currency;
    return "error";
  };

  const currencyWithMainCurrencyName = (
    iconName: string | undefined,
    mainCurrency: string | undefined
  ): any => {
    const currency = iconName && isCurrencyPresent(iconName);
    if (currency) {
      if (mainCurrency) {
        return `${currency}(${mainCurrency})`;
      }
      return currency;
    }
    return "error";
  };

  const onConfirm = async () => {
    let values: any = {
      accountId: selectedAccount?.id,
      debitCurrency: selectedAccount.currency,
      debitAmount: sendAmount,
      creditCurrency: beneficiary.currency,
      creditAmount: paymentDetails?.creditAmount ?? 0,
      remittanceInformation: paymentRemarks ?? "",
      requestSource: "clientPortal"
    };

    switch (settlementType) {
      case "internal":
        values = {
          ...values,
          creditorAccountId: beneficiary?.id
        };
        break;
      case "external":
        values = {
          ...values,
          beneficiaryId: beneficiary?.id || newBeneficiary?.beneficiary?.id
        };
        break;
      default:
        break;
    }

    await createNewPayment(values)
      .unwrap()
      .then((response) => {
        navigate(
          `/new-payment/payment-status?orderReference=${response?.data?.transactionReference}`
        );
      })
      .catch((err) => {
        const errMsg = err?.data?.errors["invalid-params"]?.message;
        Notification({
          message: "Payment Error!",
          description: `An error has occurred, ${errMsg ?? ""}`,
          type: "error"
        });
      })
      .finally(() => {
        dispatch(showModalAction(false));
      });
  };

  return (
    <Modal
      modalView={showConfirmationModal}
      title={"Confirm Payment"}
      onCancelText={"Cancel"}
      onOkText={"Confirm"}
      onClickCancel={onCancel}
      onClickOk={onConfirm}
      btnLoading={isLoading || isSuccess}
      buttonOkDisabled={isLoading || isSuccess}
      description={
        <Card style={{ background: Colors.grey.neutral50 }}>
          <div>
            <Text size="small" weight="regular">
              Account Details:{" "}
            </Text>
            <Spacer size={10} />
            <Card
              style={{ borderColor: Colors.grey.neutral100, padding: "20px" }}
            >
              <div className={styles["currency-list__view"]}>
                <div className="left">
                  <div className={styles["currency-card"]}>
                    <p className={styles["currency-card__value"]}>
                      {fractionFormat(sendAmountString ?? "0")}
                    </p>
                    <CurrencyTag
                      prefix={currencyName(selectedAccount?.currency)}
                      currency={currencyWithMainCurrencyName(
                        selectedAccount?.currency,
                        selectedAccount?.mainCurrency
                      )}
                    />
                  </div>
                  <Spacer size={10} />
                  <Text>
                    {getAccountNumber(selectedAccount?.accountIdentification)}
                  </Text>
                  <div>
                    <Text size="xxsmall" color="#468274" weight="regular">
                      Available Balance:{" "}
                      {fractionFormat(
                        selectedAccount?.balance?.availableBalance ?? 0
                      )}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
            <Spacer size={20} />
            <Text size="small" weight="regular">
              Beneficiary Details:{" "}
            </Text>
            <Spacer size={10} />
            <Card
              style={{ borderColor: Colors.grey.neutral100, padding: "20px" }}
            >
              <div className={styles["currency-list__view"]}>
                <div className="left">
                  <div className={styles["currency-card"]}>
                    <p className={styles["currency-card__value"]}>
                      {fractionFormat(paymentDetails?.creditAmount)}
                    </p>
                    <CurrencyTag
                      prefix={currencyName(beneficiary?.currency)}
                      currency={currencyWithMainCurrencyName(
                        beneficiary?.currency,
                        beneficiary?.mainCurrency
                      )}
                    />
                  </div>
                  <Spacer size={10} />
                  <Text size="small" weight="regular">
                    {getName(beneficiary)} / {getCreditor(beneficiary)}
                  </Text>
                </div>
              </div>
            </Card>
            <Spacer size={20} />
            <div className={styles["currency-list__view"]}>
              <Text size="small" weight="regular">
                Payment Details
              </Text>
              <Button
                label="Modify Details"
                type="link"
                onClick={() => {
                  dispatch(setToInitialStep());
                  onCancel();
                }}
              />
            </div>
            <div className={styles["fees"]}>
              <List
                background={false}
                listType="horizontal"
                src={[
                  {
                    label: "Fees",
                    value: `${paymentDetails?.pricingInfo?.liftingFeeAmount} ${paymentDetails?.pricingInfo?.liftingFeeCurrency}`
                  },
                  {
                    label: "Exchange Rate",
                    value: paymentDetails?.fxInfo?.allInRate ?? "---"
                  },
                  {
                    label: "Remarks",
                    value: `${paymentRemarks}`
                  }
                ]}
              />
            </div>
          </div>
        </Card>
      }
    />
  );
};

export { OldConfirmPaymentModal };
