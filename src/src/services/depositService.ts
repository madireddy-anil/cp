import { tradeApi } from "./tradesService";
import { financeApiUrl } from "../config/variables";

export interface OrderDepositDetails {
  PK: string;
  SK: string;
  valueDate: string;
  currency: string;
  accountId: string;
  orderId: string;
  balanceId: string;
  status: "complete" | string;
  vendorId: string;
  depositDocument?: string[];
  remittanceDocument?: string[];
  expectedRate: string;
  batchId: string;
  remitted: string;
  deposited: string;
  expected: string;
  isFirstLeg: boolean;
  type: "exchange" | "local";
  key: string;
  accountNumber: string;
  country: string;
  instructions: string;
  notes: string;
  minAmount: number;
  maxAmount: number;
  partial?: boolean;
  time: string;
  timeZone: TimeZone;
}
export interface TimeZone {
  abbrev: string;
  altName: string;
  label: string;
  offset: number;
  value: string;
}

export interface OrderLegVendorDetails {
  name: string;
  expected: string;
  unassigned: number;
  leg: "exchange" | "local";
  vendorId: string;
  currency: string;
  locked: boolean;
  deposits: OrderDepositDetails[];
}

export interface DepositDetailsResponse {
  deposits: OrderDepositDetails[];
}

export interface VendorDetailsResponse {
  deposits: OrderLegVendorDetails[];
}

export interface DepositResponse {
  deposits: any[];
  orders: any[];
}

export interface verificationUserRes {
  data: any;
  status: string;
}

export interface AssignFundsRequest {
  orderId: string;
  id: string; // the uuid or accountNumber you select from the dropdown
  leg: "exchange" | "local"; // leg attached to modal
  vendorId: string; // vendor attached to modal
  amount: number; // input in modal
  currency: string; // ccy attached to modal
}

export interface SaveLegRequest {
  orderId: string;
  leg: "exchange" | "local";
  vendorId: string;
  currency: string;
}

// TODO: financeApiUrl is a New base URL, it should have it's on API Creator, not a injector.
// TODO: other wise it will compose the URL Creator + financeApiUrl
export const api = tradeApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeposits: builder.query<VendorDetailsResponse, any>({
      query: ({ id }) => {
        return {
          url: `${financeApiUrl}/deposits/${id}`,
          method: "GET"
        };
      },
      providesTags: ["Deposits"]
    }),
    depositDetail: builder.mutation<any, any>({
      query: (detailPayload) => ({
        url: `${financeApiUrl}/details`,
        method: "POST",
        body: detailPayload
      }),
      invalidatesTags: ["VendorDetails"]
    }),
    getDepositDetail: builder.query<DepositDetailsResponse, { id: string }>({
      query: ({ id }) => {
        return {
          url: `${financeApiUrl}/details/${id}`,
          method: "GET"
        };
      },
      providesTags: ["VendorDetails"]
    }),
    confirmDeposit: builder.mutation<any, any>({
      query: (confirmDepositPayload) => ({
        url: `${financeApiUrl}/confirm/deposit/slips`,
        method: "POST",
        body: confirmDepositPayload
      }),
      invalidatesTags: ["Deposits"]
    })
  }),
  overrideExisting: true
});

export const { useGetDepositsQuery, useConfirmDepositMutation } = api;
