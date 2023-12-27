import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Account as PPTypesAccount,
  BalanceUpdated
} from "@payconstruct/pp-types";
import { cmsServiceUrl } from "../config/variables";
import { prepareHeaders } from "./serviceHeaders";

export interface Account extends Omit<PPTypesAccount, "accountIdentification"> {
  accountHolderName: string;
  accountAddress: string[];
  issuerAddress: string[];
  issuerName: string;
  balance: BalanceUpdated; //Not Mapped
  isActiveAccount: boolean; // Not Mapped
  accountStatus: "active" | "inactive" | "blocked";
  productId: string;
  productBrandId: string;
  accountIdentification: {
    accountRegion: string;
    accountNumber: string;
    bankCode: string;
    IBAN: string;
    BIC: string;
  };
  mainCurrency: string;
  linkedVendorAccount: string;
}

export interface AccountsResponse {
  data: Account[];
  accounts: Account[];
}

export interface AccountResponse {
  data: Account;
}

export interface TransactionsResponse {
  data: { transactions: Transaction[] };
}

export interface Transaction {
  id: string;
  amount: string;
  availableBalance: string;
  balance: string;
  balanceId: string;
  blockUnblock: string;
  blockedBalance: string;
  correctedValueDate: string;
  createdAt: string;
  debitCredit: string;
  payments: Payment;
  reference: string;
  remarks: string;
  status: string;
  valueDate: string;
}

export interface Payment {
  accountBalanceId: string;
  accountId: string;
  accountingResult: string;
  chargeBearer: string;
  createdAt: string;
  createdBy: string;
  creditAmount: number;
  creditCurrency: string;
  creditor: { creditorName: string };
  creditorAccount: string;
  creditorAccountType: string;
  creditorAgent: { creditorAgentId: string };
  debitAmount: null;
  debtorAccount: string;
  debtorAccountType: string;
  debtorAgent: { debtorAgentId: string };
  endToEndReference: string;
  exitStatusCode: string;
  fees: {
    actualInvoiceFee: number;
    actualLiftingFee: number;
    invoiceAmount: number;
    invoiceCurrency: string;
    invoiceFeeMethod: string;
    liftingFeeAmount: number;
    liftingFeeCurrency: string;
    liftingFeeMethod: string;
    pricingProfileId: string;
  };
  debtor?: {
    debtorName: string;
  };
  debitCurrency?: string;
  id: string;
  instructionPriority: string;
  instructionReceivedDate: string;
  instructionReference: string;
  isDuplicate: boolean;
  isOutbound: boolean;
  isReturn: boolean;
  isTreasury: boolean;
  messageState: string;
  messageType: string;
  messageValidationResult: string;
  originalInstructedAmount: string;
  ownerEntityId: string;
  processFlow: string;
  reference: {
    settlementVendorId: string;
    debtorCurrencyType: "fiat" | "crypto";
  };
  remittanceInformation: string;
  requestedValueDate: string;
  settlementChannel: string;
  transactionReference: string;
  uetr: string;
  updatedAt: string;
  valueDate: string;
  vendorAccountId: string;
  vendorBalanceId: string;
  foreignExchange: {
    allInRate: string;
  };
  internalPayment: boolean;
}

export interface NewAccountCreationRequest {
  accountName: string;
  currency: string;
  currencyId?: string;
  currencyType?: string;
  mainCurrency: string;
  mainCurrencyId?: string;
}
export interface NewAccountCreationResponse {
  status: string;
  message: string;
  data: { [key: string]: string };
}

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: fetchBaseQuery({
    baseUrl: cmsServiceUrl,
    prepareHeaders
  }),
  tagTypes: ["Account"],
  endpoints: (builder) => ({
    getAccounts: builder.query<any, any>({
      query: (args) => {
        const { pageNumber, pageSize } = args;
        return {
          url: "accounts",
          params: { page: pageNumber, limit: pageSize }
        };
      }
    }),
    getAccount: builder.query<AccountResponse, { accountId: string }>({
      query: ({ accountId }) => {
        return {
          url: `accounts/${accountId}`,
          method: "GET"
        };
      },
      providesTags: ["Account"]
    })
  })
});

export const { useGetAccountsQuery, useGetAccountQuery } = accountApi;
