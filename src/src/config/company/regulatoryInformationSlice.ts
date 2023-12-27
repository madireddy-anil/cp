import { createSlice } from "@reduxjs/toolkit";
import { api as authApi } from "../../services/authService";
import { api as companyApi } from "../../services/companyService";
import { api as documentApi } from "../../services/documentService";
import {
  getFormatedResponse,
  updateFileNameInCurrentList
} from "../transformer";
import { userLogoutAction } from "../general/actions";
import { resetAction } from "../../pages/Onboarding/RegulatoryInformation/RegulatoryActions";
// import { RootState } from "../../redux/store";

// A "slice" is a collection of Redux reducer logic and
// actions for a single feature in your app

type SliceState = {
  regulatoryInformationQuestions: any[];
  licenseTypeOptions: any[];
  countriesOptions: any[];
  regulatoryDetails: any;
  currentFile: any;
  currentFileList: any[];
  canFetchQuestions: boolean;
  canCloseAddLicenseCard: boolean;
  isProfileUpdated: boolean;
  isLicenceLocationDuplicate: boolean;
};

const initialState: SliceState = {
  regulatoryInformationQuestions: [],
  licenseTypeOptions: [],
  countriesOptions: [],
  regulatoryDetails: {},
  currentFile: {},
  currentFileList: [],
  canFetchQuestions: true,
  canCloseAddLicenseCard: true,
  isProfileUpdated: false,
  isLicenceLocationDuplicate: false
};

const regulatoryInformationSlice = createSlice({
  name: "regulatoryInformation",
  initialState: initialState,
  reducers: {
    updateRegulatoryInformationQuestions(state, action) {
      return {
        ...state,
        regulatoryInformationQuestions: action.payload
      };
    },
    updateCanFetchQuestionsBoolean(state, action) {
      return {
        ...state,
        canFetchQuestions: action.payload
      };
    },
    updateCanCloseAddLicenseCardBoolean(state, action) {
      return {
        ...state,
        canCloseAddLicenseCard: action.payload
      };
    },
    updateCurrentFile(state, action) {
      return {
        ...state,
        currentFile: action.payload
      };
    },
    updateCurrentFileList(state, action) {
      return {
        ...state,
        currentFileList: action.payload
      };
    },
    updateIsLicenceDuplicate(state, action) {
      return {
        ...state,
        isLicenceLocationDuplicate: action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogoutAction, () => {
        return initialState;
      })
      .addCase(resetAction, () => {
        return initialState;
      })
      .addCase("GET_CLIENT_BY_ID_SUCCESS", (state: any, action: any) => {
        const payload = action.payload;
        state.regulatoryDetails = {
          ...payload?.regulatoryDetails,
          amlPolicyShared:
            payload?.regulatoryDetails?.amlPolicyDetails?.amlPolicyShared
        };
        state.isProfileUpdated = true;
      })
      .addMatcher(
        companyApi.endpoints.getQuestionsByCategory.matchFulfilled,
        (state, { payload }) => {
          // selected products filter
          if (payload.data.length > 0) {
            let firstTwoQuestions;
            let dynamicQuestions;

            if (payload.data[0].subcategory === "holdLicense") {
              firstTwoQuestions = payload.data.slice(0, 2);
              dynamicQuestions = payload.data.slice(2, payload.data.length + 1);

              // get options for licenceType and countries
              state.licenseTypeOptions = firstTwoQuestions[0].options;
              state.countriesOptions = firstTwoQuestions[1].options;
            } else {
              dynamicQuestions = payload.data;
            }
            // const restructuredQuestions = restructureQuestionByName(dynamicQuestions, "isOperatingInRiskCountries");
            const formatedResponse = getFormatedResponse(
              dynamicQuestions,
              true
            );
            state.regulatoryInformationQuestions = formatedResponse;
          }
        }
      )
      .addMatcher(
        companyApi.endpoints.getQuestionsByCategory.matchRejected,
        (state, { payload }) => {
          return {
            ...state,
            regulatoryInformationQuestions: []
          };
        }
      )
      .addMatcher(
        authApi.endpoints.getProfile.matchFulfilled,
        (state, { payload }) => {
          state.regulatoryDetails = {
            ...payload.data?.entity?.regulatoryDetails,
            amlPolicyShared:
              payload.data?.entity?.regulatoryDetails?.amlPolicyDetails
                ?.amlPolicyShared
          };
        }
      )
      .addMatcher(
        companyApi.endpoints.updateClientInfo.matchPending,
        (state, { payload }) => {
          return {
            ...state,
            isProfileUpdated: false
          };
        }
      )
      .addMatcher(
        companyApi.endpoints.updateClientInfo.matchFulfilled,
        (state, { payload }) => {
          state.regulatoryDetails = {
            ...payload.data?.regulatoryDetails,
            amlPolicyShared:
              payload.data?.regulatoryDetails?.amlPolicyDetails?.amlPolicyShared
          };
          state.isProfileUpdated = true;
        }
      )
      .addMatcher(
        companyApi.endpoints.updateClientInfo.matchRejected,
        (state, { payload }) => {
          return {
            ...state,
            isProfileUpdated: false
          };
        }
      )
      .addMatcher(
        documentApi.endpoints.getPresignedURL.matchFulfilled,
        (state, { payload }) => {
          state.currentFileList = updateFileNameInCurrentList(
            state.currentFileList,
            state.currentFile,
            payload
          );
        }
      );
  }
});

export const {
  updateRegulatoryInformationQuestions,
  updateCanFetchQuestionsBoolean,
  updateCanCloseAddLicenseCardBoolean,
  updateCurrentFile,
  updateCurrentFileList,
  updateIsLicenceDuplicate
} = regulatoryInformationSlice.actions;

export default regulatoryInformationSlice.reducer;
