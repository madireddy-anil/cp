import { api as apiUrl } from "./authService";

export interface verificationPeoplesRes {
  data: {
    people: any[];
  };
  message: string;
  status: string;
}

export const api = apiUrl.injectEndpoints({
  endpoints: (builder) => ({
    getListOfPeople: builder.query<verificationPeoplesRes, any>({
      query: () => {
        return {
          url: `people`,
          method: "GET"
        };
      },
      providesTags: ["People"]
    }),
    addNewPeople: builder.mutation<any, any>({
      query: (args) => {
        return {
          url: `people`,
          body: args,
          method: "post"
        };
      },
      invalidatesTags: ["People"]
    }),
    removePeople: builder.mutation<any, any>({
      query: (args) => {
        return {
          url: `people/${args.id}`,
          method: "delete"
        };
      },
      invalidatesTags: ["People"]
    }),
    updatePeopleDetails: builder.mutation<any, any>({
      query: (args) => {
        return {
          url: `people/${args.id}`,
          body: args.body,
          method: "put"
        };
      },
      invalidatesTags: ["People"]
    })
  }),
  overrideExisting: true
});

export const {
  useGetListOfPeopleQuery,
  useAddNewPeopleMutation,
  useRemovePeopleMutation,
  useUpdatePeopleDetailsMutation
} = api;
