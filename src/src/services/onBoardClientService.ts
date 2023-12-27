import { api as apiUrl } from "./authService";

export interface OnboardClientRequest {
  userId: string | undefined;
  registeredCompanyName: string;
  groupName: string;
}

export interface OnboardClientResponse {
  status: string;
  message: string;
  data: any;
}

export const api = apiUrl.injectEndpoints({
  endpoints: (builder) => ({
    addNewOnboardClient: builder.mutation<
      OnboardClientResponse,
      OnboardClientRequest
    >({
      query: ({ userId, registeredCompanyName, groupName }) => {
        return {
          url: `users/${userId}/onboard-client`,
          body: { registeredCompanyName, groupName },
          method: "post"
        };
      }
    }),
    getGroupsById: builder.query<any, any>({
      query: (groupId) => {
        return {
          url: `entity-groups/${groupId}`,
          method: "GET"
        };
      }
    })
  }),
  overrideExisting: true
});

export const { useAddNewOnboardClientMutation, useGetGroupsByIdQuery } = api;
