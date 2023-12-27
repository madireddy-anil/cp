import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { revokeTokenUrl } from "../config/variables";
import { prepareHeaders } from "./serviceHeaders";

export const orgTokenApi = createApi({
  reducerPath: "orgTokenApi",
  baseQuery: fetchBaseQuery({
    baseUrl: revokeTokenUrl,
    prepareHeaders
  }),
  endpoints: (builder) => ({
    revokeOrganisationToken: builder.mutation<void, void>({
      query: () => {
        return {
          url: `/revoke`,
          body: {},
          method: "POST"
        };
      }
    })
  })
});

export const { useRevokeOrganisationTokenMutation } = orgTokenApi;
