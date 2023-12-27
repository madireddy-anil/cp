import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { cmsServiceUrl } from "../config/variables";
import { prepareHeaders } from "./serviceHeaders";

export interface CountriesResponse {
  data: {
    country: Country[];
  };
}

export interface Country {
  id: string;
  residency: string;
  payments: string;
  deposits: string;
  riskCategory: string;
  fiatCurrency: string;
  countryReference: string;
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  numericCode: number;
  telephonePrefix: string;
  isEEA: boolean;
  isEU: boolean;
  isForex: boolean;
  isGaming: boolean;
  createdAt: string;
  updatedAt: string;
}

export const countriesApi = createApi({
  reducerPath: "countriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: cmsServiceUrl,
    prepareHeaders
  }),
  endpoints: (builder) => ({
    getCountries: builder.query<CountriesResponse, any>({
      query: () => {
        return {
          url: "countries?limit=0",
          method: "GET"
        };
      }
    })
  })
});

export const { useGetCountriesQuery } = countriesApi;
