import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { gppUrl } from "../config/variables";
import { prepareHeaders } from "./serviceHeaders";

export interface CountriesResponse {
  invitor: string | null;
  registeredCompanyName: string;
  peopleName: string | null;
  role: any[];
}

export interface ClientScreeningResponse {
  data: {
    message: string;
  };
}

export interface ClientScreeningRequestProps {
  data: {
    dateOfBirth: string;
    registeredAddress: { [key: string]: any };
    documentIssuerCountry: string;
    documentIssuerState: string;
    documentType: any;
    frontPageOfDocument: string;
    backPageOfDocument: string;
    selfie: string;
    documentsSubmissionType: string;
  };
}

export const gppApi = createApi({
  reducerPath: "gppApi",
  baseQuery: fetchBaseQuery({
    baseUrl: gppUrl,
    prepareHeaders
  }),
  endpoints: (builder) => ({
    getClientInformationIdv: builder.query<CountriesResponse, any>({
      query: (userId) => {
        return {
          url: `screening-user-details/${userId}`,
          method: "GET"
        };
      }
    }),
    updateScreeningInfo: builder.mutation<
      ClientScreeningResponse,
      ClientScreeningRequestProps
    >({
      query: (arg: any) => {
        const { userId, request } = arg;
        return {
          url: `screening-user-details/${userId}`,
          method: "PUT",
          body: request
        };
      }
    }),
    invitePeople: builder.mutation<any, any>({
      query: (args) => {
        return {
          url: `send-idv-verification-link`,
          method: "post",
          body: args.body
        };
      }
    })
  })
});

export const {
  useGetClientInformationIdvQuery,
  useUpdateScreeningInfoMutation,
  useInvitePeopleMutation
} = gppApi;
