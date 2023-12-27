import { Button, SwitchName, Notification } from "@payconstruct/design-system";
import { Row, Col } from "antd";
import React, { useEffect, useState } from "react";
import {
  Header,
  HeaderContent
} from "../../../../components/PageHeader/Header";
import { Spacer } from "../../../../components/Spacer/Spacer";
import { useGetBeneficiaryByClientIdQuery } from "../../../../services/beneficiaryService";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/store";
import { selectEntityId } from "../../../../config/auth/authSlice";
import {
  showModalAction,
  showFormModalAction,
  setSubmitting,
  changeSettlementType,
  setInternalAccountAction,
  selectNewBeneficiary
} from "../../../Components/Beneficiary/BeneficiarySlice";
import { Beneficiaries } from "../../../Components/Beneficiary/ExternalBeneficiaries/Beneficiaries";
import { AccountRadioGroup } from "../../../Components/AccountSelection/AccountRadioGroup/AccountRadioGroup";
import { selectAccounts } from "../../../../config/account/accountSlice";
import { selectDepositAmount } from "../../../Components/DepositAmount/DepositAmountSlice";
import NewBeneficiaryForm from "../../../../components/Modals/NewBeneficiary";
import { setLoading } from "../../../../config/general/generalSlice";
import { useCreateBeneficiaryMutation } from "../../../../services/beneficiaryService";
import { setBeneficiaryAction } from "../../../Components/Beneficiary/BeneficiarySlice";
import { Spinner } from "../../../../components/Spinner/Spinner";
import { ProductGroup } from "../../../../enums/products/Products";

// TODO Rename this File to Recipient. (Internal Account / Beneficiary) are distinct.
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
  const accounts: any = useAppSelector(selectAccounts);
  const {
    form: { sellCurrency, mainSellCurrency }
  } = useAppSelector(selectDepositAmount);
  const [newBeneficiary, { isLoading }] = useCreateBeneficiaryMutation();
  const [counter, setCounter] = useState<number>(0);

  const entityId = useAppSelector(selectEntityId);
  const { refetch, isLoading: isLoadingBeneficiariesList } =
    useGetBeneficiaryByClientIdQuery(
      { entityId },
      { refetchOnMountOrArgChange: true, skip: !entityId }
    );

  useEffect(() => {
    refetch();
  }, [refetch]);

  type settlementTypeOptionsType = {
    label: string;
    value: typeof settlementType;
  }[];

  const settlementTypeOptions: settlementTypeOptionsType = [
    { label: "Orbital Accounts", value: "internal" },
    { label: "External Beneficiaries", value: "external" }
  ];

  const onChangeSettlementType = (result: any) => {
    dispatch(changeSettlementType(result.settlementType));
  };

  const onChangeAccountSelection = (accountId: string) => {
    const [account] = accounts.filter((item: any) => item.id === accountId);

    dispatch(setInternalAccountAction(account));
  };

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch, isLoading]);

  const beneficiary = useAppSelector(selectNewBeneficiary);

  useEffect(() => {
    if (counter > 0) {
      dispatch(setBeneficiaryAction(beneficiary));
    }
  }, [dispatch, counter, beneficiary]);

  const submitNewBeneficiary = async (formData: any) => {
    const {
      requestedAccountType,
      currency,
      mainCurrency,
      nameOnAccount,
      branchCode,
      bic,
      accountNumber,
      iban,
      country,
      buildingNumber,
      zipOrPostalCode,
      stateOrProvince,
      city,
      street
    } = formData;
    const newBeneficiaryPayload = {
      entityId: entityId,
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
        nameOnAccount,
        accountNumber,
        bic,
        iban
      },
      isDeleted: false
    };
    dispatch(setSubmitting(true));
    try {
      await newBeneficiary(newBeneficiaryPayload).unwrap();
      dispatch(setLoading(false));
      dispatch(setSubmitting(false));
      Notification({
        message: "New Beneficiary",
        description: "New Beneficiary Created Successfully!",
        type: "success"
      });
      dispatch(showModalAction(true));
      refetch();
      setCounter(counter + 1);
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
          <HeaderContent.Title subtitle="Select a beneficiary account.">
            Beneficiary
          </HeaderContent.Title>
        </Header>
        <Row gutter={15}>
          <Col className="gutter-row" span={18}>
            <SwitchName
              selectedOption={settlementType === "internal" ? 0 : 1}
              name="settlementType"
              onChange={onChangeSettlementType}
              options={settlementTypeOptions}
            />
          </Col>
          <Col className="gutter-row" span={6}>
            {/* {settlementType === "internal" && (
              <Link label="+ New Account" url="/newAccount" size="small" />
            )} */}
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
                filterByCurrency={sellCurrency}
                filterByMainCurrency={mainSellCurrency}
                hideUnavailableBalance={false}
                filterByProductGroup={ProductGroup.GlobalPayments}
                onChange={onChangeAccountSelection}
                treasurySolutions={"efx"} // to make a specific product (e.g: efx, payments) conditions on common component
              />
            )}
            {settlementType === "external" && (
              <div>
                {isLoadingBeneficiariesList && <Spinner />}
                <Beneficiaries
                  filterBeneByCurrency
                  filterMainCurrency={mainSellCurrency}
                  treasurySolutions="efx"
                />
              </div>
            )}
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
        selectedCurrency={sellCurrency}
        mainCurrency={mainSellCurrency}
        product="efx"
      />
    </>
  );
};

export default Beneficiary;
