import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { revokeTokenUrl } from "../config/variables";
import { prepareHeaders } from "./serviceHeaders";

export const revokeTokenApi = createApi({
  reducerPath: "revokeTokenApi",
  baseQuery: fetchBaseQuery({
    baseUrl: revokeTokenUrl,
    prepareHeaders
  }),
  endpoints: (builder) => ({
    revokeToken: builder.mutation<void, void>({
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

export const { useRevokeTokenMutation } = revokeTokenApi;
