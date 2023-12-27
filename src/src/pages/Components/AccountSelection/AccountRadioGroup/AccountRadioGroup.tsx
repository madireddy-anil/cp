import React from "react";
import { Empty, Space } from "antd";

import {
  RadioGroup,
  RadioCurrency,
  CurrencyTag,
  Text,
  Tooltip
} from "@payconstruct/design-system";
import { Spacer } from "../../../../components/Spacer/Spacer";
import {
  useGetAccountsQuery,
  Account
} from "../../../../services/accountService";
import {
  currencyName,
  currencyWithMainCurrencyName,
  fractionFormat,
  getAccountNumberByAccount
} from "../../../../utilities/transformers";
import { Spinner } from "../../../../components/Spinner/Spinner";
import { useGetAllProductsQuery } from "../../../../services/entities/productsEndPoints";
import { useGetCurrencyPairQuery } from "../../../../services/paymentService";
import { selectCurrencies } from "../../../../config/currencies/currenciesSlice";
import { useAppSelector } from "../../../../redux/hooks/store";
import {
  ProductGroup,
  ProductGroupMap
} from "../../../../enums/products/Products";
interface AccountRadioGroupProps {
  defaultValue?: string;
  filterByCurrency?: string;
  filterByMainCurrency?: string;
  filterByAccount?: string;
  filterByProductGroup?: ProductGroup;
  hideUnavailableBalance: boolean;
  hideSpecificAccounts?: boolean; // To hide crypto accounts based on conditions
  onChange: (accountId: string, accountsData: Account[]) => void;
  isLoading?: boolean;
  selectedAccount?: Account;
  treasurySolutions?: string;
  pageFrom?: string;
}
interface BeneAccount {
  buyCurrency: string;
  mainCurrency: string;
  restrictInCc: boolean;
  restrictInCp: boolean;
}

const AccountRadioGroup: React.FC<AccountRadioGroupProps> = ({
  defaultValue,
  filterByCurrency,
  filterByMainCurrency,
  filterByAccount,
  hideUnavailableBalance,
  filterByProductGroup,
  onChange,
  selectedAccount,
  treasurySolutions,
  pageFrom
}) => {
  const currenciesList = useAppSelector(selectCurrencies);

  const {
    accountsData = [],
    isFetching: isFetchingAccounts,
    isLoading: isLoadingAccounts
  } = useGetAccountsQuery("AccountGroup", {
    refetchOnMountOrArgChange: 5,
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      accountsData: data?.data?.accounts as Account[],
      isLoading,
      isFetching
    })
  });

  const { beneAccountsData = [] } = useGetCurrencyPairQuery(
    {
      currency: selectedAccount?.currency,
      mainCurrency: selectedAccount?.mainCurrency
    },
    {
      refetchOnMountOrArgChange: 5,
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        beneAccountsData: data?.buyCurrencies,
        isLoading,
        isFetching
      }),
      skip:
        pageFrom === "accountSelection" ||
        pageFrom === undefined ||
        selectedAccount?.currency === undefined
    }
  );

  const filteredBeneAccounts = accountsData?.filter((account: Account) => {
    return beneAccountsData.some((bAccount: BeneAccount) => {
      if (!bAccount?.restrictInCp) {
        if (bAccount?.mainCurrency) {
          return (
            account?.currency === bAccount?.buyCurrency &&
            account?.mainCurrency === bAccount?.mainCurrency
          );
        }
        return account?.currency === bAccount?.buyCurrency;
      }
      return false;
    });
  });

  const {
    productIds,
    isFetching: isFetchingProducts,
    isLoading: isLoadingProducts
  } = useGetAllProductsQuery("Products", {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      productIds: data?.data?.products
        ?.filter((product) => {
          if (
            filterByProductGroup &&
            ProductGroupMap[filterByProductGroup].includes(product.productCode)
          ) {
            return true;
          }
          return false;
        })
        ?.map((product) => product?.id),

      isLoading,
      isFetching
    }),
    skip: !filterByProductGroup,
    refetchOnMountOrArgChange: 5
  });

  const filteredAccounts = (
    pageFrom === "beneficiary" ? filteredBeneAccounts : accountsData
  ).filter((accounts: Account) => {
    // To format currency with maincurrency as CURRENCY(MAINCURRENCY) [e.g: USDT(ETH), USDC(TRX),... etc]
    // const currencyWithMainCurrency = `${accounts?.currency}${
    //   accounts?.mainCurrency ? `(${accounts?.mainCurrency})` : ""
    // }`;
    // const selectedCurrencyWithMainCurrency = `${selectedAccount?.currency}${
    //   selectedAccount?.mainCurrency ? `(${selectedAccount?.mainCurrency})` : ""
    // }`;

    // Filter out if there is no account with productId related to a group
    if (filterByProductGroup && !productIds?.includes(accounts.productId)) {
      // console.log("Accounts Product Id: ", accounts.productId);
      // console.log("Product Id: ", productId);
      return false;
    }

    if (
      hideUnavailableBalance &&
      Number(accounts?.balance?.availableBalance) <= 0
    )
      return false;

    // Hide crypto beneficiaries if EUR selected
    // REF: [TB-52] Disable EUR to crypto via Client Portal
    // if (
    //   hideSpecificAccounts &&
    //   selectedAccount?.currency === "EUR" &&
    //   accounts?.currencyType === "crypto"
    // )
    //   return false;

    // REF: Restriction on USDT (TRC / ERC) Transfers (PA-1316)
    // if (
    //   hideSpecificAccounts &&
    //   selectedCurrencyWithMainCurrency === "USDT(ETH)" &&
    //   currencyWithMainCurrency === "USDT(TRX)"
    // )
    //   return false;

    // if (
    //   hideSpecificAccounts &&
    //   selectedCurrencyWithMainCurrency === "USDT(TRX)"
    // ) {
    //   if (
    //     accounts?.currency !== "USD" &&
    //     accounts?.currency !== "GBP" &&
    //     accounts?.currency !== "EUR" &&
    //     currencyWithMainCurrency !== selectedCurrencyWithMainCurrency
    //   ) {
    //     return false;
    //   }
    // }

    // TEMP: OpenPayd vendor Id Validation, (linkedVendorAccount : 30a88877-a673-44de-9526-c4f3c6eeb10f)
    if (
      selectedAccount?.currency === "EUR" ||
      selectedAccount?.currency === "USD" ||
      selectedAccount?.currency === "GBP"
    ) {
      if (
        accounts?.linkedVendorAccount === "30a88877-a673-44de-9526-c4f3c6eeb10f"
      )
        return false;
    }

    if (accounts?.accountStatus === "inactive") return false;

    if (filterByCurrency && filterByCurrency !== accounts.currency)
      return false;

    if (filterByMainCurrency && filterByMainCurrency !== accounts.mainCurrency)
      return false;

    if (filterByAccount && filterByAccount === accounts.id) return false;
    return true;
  });

  if (
    isLoadingAccounts ||
    isFetchingAccounts ||
    isLoadingProducts ||
    isFetchingProducts
  )
    return <Spinner />;

  // showing different message when we hide zero balance account in account selection page on new payment.
  const getNoAccountMessage = () => {
    if (accountsData?.length === 0) {
      return "No Accounts ";
    } else if (hideUnavailableBalance && filteredAccounts?.length === 0) {
      return "Accounts with an available balance will appear here. Please deposit funds into an account prior to making a transfer.";
    } else {
      return "No Accounts ";
    }
  };

  const getCurrencyName = (currencyCode: string) => {
    if (!currencyCode) return "";
    return currenciesList.find(
      (currency: { [key: string]: string }) => currency.code === currencyCode
    )?.name;
  };

  //TODO: Move Out and create a sharable component
  if (!filteredAccounts || filteredAccounts?.length < 1)
    return (
      <div
        style={{ display: "flex", padding: "25px", justifyContent: "center" }}
      >
        <Empty
          description={
            <p>
              {getNoAccountMessage()}
              {filterByCurrency ? (
                <>
                  found for <b>{filterByCurrency}</b>
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

  return (
    <RadioGroup
      direction="horizontal"
      value={defaultValue}
      onChange={(e) => {
        onChange(e.target.value, accountsData);
      }}
    >
      {filteredAccounts.map((account: any) => {
        return (
          <>
            {treasurySolutions === "efx" && pageFrom === "accountSelection" ? (
              <RadioCurrency
                key={account.id}
                title={account?.currency}
                showTooltip={true}
                description={getCurrencyName(account?.currency)}
                checked={defaultValue === account.id}
                defaultChecked={defaultValue === account.id}
                value={account.id}
                currencySymbol={account?.currency}
              />
            ) : (
              <RadioCurrency
                key={account.id}
                title={fractionFormat(account.balance.availableBalance)}
                showTooltip={true}
                description={
                  <>
                    <Text label={account?.accountName ?? "N/A"} weight="bold" />
                    <Spacer size={5}></Spacer>
                    <Tooltip text={getAccountNumberByAccount(account)}>
                      <Text label={getAccountNumberByAccount(account)} />
                    </Tooltip>
                  </>
                }
                checked={defaultValue === account.id}
                defaultChecked={defaultValue === account.id}
                currencyTag={
                  <Space>
                    <CurrencyTag
                      currency={currencyWithMainCurrencyName(
                        account?.currency,
                        account?.mainCurrency
                      )}
                      prefix={currencyName(account?.currency)}
                    />
                  </Space>
                }
                value={account.id}
              />
            )}
          </>
        );
      })}
    </RadioGroup>
  );
};

export { AccountRadioGroup };
