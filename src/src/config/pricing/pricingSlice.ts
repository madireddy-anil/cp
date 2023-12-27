import { createSlice } from "@reduxjs/toolkit";
import { api as pricingApi } from "../../services/pricingService";
import { RootState } from "../../redux/store";

type SliceState = {
  exchangeRate?: any[];
  pricingPayments: Array<object>;
  staticFess: Array<object>;
};

const initialState: SliceState = {
  exchangeRate: [],
  pricingPayments: [],
  staticFess: []
};

const pricingSlice = createSlice({
  name: "pricing",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        pricingApi.endpoints.getForeignExchange.matchFulfilled,
        (state, { payload }) => {
          state.exchangeRate = payload.data;
        }
      )
      .addMatcher(
        pricingApi.endpoints.getPricingPayments.matchFulfilled,
        (state, { payload }) => {
          state.pricingPayments = payload.data;
        }
      )
      .addMatcher(
        pricingApi.endpoints.getPricingStaticFees.matchFulfilled,
        (state, { payload }) => {
          state.staticFess = payload.data;
        }
      );
  }
});

export const selectForeignExchange = (state: RootState) =>
  state.pricing.exchangeRate;
export const selectPricingPayments = (state: RootState) =>
  state.pricing.pricingPayments;
export const selectStaticFees = (state: RootState) => state.pricing.staticFess;

export default pricingSlice.reducer;
