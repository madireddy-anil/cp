import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authApiUrl } from "../config/variables";
import { prepareHeaders } from "./serviceHeaders";

export interface User {
  firstName: string;
  lastName: string;
}

export interface UserResponse {
  user: User;
  token: string;
  data: {
    mfa_token: string;
    isMFAset: boolean;
    mfa_required: boolean;
    refresh_token: string;
    access_token: string;
  };
  message: string;
}
export interface LoginRequest {
  portal: string;
  email: string | null;
  password: string | null;
  remember: boolean;
}

export interface SignupRequest {
  email: string;
  emailSubscription: boolean;
  firstName: string;
  lastName: string;
  password: string;
  portal: string;
  tAndCsAccepted: boolean;
  privacyAndPolicy: boolean;
  cookiePolicy: boolean;
  use_mfa: boolean;
}
export interface SignupResponse {
  status: string;
  data: {
    access_token: string;
    refresh_token: string;
    id_token: string;
    scope: string;
    expires_in: number;
    token_type: "Bearer";
  };
  message: string;
}

export interface SetupTwoFARequest {
  authenticator_types: any[];
  mfa_token: string | null;
}

export interface SetupTwoFAResponse {
  message: string;
  data: {
    barcodeUri: string;
    mfa_token: string;
  };
}

export interface TwoFAQrCodeResponse {
  data: {
    barcode_uri: string;
    recovery_codes: any[];
  };
}

export interface VerifiyMFARequest {
  refreshToken: string | null;
  otp: string;
}

export interface ProfileResponse {
  status: string;
  data: {
    id: string;
    addressValidated: boolean;
    addressVerified: boolean;
    mobilePhoneValidated: boolean;
    mobilePhoneVerified: boolean;
    emailValidated: boolean;
    emailVerified: true;
    loginFailCount: number;
    isProfileUpdated: boolean;
    tAndCsAccepted: boolean;
    emailSubscription: boolean;
    active: boolean;
    _id: string;
    entityId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    phoneNumberPrefix: string;
    portal: string;
    userType: string;
    mfaEnabled: boolean;
    role: { [key: string]: string };
    entities: ProfileResponse["data"]["entity"][];
    entity: {
      id: string;
      brands: [
        {
          products: any[];
        }
      ];
      requiredProduct: any[];
      documentsComment: any[];
      entityType: string;
      externalScreeningResult: string;
      genericInformation: {
        groupId: string;
        registeredCompanyName: string;
        tradingName: string;
        companyNumber: string;
        companyType: string;
        tier: string;
        parentId: string;
        countryOfIncorporation: string;
        isParent: string;
        hasPartnerCompanies: string;
        addresses: any[];
        websiteAddress: any[];
        linkedCompanyIds: any[];
        industries: any[];
      };
      kycInformation: {
        kycRefreshInformation: {
          questions: {
            isExpectedChanges: boolean;
          };
        };
        kycStatus: string;
      };
      profile: { [key: string]: any };
      progressLogs: { [key: string]: boolean };
      regulatoryDetails: {
        licenses: [
          {
            id: string;
            documentId: string;
            licenseType: string;
            licenseHolderName: string;
            licenseNumber: string;
            regulatedCountry: string;
            regulatoryLicenseShared: boolean;
            reason: string;
            comments: string;
          }
        ];
        licenseHolderName: string;
        transactionMonitor: boolean;
        amlPolicyDetails: {
          amlPolicyShared: boolean;
          comments: string;
        };
        isOperatingInRiskCountries: boolean;
        subjectToRegulatoryEnforcement: boolean;
        flowOfFundsComment: string;
        reasonForUsingOurServices: string;
        majorityClientBase: string;
        majorityClientJurisdiction: any[];
      };
      operationsDetails: {
        ecommercePayments: {
          deposits_payins: [
            {
              id: string;
              currency: string;
              monthlyNumberOfTransactions: string | number;
              monthlyValueOfTransactions: string | number;
              averageSingleTransactionValue: string | number;
            }
          ];
          payouts: [
            {
              id: string;
              currency: string;
              monthlyNumberOfTransactions: string | number;
              monthlyValueOfTransactions: string | number;
              averageSingleTransactionValue: string | number;
            }
          ];
        };
        exoticFx: { exoticFxCurrencyPairs: any[] };
        fx: { fxCurrencyPairs: any[] };
        globalAccounts: {
          inbound: any[];
          outbound: any[];
        };
      };
      riskCategory: string;
      termsOfService: { versionId: undefined };
    };
  };
}

export interface MFARequest {
  code: string;
  email: string | null;
  mfa_token: string | null;
}

export interface MFAResponse {
  status: string;
  message: string;
  data: {
    access_token: string;
    expires_in: number;
    token_type: "Bearer";
    refresh_token: string;
  };
}

export interface ResetPasswordRequest {
  email: string;
}
//TODO Verify expected response data format
export interface ResetPasswordResponse {
  status: string;
  message: string;
  data: { [key: string]: string };
}

//TODO Verify expected Request data format
export interface ChangePasswordRequest {
  // password: string;
  newPassword: string;
  confirmPassword: string;
  token: string | null;
}

//TODO Verify expected response data format
export interface ChangePasswordResponse {
  message: string;
  data: { [key: string]: string };
}

// Verify the Password request data format
export interface VerifyPasswordRequest {
  password: string | null;
}

export interface VerifyPasswordResponse {
  status: string;
  message: string;
  data: { [key: string]: string };
}

//Send Email Verify expected request data format

export interface ResendEmailRequest {
  email: string | null;
}

//Send Email Verify expected response data format
export interface ResendEmailResponse {
  status: string;
  message: string;
  data: { [key: string]: string };
}

// update email address
export interface UpdateEmailRequest {
  email: string | null;
}

export interface UpdateEmailResponse {
  status: string;
  message: string;
  data: { [key: string]: string };
}

//update phone number
export interface UpdatePhoneRequest {
  id: any;
  data: any;
}

export interface UpdatePhoneResponse {
  status: string;
  message: string;
  data: { [key: string]: string };
}

// update Terms Of Service
export interface UpdateTermsOfServiceResponse {
  status: string;
  message: string;
  data: {
    termsOfService: any[];
    total: number;
  };
}

export interface TermsOfServicesResponse {
  status: string;
  data: { [key: string]: any };
  message: string;
}

// Reset 2FA QR Code Setup
export interface ResetTwoFAQrCodeRequest {
  authenticatorTypes?: any[];
  password: string | null;
  recoveryCode?: string | null;
}

export interface ResetTwoFAQrCodeResponse {
  status: string;
  message: string;
  data: { [key: string]: string };
}

// Disable the Two Factor Setup

export interface DisableTwoFAQrCodeRequest {
  authenticatorTypes?: any[];
}

export interface DisableTwoFAQrCodeResponse {
  status: string;
  message: string;
  data: { [key: string]: string };
}

export interface RefreshTokenRequest {
  refresh_token: string | null;
  isAccessTokenRequired: boolean;
}

export interface RefreshTokenResponse {
  data: { [key: string]: string };
}

export const api = createApi({
  reducerPath: "authApi",
  tagTypes: ["Entity", "People", "TermsOfService", "Profile", "Send_Email"],
  baseQuery: fetchBaseQuery({
    baseUrl: authApiUrl,
    prepareHeaders
  }),
  endpoints: (builder) => ({
    login: builder.mutation<UserResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials
      })
    }),
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (credentials) => ({
        url: "auth/signup",
        method: "POST",
        body: credentials
      })
    }),
    setupTwoFA: builder.mutation<SetupTwoFAResponse, SetupTwoFARequest>({
      query: (credentials) => ({
        url: "auth/setup-authenticator",
        method: "POST",
        body: credentials
      })
    }),
    getTwoFAQrCode: builder.mutation<TwoFAQrCodeResponse, any>({
      query: (credentials) => ({
        url: "mfa/enable",
        method: "POST",
        body: credentials
      })
    }),
    disableTwoFAQrCode: builder.mutation<
      DisableTwoFAQrCodeResponse,
      DisableTwoFAQrCodeRequest
    >({
      query: (credentials) => ({
        url: "mfa/disable",
        method: "POST",
        body: credentials
      })
    }),
    resetTwoFAQrCode: builder.mutation<
      ResetTwoFAQrCodeResponse,
      ResetTwoFAQrCodeRequest
    >({
      query: (credentials) => ({
        url: "mfa/associate",
        method: "POST",
        body: credentials
      })
    }),
    verfiyMFACode: builder.mutation<any, VerifiyMFARequest>({
      query: (credentials) => ({
        url: "mfa/verify-otp",
        method: "POST",
        body: credentials
      })
    }),
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (credentials) => ({
        url: "auth/password/reset",
        method: "POST",
        body: credentials
      })
    }),
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (credentials) => ({
        url: "auth/password/change",
        method: "POST",
        body: credentials
      })
    }),
    verifyPassword: builder.mutation<
      VerifyPasswordResponse,
      VerifyPasswordRequest
    >({
      query: (credentials) => ({
        url: "verify-password",
        method: "POST",
        body: credentials
      })
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (data) => ({
        url: "auth/refresh-token",
        method: "POST",
        body: data
      })
    }),
    getProfile: builder.query<ProfileResponse, any>({
      query: () => ({
        url: "profile",
        method: "GET"
      })
    }),
    getUserById: builder.query<ProfileResponse, any>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET"
      }),
      providesTags: ["Send_Email"]
    }),
    protected: builder.mutation<{ message: string }, void>({
      query: () => "protected"
    }),
    twoFactorAuthentication: builder.mutation<MFAResponse, MFARequest>({
      query: (credentials) => ({
        url: "auth/login/otp",
        method: "POST",
        body: credentials
      })
    }),
    resendEmail: builder.mutation<ResendEmailResponse, ResendEmailRequest>({
      query: (email) => ({
        url: "confirm-email",
        method: "POST",
        body: email
      }),
      invalidatesTags: ["Send_Email"]
    }),
    updateEmailAddress: builder.mutation<
      UpdateEmailResponse,
      UpdateEmailRequest
    >({
      query: (email) => ({
        url: "email",
        method: "PUT",
        body: email
      })
    }),
    updatePhoneNumber: builder.mutation<
      UpdatePhoneResponse,
      UpdatePhoneRequest
    >({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: data
      })
    }),
    updateTermsOfService: builder.mutation<UpdateTermsOfServiceResponse, any>({
      query: (termsOfService) => ({
        url: "/entities/clients/terms-of-services",
        method: "PUT",
        body: termsOfService
      }),
      invalidatesTags: ["TermsOfService"]
    }),
    getClient: builder.query<any, any>({
      query: ({ clientId }) => ({
        url: `users?entityId=${clientId}`,
        method: "GET"
      })
    }),
    // Terms Of Service
    getLegalAgreements: builder.query<TermsOfServicesResponse, any>({
      query: () => {
        return {
          url: `terms-of-service?limit=0`,
          method: "GET"
        };
      }
    })
  })
});

export const {
  useLoginMutation,
  useProtectedMutation,
  useTwoFactorAuthenticationMutation,
  useSetupTwoFAMutation,
  useVerfiyMFACodeMutation,
  useGetTwoFAQrCodeMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
  useGetUserByIdQuery,
  useSignupMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
  useVerifyPasswordMutation,
  useResendEmailMutation,
  useUpdateEmailAddressMutation,
  useUpdatePhoneNumberMutation,
  useUpdateTermsOfServiceMutation,
  useGetClientQuery,
  useGetLegalAgreementsQuery,
  useResetTwoFAQrCodeMutation,
  useDisableTwoFAQrCodeMutation
} = api;
