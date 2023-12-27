import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { termsOfServiceDocumentUrl } from "../config/variables";
import { prepareHeaders } from "./serviceHeaders";

export interface GetPreSignedDownloadURLReq {
  fileName: string;
}
export interface GetPreSignedDownloadURLRes {
  filePreSignedData: string;
}

export const termsOfServiceDocumentApi = createApi({
  reducerPath: "termsOfServiceDocumentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: termsOfServiceDocumentUrl,
    prepareHeaders
  }),
  endpoints: (builder) => ({
    getPresignedURLForDownload: builder.mutation<
      GetPreSignedDownloadURLRes,
      GetPreSignedDownloadURLReq
    >({
      query: (args) => {
        return {
          url: `download-presignedurl`,
          method: "POST",
          body: args
        };
      }
    })
  })
});

export const { useGetPresignedURLForDownloadMutation } =
  termsOfServiceDocumentApi;
