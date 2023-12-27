import { Currency } from "../services/currencies";
import { store } from "../redux/store";
import { EntityClient } from "../services/entities/entitiesEndpoint";
import {
  Permissions,
  UserRoles
} from "@payconstruct/fe-utils/dist/Enum/userManagementEnums";
import { isCurrencyPresent } from "../pages/Components/Helpers/currencyTag";

export const fractionFormat = (amount: any, maxDecimals?: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals ?? 6
  });
  return formatter.format(amount);
};

export function numberFormat(num: any) {
  //TODO it would be better toFixed function get the decimal from a config based on currency for supporting crypto
  if (num !== undefined) {
    return parseFloat(num)
      .toFixed(2) //Please note that to fixed function don't drop the decimal it round the number to ceil or floor
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  } else {
  }
}

export const formatCountriesListForOptionSet = (countries: any) => {
  return (countries || []).map((item: any) => {
    return [item.alpha2Code, item.name];
  });
};

export const formatCurrenciesListForOptionSet = (currencies: any) => {
  return (currencies || []).map((item: any) => {
    return [item.code, item.code];
  });
};

export const formatEntitiesForOptionSet = (lists: EntityClient[]) => {
  return (lists || []).map((item: EntityClient) => {
    return [item.id, item.genericInformation.registeredCompanyName];
  });
};

/**
 *
 * @function getCurrencyType
 *
 * @param currency string
 * @param currenciesList array
 *
 * @returns Currency Type either fiat or crypto
 *
 */
export const getCurrencyType = (currency: string, currenciesList: any[]) => {
  const selectedCurrency: any = currenciesList.find(
    (currencyItem: any) => currencyItem.code === currency
  );
  return selectedCurrency?.type;
};

/**
 *
 * @function getRandomString
 *
 * @param length number
 *
 * @returns Random string
 *
 */
export const getRandomString = (length?: number): string => {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, length ?? 5);
};

type ValueType = string | number;
export const currencyParser = (
  val: ValueType | undefined,
  locale = "en-US"
): number | string => {
  try {
    // for when the input gets clears
    if (typeof val === "string" && !val.length) {
      val = "0.0";
    }

    // detecting and parsing between comma and dot
    let group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, "");
    let decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, "");
    let reversedVal: string | number = String(val).replace(
      new RegExp("\\" + group, "g"),
      ""
    );

    reversedVal = reversedVal.replace(new RegExp("\\" + decimal, "g"), ".");
    //  => 1232.21 €

    // removing everything except the digits and dot
    reversedVal = reversedVal.replace(/[^0-9.]/g, "");
    //  => 1232.21

    // appending digits properly
    const digitsAfterDecimalCount = (reversedVal.split(".")[1] || []).length;
    const needsDigitsAppended = digitsAfterDecimalCount > 2;

    reversedVal = Number(reversedVal);

    if (needsDigitsAppended) {
      reversedVal = reversedVal * Math.pow(10, digitsAfterDecimalCount - 2);
    }

    return Number.isNaN(reversedVal) ? 0 : reversedVal;
  } catch (error) {
    console.error(error);
    return "0";
  }
};

export const fieldCurrencyFormatter = (
  value: ValueType | undefined,
  currency: string
) => {
  const { getState } = store;
  const state = getState();

  // Adding a cache subscription
  // const initiate = dispatch(
  //   currenciesApi.endpoints.getCurrencies.initiate("Currencies")
  // );
  // console.log("initiate", initiate);

  // Removing the corresponding cache subscription
  // result.unsubscribe();

  // Accessing cached data & request status
  // const result = currenciesApi.endpoints.getCurrencies.select(3)(state);
  // const { data, status, error } = result;

  const valueFormatted = Number(value);
  const currencyList = state?.currencies?.currencyList as Currency[];

  const currencyInfo = currencyList?.find((item: Currency) => {
    return item.code === currency;
  });

  if (currencyInfo && currencyInfo.type === "crypto") {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: Number(currencyInfo.decimals)
    }).format(valueFormatted);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency
  }).format(valueFormatted);
};

export const checkPermissionExist = (permission: string) => {
  const { getState } = store;
  const state = getState();
  const permissions = state.auth.permissions;
  return permissions?.includes(permission);
};

export const validateRestrictedURLs = () => {
  const { getState } = store;
  const state = getState();
  const isUserExistInApprovers = state.approval.isUserExistInApprovers;
  const userRole = state.auth.role;

  const urls: string[] = [];

  const pathUrls = {
    newPayment: "/new-payment",
    newOrder: "/order/deposit",
    paymentApprovals: "/transactions/approvals"
  };

  !checkPermissionExist(Permissions.paymentsWrite) &&
    urls.push(pathUrls.newPayment);

  !checkPermissionExist(Permissions.efxWrite) && urls.push(pathUrls.newOrder);

  if (userRole === UserRoles.Viewer) {
    !isUserExistInApprovers && urls.push(pathUrls.paymentApprovals);
  }
  if (userRole !== UserRoles.Viewer) {
    !checkPermissionExist(Permissions.paymentsWrite) &&
      urls.push(pathUrls.paymentApprovals);
  }
  return urls;
};

export const validationOnRoutes = (routes: any[]) => {
  const restrictedURLs = validateRestrictedURLs();
  return routes.filter((item: any) => !restrictedURLs?.includes(item?.path));
};

export const TruncateAccountNumber = (account: string): string => {
  const first4Digits = account.slice(0, 4);
  const last4Digits = account.slice(account.length - 4);

  return `${first4Digits}...${last4Digits}`;
};

export const currencyName = (iconName: string | undefined): any => {
  const currency = iconName && isCurrencyPresent(iconName);
  if (currency) return currency;
  return "error";
};

export const currencyWithMainCurrencyName = (
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

export const getAccountNumberByAccount = (account: any) => {
  if (account.accountIdentification?.accountNumber) {
    return account.accountIdentification.accountNumber;
  } else if (account.accountIdentification?.IBAN) {
    return account.accountIdentification?.IBAN;
  }
  return "";
};
