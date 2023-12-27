import { Button, SwitchName, Notification } from "@payconstruct/design-system";
import { Row, Col } from "antd";
import React, { useEffect } from "react";
import {
  Header,
  HeaderContent
} from "../../../../components/PageHeader/Header";
import { Spacer } from "../../../../components/Spacer/Spacer";
import { Spinner } from "../../../../components/Spinner/Spinner";
import { useGetBeneficiaryByClientIdQuery } from "../../../../services/beneficiaryService";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/store";
import { selectEntityId } from "../../../../config/auth/authSlice";
import {
  showModalAction,
  showFormModalAction,
  setSubmitting,
  changeSettlementType,
  setInternalAccountAction,
  setBeneficiaryAction
} from "../../../Components/Beneficiary/BeneficiarySlice";
import { Beneficiaries } from "../../../Components/Beneficiary/ExternalBeneficiaries/Beneficiaries";
import { AccountRadioGroup } from "../../../Components/AccountSelection/AccountRadioGroup/AccountRadioGroup";

import NewBeneficiaryForm from "../../../../components/Modals/NewBeneficiary";
import { setLoading } from "../../../../config/general/generalSlice";
import { useCreateBeneficiaryMutation } from "../../../../services/beneficiaryService";
import { setToInitialPaymentDetails } from "../../PaymentSlice";

import { Account } from "../../../../services/accountService";
import { selectAccountSelection } from "../../../Components/AccountSelection/AccountSelectionSlice";
import { ProductGroup } from "../../../../enums/products/Products";

interface BeneficiaryProps {
  ConfirmModal?: React.FunctionComponent<any>;
  confirmBtnLabel?: string;
  nextStepHandler?: () => void;
  previousStepHandler: () => void;
}

const Beneficiary: React.FC<BeneficiaryProps> = (props) => {
  const {
    ConfirmModal,
    confirmBtnLabel,
    nextStepHandler,
    previousStepHandler
  } = props;
  const dispatch = useAppDispatch();

  const {
    showModal,
    showFormModal,
    submittingBeneficiary,
    settlementType,
    beneficiaryId
  } = useAppSelector((state) => state.beneficiary);

  const { isLoading: isRateFetching } = useAppSelector(
    (state) => state.payment
  );

  const selectedAccount = useAppSelector(selectAccountSelection);

  // To hide accounts, if selected currency type is a crypto currency with specific conditions
  // If EUR selected, hide cryto currencies in Beneficiaries accounts page
  const hideAccounts =
    selectedAccount?.currencyType === "crypto" ||
    selectedAccount?.currency === "EUR";

  const [newBeneficiary, { isLoading: isBeneficiaryCreationLoading }] =
    useCreateBeneficiaryMutation();

  const entityId = useAppSelector(selectEntityId);
  const {
    refetch,
    isLoading: isBeneficiaryGetByIdLoading,
    isFetching: isBeneficiaryGetByIdFetching
  } = useGetBeneficiaryByClientIdQuery(
    { entityId },
    { skip: !entityId, refetchOnMountOrArgChange: 5 }
  );

  type settlementTypeOptionsType = {
    label: string;
    value: typeof settlementType;
    disabled?: boolean;
  }[];

  // PRD <H/C> : Open Payd EUR Account Validation
  const openPaydEURValidation =
    selectedAccount?.currency === "EUR" &&
    selectedAccount?.linkedVendorAccount ===
      "30a88877-a673-44de-9526-c4f3c6eeb10f";

  const settlementTypeOptions: settlementTypeOptionsType = [
    {
      label: "Your Accounts",
      value: "internal",
      disabled: openPaydEURValidation
    },
    { label: "Beneficiaries", value: "external" }
  ];

  const onChangeSettlementType = (result: any) => {
    if (openPaydEURValidation) {
      dispatch(changeSettlementType("external"));
    } else {
      dispatch(changeSettlementType(result.settlementType));
    }
  };

  const onChangeAccountSelection = (
    accountId: string,
    accountsData: Account[]
  ) => {
    const [account] = accountsData.filter((item: any) => item.id === accountId);
    dispatch(setInternalAccountAction(account));
    dispatch(setToInitialPaymentDetails());
  };

  useEffect(() => {
    if (isBeneficiaryCreationLoading) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch, isBeneficiaryCreationLoading]);

  const submitNewBeneficiary = async (formData: any) => {
    const {
      requestedAccountType,
      country,
      bankCountry,
      currency,
      nameOnAccount,
      accountNumber,
      iban,
      bic,
      branchCode,
      buildingNumber,
      zipOrPostalCode,
      stateOrProvince,
      street,
      city,
      bankName,
      intermediaryBank,
      mainCurrency
    } = formData;
    dispatch(setSubmitting(true));
    try {
      const newBeneficiaryPayload = {
        entityId,
        beneficiaryDetails: {
          type: requestedAccountType,
          nameOnAccount,
          address: {
            country,
            buildingNumber,
            zipOrPostalCode,
            stateOrProvince,
            city,
            street
          }
        },
        currency,
        mainCurrency,
        status: "new",
        accountDetails: {
          branchCode,
          bankName,
          nameOnAccount,
          accountNumber,
          bic,
          iban,
          bankCountry,
          intermediaryBank
        },
        isDeleted: false
      };
      await newBeneficiary(newBeneficiaryPayload).unwrap();
      dispatch(setBeneficiaryAction(newBeneficiaryPayload));
      dispatch(setToInitialPaymentDetails());
      dispatch(setLoading(false));
      dispatch(setSubmitting(false));
      Notification({
        message: "New Beneficiary",
        description: "New Beneficiary Created Successfully!",
        type: "success"
      });
      // handleRateFetch(currency);
      if (nextStepHandler) nextStepHandler();
      refetch();
      return true;
    } catch (err: any) {
      console.log("Beneficiary result Error: ", err);
      dispatch(setLoading(false));
      dispatch(setSubmitting(false));
      Notification({
        message: "New Beneficiary Rejected",
        description: err?.data?.message ?? "Create new beneficiary error",
        type: "error"
      });
      return false;
    }
  };

  const cancelNewBeneficiary = () => {
    dispatch(showFormModalAction(false));
  };

  return (
    <>
      <section>
        <Header>
          <HeaderContent.Title
            subtitle={`Select a Beneficiary for the amount to be settled to.`}
          >
            Beneficiary
          </HeaderContent.Title>
        </Header>
        <Row gutter={15}>
          <Col className="gutter-row" span={18}>
            <SwitchName
              selectedOption={settlementType === "external" ? 1 : 0} // Beneficiaries
              name="settlementType"
              onChange={onChangeSettlementType}
              options={settlementTypeOptions}
            />
          </Col>
          <Col className="gutter-row" span={6}>
            {settlementType === "external" && (
              <Button
                icon={{
                  name: "add"
                }}
                label="New Beneficiary"
                size="large"
                type="link"
                onClick={() => dispatch(showFormModalAction(true))}
              />
            )}
          </Col>
        </Row>
        <Spacer size={15} />
        <Row gutter={15}>
          <Col className="gutter-row" span={24}>
            {settlementType === "internal" && (
              <AccountRadioGroup
                defaultValue={beneficiaryId}
                filterByAccount={selectedAccount?.id}
                filterByProductGroup={ProductGroup.GlobalPayments}
                hideUnavailableBalance={false}
                hideSpecificAccounts={hideAccounts}
                onChange={onChangeAccountSelection}
                selectedAccount={selectedAccount}
                treasurySolutions="payments"
                pageFrom="beneficiary"
              />
            )}
            {settlementType === "external" &&
              (isBeneficiaryGetByIdLoading || isBeneficiaryGetByIdFetching ? (
                <Spinner />
              ) : (
                <Beneficiaries
                  filterBeneByCurrency
                  filterCurrency={selectedAccount?.currency}
                  filterMainCurrency={selectedAccount?.mainCurrency}
                  treasurySolutions="payments"
                />
              ))}
          </Col>
        </Row>
        <Spacer size={25} />
        <Row gutter={15}>
          <Col span={18}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={previousStepHandler}
                type="secondary"
                label="Previous"
                icon={{
                  name: "leftArrow",
                  position: "left"
                }}
              />
              {ConfirmModal ? (
                <Button
                  disabled={beneficiaryId ? false : true}
                  type="primary"
                  label={confirmBtnLabel}
                  icon={{
                    name: "rightArrow",
                    position: "right"
                  }}
                  onClick={() => dispatch(showModalAction(true))}
                />
              ) : (
                <Button
                  disabled={beneficiaryId ? false : true}
                  onClick={nextStepHandler}
                  loading={isRateFetching}
                  type="primary"
                  label="Continue"
                  icon={{
                    name: "rightArrow",
                    position: "right"
                  }}
                />
              )}
            </div>
          </Col>
        </Row>
        {ConfirmModal && <ConfirmModal show={showModal} />}
      </section>
      <NewBeneficiaryForm
        visible={showFormModal}
        hideModal={cancelNewBeneficiary}
        handleSubmit={submitNewBeneficiary}
        submitting={submittingBeneficiary}
        selectedCurrency={selectedAccount?.currency}
        mainCurrency={selectedAccount?.mainCurrency}
        product="payments"
      />
    </>
  );
};

export default Beneficiary;
