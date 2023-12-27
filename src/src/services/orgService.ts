import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ProfileResponse } from "./authService";
import { authApiUrl } from "../config/variables";
import { prepareHeaders } from "./serviceHeaders";

export interface OrganizationsProps {
  organisationId: string;
  display_name: string;
  registeredCompanyName: string;
  entityId: string;
}

export const orgApi = createApi({
  reducerPath: "orgApi",
  baseQuery: fetchBaseQuery({
    baseUrl: authApiUrl,
    prepareHeaders
  }),
  endpoints: (builder) => ({
    getOrganizations: builder.query<any, any>({
      query: (userId) => {
        return {
          url: `users/${userId}/organisations`,
          method: "GET"
        };
      }
    }),
    getUserProfile: builder.query<ProfileResponse, any>({
      query: () => ({
        url: "profile",
        method: "GET"
      })
    }),
    getUser: builder.query<any, any>({
      query: (userId) => {
        return {
          url: `/users/${userId}`,
          method: "GET"
        };
      }
    })
  })
});

export const {
  useGetOrganizationsQuery,
  useGetUserQuery,
  useGetUserProfileQuery
} = orgApi;
