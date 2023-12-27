import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { beneficiaryApiUrl } from "../config/variables";
// import { BeneficiaryForm } from "@payconstruct/pp-types";
import {
  BeneficiaryDocument,
  BeneficiaryAccount,
  BeneficiaryDetails
} from "@payconstruct/pp-types/dist/entities/beneficiary";
import { prepareHeaders } from "./serviceHeaders";

// API Response mapped to Type
//TODO: walletAddress Changed to ---> walletDetails: {address: string;}
export interface newBeneficiaryDocument extends BeneficiaryDocument {
  walletDetails?: {
    address: string;
  };
  mainCurrency: string;
}

export interface BeneficiaryResponse {
  response: newBeneficiaryDocument[];
}

type CreateBeneficiaryResponse = {
  beneficiary: BeneficiaryObject;
};

export interface BeneficiaryByIdResponse {
  beneficiary: newBeneficiaryDocument;
}

export interface BeneficiaryObject {
  isSaved?: boolean;
  id: string;
  currency: string;
  isMigrated: boolean;
  status: string;
  accountDetails: BeneficiaryAccount;
  walletDetails?: {
    address: string;
  };
  beneficiaryDetails: BeneficiaryDetails;
  entityName: string;
  userReference?: string;
  aliasName?: string;
  type: string;
  createdAt: string;
}

export const beneficiaryApi = createApi({
  reducerPath: "beneficiaryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: beneficiaryApiUrl,
    prepareHeaders
  }),
  tagTypes: ["Beneficiary"],
  endpoints: (builder) => ({
    getAllBeneficiary: builder.query<BeneficiaryResponse, { limit: number }>({
      query: (args) => {
        return {
          url: `beneficiary?limit=${args?.limit ?? 0}`,
          method: "GET"
        };
      },
      providesTags: ["Beneficiary"]
    }),
    getBeneficiaryId: builder.query<BeneficiaryByIdResponse, { id: string }>({
      query: ({ id }) => {
        return {
          url: `beneficiary/${id}`,
          method: "GET"
        };
      },
      providesTags: ["Beneficiary"]
    }),
    getBeneficiaryByClientId: builder.query<
      BeneficiaryResponse,
      { entityId: string }
    >({
      query: (param) => {
        const { entityId } = param;
        return {
          url: `client/${entityId}`,
          method: "GET"
        };
      },
      providesTags: ["Beneficiary"]
    }),
    createBeneficiary: builder.mutation<CreateBeneficiaryResponse, any>({
      query: (newBeneficiaryPayload) => ({
        url: "beneficiary/createBeneficiary",
        method: "POST",
        body: newBeneficiaryPayload
      }),
      invalidatesTags: ["Beneficiary"]
    }),
    getBeneficiaryValidationFields: builder.query<any, any>({
      query: (args) => {
        const { currency, country, type } = args;
        const countryParam = country ? `&country=${country}` : "";
        return {
          url: `beneficiaryByValidation?currency=${currency}${countryParam}&type=${type}`,
          method: "GET"
        };
      }
    })
  })
});

export const {
  useGetAllBeneficiaryQuery,
  useGetBeneficiaryByClientIdQuery,
  useGetBeneficiaryIdQuery,
  useCreateBeneficiaryMutation,
  useGetBeneficiaryValidationFieldsQuery
} = beneficiaryApi;
