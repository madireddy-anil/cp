import { api as apiUrl } from "./authService";

export interface getUserSearchRequest {
  current: number;
  pageSize: number;
}

export interface GetUserResponse {
  status: string;
  data: {
    total: number;
    users: any[];
  };
  message: string;
}

export interface GetUserRequest {
  current: number;
  pageSize: number;
  entityId: string;
  userId: string;
  roles: string;
}

export interface RemoveUserRequest {
  userId: string;
  entityId: string;
}

export interface ResetMFARequest {
  userId: string;
}

export interface UpdateUserRequest {
  userId: string;
  data: { [key: string]: string };
}

export type CreateUserResponse = {
  status: string;
  data: any[];
  message: string;
};

export type CreateUserRequest = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  // phoneNumberPrefix: string | null;
  // phoneNumber: string | null;
  roleId: string | null;
};

export type RolesResponse = {
  data: {
    role: Roles[];
  };
};

export type Roles = {
  id: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  isDefault: boolean;
  isInternal: boolean;
  name: string;
  permissions: string[];
};

export const userManagementApi = apiUrl.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<RolesResponse, string>({
      query: () => {
        return {
          url: `/roles`,
          method: "GET"
        };
      }
    }),
    getAllUsers: builder.query<GetUserResponse, any>({
      query: (entityId) => {
        return {
          url: `/users/entity/${entityId}?limit=0&page=1`,
          method: "GET"
        };
      }
    }),
    getUsersByEntityId: builder.query<GetUserResponse, GetUserRequest>({
      query: (args) => {
        const { current, pageSize, entityId, userId, roles } = args;
        const page = current ? `?page=${current}` : ``;
        const limit = pageSize ? `&limit=${pageSize}` : ``;
        const id = userId ? `&id=${userId}` : ``;
        const role = roles ? `&role=${roles}` : ``;
        return {
          url: `/users/entity/${entityId}${page}${limit}${id}${role}`,
          method: "GET"
        };
      }
    }),
    getUsersOnSearch: builder.query<any, any>({
      query: (searchKey) => {
        return {
          url: `users/search/${searchKey.query}`,
          method: "GET"
        };
      }
    }),
    createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
      query: (args) => ({
        url: "cms-users",
        method: "POST",
        body: args
      })
    }),
    updateUser: builder.mutation<void, UpdateUserRequest>({
      query: ({ userId, data }) => {
        return {
          url: `/users/${userId}`,
          body: data,
          method: "PUT"
        };
      }
    }),
    resetMFA: builder.mutation<void, ResetMFARequest>({
      query: (args) => {
        return {
          url: `/mfa/reset`,
          body: args,
          method: "POST"
        };
      }
    }),
    removeUser: builder.mutation<void, RemoveUserRequest>({
      query: ({ userId, entityId }) => {
        return {
          url: `/users/${userId}/unlink-entities/${entityId}`,
          method: "DELETE"
        };
      }
    })
  }),
  overrideExisting: true
});

export const {
  useGetRolesQuery,
  useGetAllUsersQuery,
  useGetUsersByEntityIdQuery,
  useGetUsersOnSearchQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useResetMFAMutation,
  useRemoveUserMutation
} = userManagementApi;
