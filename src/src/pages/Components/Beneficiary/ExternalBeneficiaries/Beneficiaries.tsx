import React from "react";

import { Empty, Space } from "antd";

import {
  RadioGroup,
  RadioCurrency,
  CurrencyTag,
  Text,
  Tooltip
} from "@payconstruct/design-system";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/store";
import { newBeneficiaryDocument } from "../../../../services/beneficiaryService";
import { selectBeneficiary } from "../BeneficiarySlice";
import { isCurrencyPresent } from "../../Helpers/currencyTag";
import { selectDepositAmount } from "../../DepositAmount/DepositAmountSlice";
import { setBeneficiaryAction } from "../BeneficiarySlice";
import { setToInitialPaymentDetails } from "../../../Payments/PaymentSlice";

import { Spacer } from "../../../../components/Spacer/Spacer";

interface IExternalBeneficiary {
  filterBeneByCurrency: boolean;
  filterCurrency?: string;
  filterMainCurrency?: string;
  treasurySolutions?: string;
}

const Beneficiaries: React.FC<IExternalBeneficiary> = (props) => {
  const { filterBeneByCurrency, filterCurrency, filterMainCurrency } = props;

  const dispatch = useAppDispatch();

  const {
    form: { sellCurrency }
  } = useAppSelector(selectDepositAmount);
  const { beneficiaryList, beneficiaryId } = useAppSelector(selectBeneficiary);

  const getFilteredBeneficiaries = (filterBeneByCurrency: boolean) => {
    if (beneficiaryList && beneficiaryList.length > 0) {
      if (filterBeneByCurrency) {
        return beneficiaryList.filter((beneficiary: any) => {
          if (beneficiary.mainCurrency || filterMainCurrency !== "ETH") {
            return (
              beneficiary.currency ===
                (sellCurrency !== "" ? sellCurrency : filterCurrency) &&
              beneficiary.mainCurrency === filterMainCurrency
            );
          }
          return (
            beneficiary.currency ===
            (sellCurrency !== "" ? sellCurrency : filterCurrency)
          );
        });
      } else {
        return beneficiaryList;
      }
    }
    return [];
  };

  const filteredBeneficiaries = getFilteredBeneficiaries(filterBeneByCurrency);

  const onChangeBeneficiaryHandler = (beneficiaryId: string) => {
    const [selectedBeneficiary] = filteredBeneficiaries.filter(
      (item: newBeneficiaryDocument) => item.id === beneficiaryId
    );

    dispatch(setBeneficiaryAction(selectedBeneficiary));
    dispatch(setToInitialPaymentDetails());
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

  //TODO: Move Out and create a sharable component
  if (filteredBeneficiaries.length < 1) {
    return (
      <div
        style={{ display: "flex", padding: "25px", justifyContent: "center" }}
      >
        <Empty
          description={
            <p>
              No beneficiaries{" "}
              {filterBeneByCurrency ? (
                <>
                  for{" "}
                  <b>
                    {sellCurrency !== "" ? sellCurrency : filterCurrency}{" "}
                    {filterMainCurrency ? `(${filterMainCurrency})` : ""}
                  </b>
                </>
              ) : (
                ""
              )}
            </p>
          }
          image={Empty.PRESENTED_IMAGE_DEFAULT}
        />
      </div>
    );
  }

  return (
    <RadioGroup
      direction="horizontal"
      value={beneficiaryId}
      onChange={(e) => {
        onChangeBeneficiaryHandler(e.target.value);
      }}
    >
      {filteredBeneficiaries.map(
        (beneficiary: newBeneficiaryDocument, i: number) => {
          const {
            id,
            currency,
            mainCurrency,
            accountDetails,
            beneficiaryDetails
          } = beneficiary;

          const description = (
            <>
              <Space>
                <CurrencyTag
                  currency={currencyWithMainCurrencyName(
                    currency,
                    mainCurrency
                  )}
                  prefix={currencyName(currency)}
                />
              </Space>
              <Spacer size={5}></Spacer>
              <Tooltip
                text={
                  accountDetails?.accountNumber ?? accountDetails?.iban ?? "N/A"
                }
              >
                <Text
                  label={
                    accountDetails?.accountNumber ??
                    accountDetails?.iban ??
                    "N/A"
                  }
                />
              </Tooltip>
            </>
          );

          const beneficiaryName = beneficiaryDetails?.name
            ? beneficiaryDetails?.name
            : accountDetails?.nameOnAccount;

          return (
            <RadioCurrency
              key={i}
              title={beneficiaryName ?? "No nameOnAccount"}
              checked={id === beneficiaryId}
              description={description}
              value={id}
              showTooltip
            />
          );
        }
      )}
    </RadioGroup>
  );
};

export { Beneficiaries };
