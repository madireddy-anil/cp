import { createSlice } from "@reduxjs/toolkit";
// import { RootState } from "../../redux/store";
import { api } from "../../services/authService";
import { api as companyApi } from "../../services/companyService";
import { userLogoutAction } from "../general/actions";
import {
  formatGenericInfoForInitialData,
  validationOnData
} from "../transformer";

// A "slice" is a collection of Redux reducer logic and
// actions for a single feature in your app

type SliceState = {
  registeredCompanyName: string;
  companyType: string;
  tradingName: string;
  companyNumber: string;
  websiteAddress: any[];
  address: any[];
  industries: any[];
  initialCompanyInfoFormData: { [key: string]: string };
};

const initialState: SliceState = {
  registeredCompanyName: "",
  companyType: "",
  tradingName: "",
  companyNumber: "",
  websiteAddress: [""],
  address: [],
  industries: [],
  initialCompanyInfoFormData: {}
};

const companyInformationSlice = createSlice({
  name: "companyInformation",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userLogoutAction, () => {
        return initialState;
      })
      .addCase("GET_CLIENT_BY_ID_SUCCESS", (state: any, action: any) => {
        const payload = action.payload;
        state.initialCompanyInfoFormData = formatGenericInfoForInitialData(
          payload?.genericInformation
        );
        state.registeredCompanyName =
          payload?.genericInformation?.registeredCompanyName;
        state.companyType = payload?.genericInformation?.companyType;
        state.tradingName = payload?.genericInformation?.tradingName;
        state.companyNumber = payload?.genericInformation?.companyNumber;
        state.websiteAddress = payload?.genericInformation?.websiteAddress;
        state.address = payload?.genericInformation?.addresses;
        state.industries = payload.data?.entity?.genericInformation?.industries;
      })
      .addMatcher(
        api.endpoints.getProfile.matchFulfilled,
        (state, { payload }) => {
          state.initialCompanyInfoFormData = formatGenericInfoForInitialData(
            payload.data?.entity?.genericInformation
          );
          state.registeredCompanyName =
            payload.data?.entity?.genericInformation?.registeredCompanyName;
          state.companyType =
            payload.data?.entity?.genericInformation?.companyType;
          state.tradingName =
            payload.data?.entity?.genericInformation?.tradingName;
          state.companyNumber =
            payload.data?.entity?.genericInformation?.companyNumber;
          state.websiteAddress =
            payload.data?.entity?.genericInformation?.websiteAddress;
          state.address = payload.data?.entity?.genericInformation?.addresses;
          state.industries =
            payload.data?.entity?.genericInformation?.industries;
        }
      )
      .addMatcher(
        companyApi.endpoints.updateClientInfo.matchFulfilled,
        (state, { payload }) => {
          state.initialCompanyInfoFormData = formatGenericInfoForInitialData(
            payload.data?.genericInformation
          );
          state.registeredCompanyName =
            payload.data?.genericInformation?.registeredCompanyName;
          state.companyType = payload.data?.genericInformation?.companyType;
          state.tradingName = payload.data?.genericInformation?.tradingName;
          state.companyNumber = payload.data?.genericInformation?.companyNumber;
          state.websiteAddress =
            payload.data?.genericInformation?.websiteAddress;
          state.address = payload.data?.genericInformation?.addresses;
          state.industries = validationOnData(
            payload.data?.genericInformation?.industries,
            "array"
          );
        }
      );
  }
});

export default companyInformationSlice.reducer;
