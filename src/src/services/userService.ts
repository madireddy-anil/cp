import { api as apiUrl } from "./authService";

export interface verificationUserRes {
  data: any;
  status: string;
}
export interface User {
  _id: string;
  id: string;
  createdAt: string;
  createdBy: string;
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
  entityId: string;
  firstName: string;
  lastName: string;
  email: string;
  portal: string;
  userType: string;
  mfaEnabled: boolean;

  lastActive: string;
  lastLogin: string;
  phoneNumber: string;
  phoneNumberPrefix: string;
  role: string;
}

export const api = apiUrl.injectEndpoints({
  endpoints: (builder) => ({
    getUserByEntityId: builder.query<verificationUserRes, any>({
      query: (args) => {
        return {
          url: `users?entityId=${args.id}`,
          method: "GET"
        };
      }
    }),
    getUserById: builder.query<{ data: User }, { id: string }>({
      query: ({ id }) => ({
        url: `users/${id}`,
        method: "GET"
      })
    })
  }),
  overrideExisting: true
});

export const { useGetUserByEntityIdQuery, useGetUserByIdQuery } = api;
