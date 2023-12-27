import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { api } from "../../services/authService";
import { api as companyApi } from "../../services/companyService";
import { api as onboardApi } from "../../services/onBoardClientService";
import { userLogoutAction } from "../general/actions";

import { validationOnData, formatProductsData } from "../transformer";

// A "slice" is a collection of Redux reducer logic and
// actions for a single feature in your app

type SliceState = {
  step: number;
  kycStatus: string | null;
  isUserUpdatedCompanyInfo: boolean;
  currentStepOfCompany: number;
  brands: { [key: string]: any };
  selectedProducts: any[];
  progressLogs: { [key: string]: boolean };
  overAllRiskCategory: string;
  industries: any;
  isExternalClient: boolean;
  canFetchAPI: boolean;
};

const initialState: SliceState = {
  step: 0,
  kycStatus: null,
  isUserUpdatedCompanyInfo: false,
  isExternalClient: false,
  currentStepOfCompany: 0,
  brands: { products: [] },
  selectedProducts: [],
  progressLogs: {
    isCompanyInformationDone: false,
    isCompanyRequirementsDone: false,
    isCompanyStakeholdersAddedDone: false,
    isDocumentsUploadedDone: false,
    isOperationInformationDone: false,
    isRegulatoryInformationDone: false,
    isAllDirectorsAdded: false
  },
  overAllRiskCategory: "",
  industries: [],
  canFetchAPI: false
};

const companySlice = createSlice({
  name: "company",
  initialState: initialState,
  reducers: {
    updateSelectedCompanyStep: (state, action) => {
      state.step = action.payload;
    },
    nextStepAction: (state) => {
      state.step += 1;
    },
    previousStepAction: (state) => {
      if (state.step === 0) return;
      state.step -= 1;
    },
    updateCanFetchAPI: (state, action) => {
      state.canFetchAPI = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // .addCase("GET_CLIENT_BY_ID", (state: any, action: any) => {
      //   state.kycStatus = null;
      // })
      .addCase("GET_ALL_TERMS_OF_SERVICE", (state: any, action: any) => {
        state.kycStatus = null;
      })
      .addCase("GET_PEOPLE", (state: any, action: any) => {
        state.kycStatus = null;
      })
      .addCase("GET_CLIENT_BY_ID_SUCCESS", (state: any, action: any) => {
        const payload = action.payload;
        const formatProducts: any = formatProductsData(
          validationOnData(payload?.requiredProduct, "array")
        );

        state.kycStatus = payload?.kycInformation?.kycStatus;
        state.isUserUpdatedCompanyInfo = !state.isUserUpdatedCompanyInfo;
        state.overAllRiskCategory =
          payload?.riskCategory === null
            ? "high_risk_three"
            : payload?.riskCategory;
        state.progressLogs = payload?.progressLogs;
        state.selectedProducts = formatProducts;
      })
      .addCase(userLogoutAction, () => {
        return initialState;
      })
      .addMatcher(
        api.endpoints.getProfile.matchFulfilled,
        (state, { payload }) => {
          // selected products filter
          // state.kycStatus = payload?.data?.entity?.kycInformation?.kycStatus;
          const formatProducts: any = formatProductsData(
            validationOnData(payload.data?.entity?.requiredProduct, "array")
          );
          state.selectedProducts = formatProducts;
          state.progressLogs = payload.data?.entity?.progressLogs;
          state.overAllRiskCategory =
            payload.data?.entity?.riskCategory === null
              ? "high_risk_three"
              : payload.data?.entity?.riskCategory;
          state.industries =
            payload.data?.entity?.genericInformation?.industries;
        }
      )
      .addMatcher(
        companyApi.endpoints.getProducts.matchFulfilled,
        (state, { payload }) => {
          const filterProducts = validationOnData(
            payload.data?.brands[0]?.products,
            "array"
          );
          state.brands = filterProducts;
        }
      )
      .addMatcher(
        companyApi.endpoints.getCustomerInfo.matchFulfilled,
        (state, { payload }) => {
          const formatProducts: any = formatProductsData(
            validationOnData(payload.data?.requiredProduct, "array")
          );
          state.selectedProducts = formatProducts;
          state.progressLogs = payload.data?.progressLogs;
          state.kycStatus = payload?.data?.kycInformation?.kycStatus;
          // state.currentStepOfCompany= 2
        }
      )
      .addMatcher(
        companyApi.endpoints.updateClientInfo.matchFulfilled,
        (state, { payload }) => {
          state.kycStatus = payload.data?.kycInformation?.kycStatus;
          state.isUserUpdatedCompanyInfo = !state.isUserUpdatedCompanyInfo;
          state.overAllRiskCategory =
            payload.data?.riskCategory === null
              ? "high_risk_three"
              : payload.data?.riskCategory;
          state.progressLogs = payload.data?.progressLogs;
        }
      )
      .addMatcher(
        onboardApi.endpoints.addNewOnboardClient.matchFulfilled,
        (state, { payload }) => {
          state.kycStatus = "new";
        }
      );
  }
});

export const {
  updateSelectedCompanyStep,
  nextStepAction,
  previousStepAction,
  updateCanFetchAPI
} = companySlice.actions;

export const getCurrentStep = (state: RootState) => state.general.isMenuEnabled;
export const getKycStatus = (state: RootState) => state.company.kycStatus;
export const selectedProducts = (state: RootState) =>
  state.company.selectedProducts;

export default companySlice.reducer;
