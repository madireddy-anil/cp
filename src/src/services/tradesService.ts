import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tradeApiUrl } from "../config/variables";
import { EFXOrder } from "@payconstruct/pp-types";
import { prepareHeaders } from "./serviceHeaders";

export type CreateTradeResponse = {
  orderReference: string;
  id: string;
};
export interface TradeResponse {
  orders: EFXOrder[];
}

export interface OrderResponse {
  order: EFXOrder;
}

export const tradeApi = createApi({
  reducerPath: "tradeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: tradeApiUrl,
    prepareHeaders
  }),
  tagTypes: ["Trade", "VendorDetails", "Deposits"],
  endpoints: (builder) => ({
    createTrade: builder.mutation<CreateTradeResponse, any>({
      query: (credentials) => ({
        url: "orders",
        method: "POST",
        body: credentials
      }),
      invalidatesTags: ["Trade"]
    }),
    acceptTrade: builder.mutation<CreateTradeResponse, any>({
      query: ({ id }) => ({
        url: `order/${id}/accept`,
        method: "POST"
      }),
      invalidatesTags: ["Trade"]
    }),
    rejectTrade: builder.mutation<CreateTradeResponse, any>({
      query: ({ id }) => ({
        url: `order/${id}/reject`,
        method: "POST"
      }),
      invalidatesTags: ["Trade"]
    }),
    getTrades: builder.query<TradeResponse, any>({
      query: () => {
        return {
          url: "orders?limit=0",
          method: "GET"
        };
      }
    }),
    getTradeByID: builder.query<OrderResponse, { id: string }>({
      query: ({ id }) => {
        return {
          url: `order/${id}`,
          method: "GET"
        };
      },
      providesTags: ["Trade"]
    })
  })
});
export const {
  useGetTradesQuery,
  useCreateTradeMutation,
  useAcceptTradeMutation,
  useRejectTradeMutation,
  useGetTradeByIDQuery
} = tradeApi;
