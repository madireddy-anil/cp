import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { routesApiUrl } from "../config/variables";
import { EFXOrderFinancials } from "@payconstruct/pp-types";
import { prepareHeaders } from "./serviceHeaders";

type CurrencyResponse = string[];

type ExitCurrencyResponse = {
  currency: string;
  exitCurrencies: string[];
};

export interface IndicativeRateRates {
  expiresAt: string | null;
  inverseRate: string;
  quoteCurrency: string;
  rate: string;
  updatedAt: string;
}

export interface IndicativeRate {
  clientId: string;
  currency: string;
  rates: IndicativeRateRates[];
}

export interface IndicativeRateResponse {
  indicativeRate: IndicativeRate[];
}

export const routesApi = createApi({
  reducerPath: "routesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: routesApiUrl,
    prepareHeaders
  }),
  tagTypes: ["Routes", "Price"],
  endpoints: (builder) => ({
    getExitCurrency: builder.query<ExitCurrencyResponse, { currency: string }>({
      query: ({ currency }) => {
        return {
          url: `currency/${currency}`,
          method: "GET"
        };
      }
    }),
    getRoutes: builder.query<CurrencyResponse, { orderId: string }>({
      query: ({ orderId }) => {
        return {
          url: `routes/calculate/${orderId}`,
          method: "GET"
        };
      }
    }),
    getFinancials: builder.query<EFXOrderFinancials, { id: string }>({
      query: ({ id }) => ({
        url: `price/${id}`,
        method: "GET"
      }),
      providesTags: ["Price"]
    }),
    getIndicativeRate: builder.query<IndicativeRateResponse, any>({
      query: () => {
        return {
          url: `indicativeRate`,
          method: "GET"
        };
      },
      providesTags: ["Routes"]
    })
  })
});
export const {
  useGetExitCurrencyQuery,
  useGetRoutesQuery,
  useGetFinancialsQuery,
  useGetIndicativeRateQuery
} = routesApi;
