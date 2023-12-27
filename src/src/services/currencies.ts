import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { cmsServiceUrl } from "../config/variables";
import { prepareHeaders } from "./serviceHeaders";

export interface Currency {
  code: string;
  createdAt: string;
  currencyAccount: string;
  currencyReference: string;
  decimals: string;
  deposits: string;
  id: string;
  name: string;
  numericCode: string;
  payments: string;
  restrictedDeposits: string;
  type: string;
  updatedAt: string;
  mainCurrency: boolean | string;
}
export interface CurrenciesResponse {
  data: any;
}
export const currenciesApi = createApi({
  reducerPath: "currenciesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: cmsServiceUrl,
    prepareHeaders
  }),
  endpoints: (builder) => ({
    getCurrencies: builder.query<CurrenciesResponse, any>({
      query: () => {
        return {
          url: "currencies?limit=0",
          method: "GET"
        };
      }
    })
  })
});

export const { useGetCurrenciesQuery } = currenciesApi;
