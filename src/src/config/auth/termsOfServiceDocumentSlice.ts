import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { api } from "../../services/authService";
import { termsOfServiceDocumentApi } from "../../services/termsOfServiceDocumentService";
import { userLogoutAction } from "../general/actions";

type SliceState = {
  legalAgreements: any[];
  legalAgreementFileName: string;
  legalAgreementVersionId: string;
  legalAgreementVersionNo: string;
  preSignedDownloadURL: string;
  termsBase64: string;
  showNewTermsOfService: boolean;
  showAccountReadyModal: boolean;
  showApplicationApproved: boolean;
  canFetchApi: boolean;
};

const initialState: SliceState = {
  legalAgreements: [],
  legalAgreementFileName: "",
  legalAgreementVersionId: "",
  legalAgreementVersionNo: "",
  preSignedDownloadURL: "",
  termsBase64: ``,
  showNewTermsOfService: false,
  showAccountReadyModal: false,
  showApplicationApproved: false,
  canFetchApi: false
};

const termsOfServiceDocumentSlice = createSlice({
  name: "legalAgreements",
  initialState: initialState,
  reducers: {
    updateNewVersionExist: (state, action) => {
      state.showNewTermsOfService = action.payload;
    },
    updateLegalAgreementRecord: (state, action) => {
      state.legalAgreementFileName = action.payload.fileName;
      state.legalAgreementVersionId = action.payload.versionId;
      state.legalAgreementVersionNo = action.payload.versionNo;
    },
    updateTermsBase64(state, action) {
      return {
        ...state,
        termsBase64: action.payload
      };
    },
    updateShowAccountReadyModal(state, action) {
      return {
        ...state,
        showAccountReadyModal: action.payload
      };
    },
    resetToInitialState: () => initialState,
    showApplicationApproved(state, action) {
      return {
        ...state,
        showApplicationApproved: action.payload
      };
    },
    updateCanFetchApi(state, action) {
      return {
        ...state,
        canFetchApi: action.payload
      };
    },
    setLegalAgreementsSuccess(state, action) {
      return {
        ...state,
        legalAgreements: action.payload.termsOfService
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogoutAction, () => {
        return initialState;
      })
      .addMatcher(
        api.endpoints.getLegalAgreements.matchFulfilled,
        (state, { payload }) => {
          state.legalAgreements = payload.data?.termsOfService;
        }
      )
      .addMatcher(
        termsOfServiceDocumentApi.endpoints.getPresignedURLForDownload
          .matchFulfilled,
        (state, { payload }) => {
          state.preSignedDownloadURL = payload?.filePreSignedData;
        }
      );
  }
});

export const {
  // updateLegalAgreementFileName,
  // updateLegalAgreementVersion,
  updateTermsBase64,
  resetToInitialState,
  updateLegalAgreementRecord,
  updateNewVersionExist,
  updateShowAccountReadyModal,
  showApplicationApproved,
  updateCanFetchApi,
  setLegalAgreementsSuccess
} = termsOfServiceDocumentSlice.actions;

export default termsOfServiceDocumentSlice.reducer;

export const selectNewTermsOfService = (state: RootState) =>
  state.termsOfServiceDocument.showNewTermsOfService;

export const selectApplicationApproved = (state: RootState) =>
  state.termsOfServiceDocument.showApplicationApproved;
