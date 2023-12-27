import { api as apiUrl } from "../authService";

// TODO This is not complete, I added just the data that I expect and will use at this moment.
// TODO Correctly type the API
export interface EntityClient {
  id: string;
  genericInformation: {
    tradingName: string;
    registeredCompanyName: string;
  };
}
export interface EntitiesResponse {
  status: string;
  data: {
    entities: EntityClient[];
  };
}

export const api = apiUrl.injectEndpoints({
  endpoints: (builder) => ({
    getEntities: builder.query<EntitiesResponse, any>({
      query: () => {
        return {
          url: `entities/clients`,
          method: "GET"
        };
      }
    })
  })
});

export const { useGetEntitiesQuery } = api;
