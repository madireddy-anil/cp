import { api as apiUrl } from "./authService";

export interface DocumentFileRes {
  fileData: { [key: string]: any };
  status: string;
  message: string;
}

export const api = apiUrl.injectEndpoints({
  endpoints: (builder) => ({
    getDocumentFile: builder.query<DocumentFileRes, any>({
      query: () => {
        return {
          url: `documents`,
          method: "GET"
        };
      }
    })
  })
});

export const { useGetDocumentFileQuery } = api;
