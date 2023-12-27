import { createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/authService";
import { api as companyApi } from "../../services/companyService";
import { validationOnData, getFormatedResponse } from "../transformer";

// A "slice" is a collection of Redux reducer logic and
// actions for a single feature in your app

type SliceState = {
  initialFormValues: { [key: string]: any };
  productType: string;

  // questions
  ecommercePaymentsQuestions: { [key: string]: any };
  exoticFXQuestions: any[];
  foreignExchangeQuestions: any[];
  globalAccountsQuestions: { [key: string]: any };

  // updated information
  ecommercePayment: { [key: string]: any };
  exoticFX: any[];
  foreignExchange: any[];
  globalAccounts: { [key: string]: any };
};

const initialState: SliceState = {
  initialFormValues: {},
  productType: "",

  // questions
  ecommercePaymentsQuestions: {
    deposits: [],
    payouts: []
  },
  exoticFXQuestions: [],
  foreignExchangeQuestions: [],
  globalAccountsQuestions: {
    inbound: [],
    outbound: []
  },

  // updated information
  ecommercePayment: {
    deposits_payins: [],
    payouts: []
  },
  exoticFX: [],
  foreignExchange: [],
  globalAccounts: {
    inbound: [],
    outbound: []
  }
};

const operationalInformationSlice = createSlice({
  name: "operationalInformation",
  initialState: initialState,
  reducers: {
    updateInitialFormValues(state, action) {
      return {
        ...state,
        initialFormValues: action.payload
      };
    },
    updateNewCurrencyState(state, action) {
      return {
        ...state,
        currencyAccount: action.payload
      };
    },
    updateSelectedProduct(state, action) {
      return {
        ...state,
        productType: action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase("GET_CLIENT_BY_ID_SUCCESS", (state: any, action: any) => {
        const payload = action.payload;
        state.ecommercePayment.deposits_payins = validationOnData(
          payload?.operationsDetails?.ecommercePayments?.deposits_payins,
          "array"
        );
        state.ecommercePayment.payouts = validationOnData(
          payload?.operationsDetails?.ecommercePayments?.payouts,
          "array"
        );

        // exotic fx
        state.exoticFX = validationOnData(
          payload?.operationsDetails?.exoticFx?.exoticFxCurrencyPairs,
          "array"
        );

        // foreign exchange
        state.foreignExchange = validationOnData(
          payload?.operationsDetails?.fx?.fxCurrencyPairs,
          "array"
        );

        //global accounst
        state.globalAccounts.inbound = validationOnData(
          payload?.operationsDetails?.globalAccounts?.inbound,
          "array"
        );
        state.globalAccounts.outbound = validationOnData(
          payload?.operationsDetails?.globalAccounts?.outbound,
          "array"
        );
      })
      .addMatcher(
        companyApi.endpoints.getOperationQuestionsByCategory.matchFulfilled,
        (state, { payload }) => {
          // questions
          state.ecommercePaymentsQuestions.deposits = getFormatedResponse(
            payload.data?.ecommerce_payments?.deposits,
            false
          );
          state.ecommercePaymentsQuestions.payouts = getFormatedResponse(
            payload.data?.ecommerce_payments?.payouts,
            false
          );
          state.exoticFXQuestions = getFormatedResponse(
            payload?.data?.exotix_fx,
            false
          );
          state.foreignExchangeQuestions = getFormatedResponse(
            payload?.data?.foreign_exchange,
            false
          );
          state.globalAccountsQuestions.inbound = getFormatedResponse(
            payload?.data?.global_accounts?.inbound,
            false
          );
          state.globalAccountsQuestions.outbound = getFormatedResponse(
            payload?.data?.global_accounts?.outbound,
            false
          );
        }
      )
      .addMatcher(
        companyApi.endpoints.createClientInfo.matchFulfilled,
        (state, { payload }) => {
          state.initialFormValues = {};
          // e commerce
          state.ecommercePayment.deposits_payins = validationOnData(
            payload.data?.operationsDetails?.ecommercePayments?.deposits_payins,
            "array"
          );
          state.ecommercePayment.payouts = validationOnData(
            payload.data?.operationsDetails?.ecommercePayments?.payouts,
            "array"
          );

          // exotic fx
          state.exoticFX = validationOnData(
            payload.data?.operationsDetails?.exoticFx?.exoticFxCurrencyPairs,
            "array"
          );

          // foreign exchange
          state.foreignExchange = validationOnData(
            payload.data?.operationsDetails?.fx?.fxCurrencyPairs,
            "array"
          );

          //global accounst
          state.globalAccounts.inbound = validationOnData(
            payload.data?.operationsDetails?.globalAccounts?.inbound,
            "array"
          );
          state.globalAccounts.outbound = validationOnData(
            payload.data?.operationsDetails?.globalAccounts?.outbound,
            "array"
          );
        }
      )
      .addMatcher(
        companyApi.endpoints.updateClientInfo.matchFulfilled,
        (state, { payload }) => {
          // e commerce
          state.ecommercePayment.deposits_payins = validationOnData(
            payload.data?.operationsDetails?.ecommercePayments?.deposits_payins,
            "array"
          );
          state.ecommercePayment.payouts = validationOnData(
            payload.data?.operationsDetails?.ecommercePayments?.payouts,
            "array"
          );

          // exotic fx
          state.exoticFX = validationOnData(
            payload.data?.operationsDetails?.exoticFx?.exoticFxCurrencyPairs,
            "array"
          );

          // foreign exchange
          state.foreignExchange = validationOnData(
            payload.data?.operationsDetails?.fx?.fxCurrencyPairs,
            "array"
          );

          //global accounst
          state.globalAccounts.inbound = validationOnData(
            payload.data?.operationsDetails?.globalAccounts?.inbound,
            "array"
          );
          state.globalAccounts.outbound = validationOnData(
            payload.data?.operationsDetails?.globalAccounts?.outbound,
            "array"
          );
        }
      )
      .addMatcher(
        companyApi.endpoints.deleteClientInfo.matchFulfilled,
        (state, { payload }) => {
          // e commerce
          state.ecommercePayment.deposits_payins = validationOnData(
            payload.data?.operationsDetails?.ecommercePayments?.deposits_payins,
            "array"
          );
          state.ecommercePayment.payouts = validationOnData(
            payload.data?.operationsDetails?.ecommercePayments?.payouts,
            "array"
          );

          // exotic fx
          state.exoticFX = validationOnData(
            payload.data?.operationsDetails?.exoticFx?.exoticFxCurrencyPairs,
            "array"
          );

          // foreign exchange
          state.foreignExchange = validationOnData(
            payload.data?.operationsDetails?.fx?.fxCurrencyPairs,
            "array"
          );

          //global accounst
          state.globalAccounts.inbound = validationOnData(
            payload.data?.operationsDetails?.globalAccounts?.inbound,
            "array"
          );
          state.globalAccounts.outbound = validationOnData(
            payload.data?.operationsDetails?.globalAccounts?.outbound,
            "array"
          );
        }
      )
      .addMatcher(
        api.endpoints.getProfile.matchFulfilled,
        (state, { payload }) => {
          // e commerce
          state.ecommercePayment.deposits_payins = validationOnData(
            payload.data?.entity?.operationsDetails?.ecommercePayments
              ?.deposits_payins,
            "array"
          );
          state.ecommercePayment.payouts = validationOnData(
            payload.data?.entity?.operationsDetails?.ecommercePayments?.payouts,
            "array"
          );

          // exotic fx
          state.exoticFX = validationOnData(
            payload.data?.entity?.operationsDetails?.exoticFx
              ?.exoticFxCurrencyPairs,
            "array"
          );

          // foreign exchange
          state.foreignExchange = validationOnData(
            payload.data?.entity?.operationsDetails?.fx?.fxCurrencyPairs,
            "array"
          );

          //global accounst
          state.globalAccounts.inbound = validationOnData(
            payload.data?.entity?.operationsDetails?.globalAccounts?.inbound,
            "array"
          );
          state.globalAccounts.outbound = validationOnData(
            payload.data?.entity?.operationsDetails?.globalAccounts?.outbound,
            "array"
          );
        }
      );
  }
});

export const {
  updateNewCurrencyState,
  updateSelectedProduct,
  updateInitialFormValues
} = operationalInformationSlice.actions;

export default operationalInformationSlice.reducer;
