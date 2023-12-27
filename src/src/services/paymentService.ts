import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { paymentUrl } from "../config/variables";
import { prepareHeaders } from "./serviceHeaders";

export interface CurrencyPairRequest {
  currency: string | undefined;
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

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: paymentUrl,
    prepareHeaders
  }),
  tagTypes: ["Transactions"],
  endpoints: (builder) => ({
    // ToDo: change any to corresponding type
    getCurrencyPair: builder.query<any, any>({
      query: ({ currency, mainCurrency }) => {
        const queryParam = mainCurrency ? `?mainCurrency=${mainCurrency}` : "";
        return {
          url: `payments/currency-pair/${currency}${queryParam}`,
          method: "GET"
        };
      }
    }),
    createNewPayment: builder.mutation<any, any>({
      query: (args) => {
        return {
          url: `payments`,
          method: "post",
          body: args
        };
      }
    }),
    createNewInternalTransferPayment: builder.mutation<any, any>({
      query: (payload) => {
        return {
          url: `payments`,
          method: "POST",
          body: payload
        };
      }
    }),
    getPaymentDetails: builder.query<any, any>({
      query: (args) => {
        const {
          entityId,
          accountId,
          currencyPair,
          direction,
          type,
          priority,
          amount,
          creditorAccountId,
          beneficiaryId
        } = args;
        return {
          url: `payments/${entityId}/${accountId}/${currencyPair}`,
          method: "GET",
          params: {
            direction,
            type,
            priority,
            amount,
            creditorAccountId,
            beneficiaryId,
            source: "cms"
          }
        };
      }
    })
  })
});

export const {
  useGetCurrencyPairQuery,
  useCreateNewPaymentMutation,
  useCreateNewInternalTransferPaymentMutation,
  useGetPaymentDetailsQuery
} = paymentApi;
