import React, { useEffect } from "react";
import { Button } from "@payconstruct/design-system";
import { Header, HeaderContent } from "../../../components/PageHeader/Header";
import { Spacer } from "../../../components/Spacer/Spacer";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/store";
import { Account } from "../../../services/accountService";
import { AccountRadioGroup } from "./AccountRadioGroup/AccountRadioGroup";
import {
  selectAccountSelection,
  selectAccountCurrency,
  selectAccountAction
} from "./AccountSelectionSlice";
import { useGetExitCurrencyQuery } from "../../../services/routesService";
import { updateFormValue } from "../DepositAmount/DepositAmountSlice";
import { setToInitialPaymentDetails } from "../../Payments/PaymentSlice";
import { changeSettlementType } from "../Beneficiary/BeneficiarySlice";
import { ProductGroup } from "../../../enums/products/Products";

interface AccountSelectionProps {
  nextStepHandler?: () => void;
  hideUnavailableBalance?: boolean;
  filterByGlobalAccounts?: boolean;
  filterByProductGroup?: ProductGroup;
  treasurySolutions?: string;
  pageFor: string;
}

const AccountSelection: React.FC<AccountSelectionProps> = (props) => {
  const {
    nextStepHandler,
    hideUnavailableBalance = true,
    filterByProductGroup,
    treasurySolutions,
    pageFor
  } = props;
  const dispatch = useAppDispatch();

  const selectedAccount = useAppSelector(selectAccountSelection);
  const selectCurrency = useAppSelector(selectAccountCurrency);
  const isGlobalAccounts = filterByProductGroup === ProductGroup.GlobalPayments;

  useEffect(() => {
    if (selectCurrency) {
      dispatch(
        updateFormValue({
          buyCurrency: selectCurrency
        })
      );
    }
  }, [dispatch, selectCurrency]);

  useGetExitCurrencyQuery(
    {
      currency: selectCurrency ?? ""
    },
    {
      skip: !selectCurrency || isGlobalAccounts,
      refetchOnMountOrArgChange: !isGlobalAccounts
    }
  );

  const onChangeHandler = (accountId: string, accountsData: Account[]) => {
    const [account] = accountsData.filter((item) => item.id === accountId);

    dispatch(selectAccountAction(account));
    !isGlobalAccounts && dispatch(setToInitialPaymentDetails());
  };

  /* When Uncomponent we reset switch  */
  useEffect(() => {
    return () => {
      dispatch(changeSettlementType("external"));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <Header>
        <HeaderContent.Title
          subtitle={
            pageFor === "efx"
              ? "Select the currency you want to sell."
              : "Select your account preference"
          }
        >
          {pageFor === "efx" ? "Sell currency" : "Account Selection"}
        </HeaderContent.Title>
      </Header>
      <>
        <AccountRadioGroup
          defaultValue={selectedAccount?.id}
          hideUnavailableBalance={hideUnavailableBalance}
          filterByProductGroup={filterByProductGroup}
          onChange={onChangeHandler}
          treasurySolutions={treasurySolutions}
          pageFrom="accountSelection"
        />
        <Spacer size={40} />
        <Button
          disabled={selectedAccount?.id ? false : true}
          onClick={nextStepHandler}
          type="primary"
          label="Continue"
          icon={{
            name: "rightArrow",
            position: "right"
          }}
        />
      </>
    </section>
  );
};

export default AccountSelection;
