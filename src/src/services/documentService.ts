import { api as apiUrl } from "./authService";

export interface DocumentQusRes {
  data: any[];
  status: string;
  message: string;
}

export interface GetPreSignedURLReq {
  data: any;
  file: any;
}

export interface GetPreSignedURLRes {
  fileName: string;
  url: string;
}

export interface DocumentFileRes {
  fileData: { [key: string]: any };
  status: string;
  message: string;
}

export interface FileDeleteReq {
  fileName: string;
  documentType: string;
}

export interface FileDeleteRes {
  message: string;
}

export interface DocumentListProps {
  limit: number;
  label: string;
  name: string;
}

export interface ModalFormProps {
  documentType: string;
  reason: string;
  comment: string;
}

export const api = apiUrl.injectEndpoints({
  endpoints: (builder) => ({
    getDocumentQuestions: builder.query<DocumentQusRes, any>({
      query: () => {
        return {
          url: `required-documents`,
          method: "GET"
        };
      }
    }),
    // getDocumentFile: builder.query<DocumentFileRes, any>({
    //   query: () => {
    //     return {
    //       url: `documents/entity`,
    //       method: "GET"
    //     };
    //   }
    // }),
    getPresignedURL: builder.mutation<GetPreSignedURLRes, GetPreSignedURLReq>({
      query: (arg) => {
        return {
          url: `file-upload`,
          method: "Post",
          body: arg
        };
      }
    }),
    getDocumentFilesByEntityId: builder.query<any, any>({
      query: (params) => {
        return {
          url: `documents?entityId=${params.entityId}&documentType=${params.documentType}&limit=0`,
          method: "GET"
        };
      }
    }),
    deleteDocumentFile: builder.mutation<FileDeleteRes, FileDeleteReq>({
      query: (arg) => {
        return {
          url: `file-delete`,
          method: "POST",
          body: arg
        };
      }
    }),
    getPresignedURLForDownload: builder.mutation<any, any>({
      query: (args) => {
        const { payload, entityId } = args;
        return {
          url: `view-file?entityId=${entityId}`,
          method: "POST",
          body: payload
        };
      }
    })
  })
});

export const {
  useGetDocumentQuestionsQuery,
  useGetPresignedURLMutation,
  // useGetDocumentFileQuery,
  useGetDocumentFilesByEntityIdQuery,
  useDeleteDocumentFileMutation,
  useGetPresignedURLForDownloadMutation
} = api;
