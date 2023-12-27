import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { chatSupportUrl } from "../config/variables";
import { prepareHeaders } from "./serviceHeaders";

export interface SupportTableResponse {
  data: any[];
}

export interface ChatMessageResponse {
  data: { [key: string]: string };
}

export const contactsApi = createApi({
  reducerPath: "contactsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: chatSupportUrl,
    prepareHeaders
  }),
  endpoints: (builder) => ({
    getTabledata: builder.query<SupportTableResponse, any>({
      query: () => {
        return {
          url: `a-queries`,
          method: "GET"
        };
      }
    })
  })
});

export const { useGetTabledataQuery } = contactsApi;
