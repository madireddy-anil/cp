import { createSlice } from "@reduxjs/toolkit";
import { api as documentApi } from "../../services/documentService";
import { api as companyApi } from "../../services/companyService";
// import { api as filesApi } from "../../services/filesService";
import { documentUploadApi } from "../../services/documentUploadService";
import { api } from "../../services/authService";
import { userLogoutAction } from "../general/actions";

import { validationOnData } from "../transformer";

// A "slice" is a collection of Redux reducer logic and
// actions for a single feature in your app

type SliceState = {
  currentStepOfUploadDocs: number;
  requiredDocumentsList: any[];
  preSignedURLData: { [key: string]: any };
  selectedDocumentFiles: any;
  documentsComments: any[];
  modalInitialProps: { [key: string]: any };
  uploadFileLoader: boolean;
  getAllFilesLoader: boolean;
  companyDocuments: any[];
};

const initialState: SliceState = {
  currentStepOfUploadDocs: 0,
  requiredDocumentsList: [],
  preSignedURLData: {},
  selectedDocumentFiles: [],
  documentsComments: [],
  modalInitialProps: {},
  uploadFileLoader: false,
  getAllFilesLoader: false,
  companyDocuments: []
};

const documentUpload = createSlice({
  name: "documentUpload",
  initialState: initialState,
  reducers: {
    nextStepAction: (state) => {
      state.currentStepOfUploadDocs += 1;
    },
    previousStepAction: (state) => {
      if (state.currentStepOfUploadDocs === 0) return;
      state.currentStepOfUploadDocs -= 1;
    },
    updateSelectedStep(state, action) {
      return {
        ...state,
        currentStepOfUploadDocs: action.payload
      };
    },
    updateDocs(state, action) {
      return {
        ...state,
        allDocs: action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogoutAction, () => {
        return initialState;
      })
      .addMatcher(
        documentApi.endpoints.getDocumentQuestions.matchFulfilled,
        (state, { payload }) => {
          state.requiredDocumentsList = payload.data;
        }
      )
      .addMatcher(
        documentApi.endpoints.getPresignedURL.matchFulfilled,
        (state, { payload }) => {
          state.preSignedURLData = payload;
          state.uploadFileLoader = false;
        }
      )
      .addMatcher(
        documentApi.endpoints.getPresignedURL.matchPending,
        (state, { payload }) => {
          state.uploadFileLoader = true;
        }
      )
      .addMatcher(
        documentApi.endpoints.getPresignedURL.matchRejected,
        (state, { payload }) => {
          state.uploadFileLoader = false;
        }
      )
      // .addMatcher(
      //   filesApi.endpoints.getDocumentFile.matchFulfilled,
      //   (state, { payload }) => {
      //     state.selectedDocumentFiles = formatDocumentForInitialData(
      //       validationOnData(payload?.fileData, "array")
      //     );
      //     state.uploadFileLoader = false;
      //     state.getAllFilesLoader = false;
      //   }
      // )
      // .addMatcher(
      //   filesApi.endpoints.getDocumentFile.matchPending,
      //   (state, { payload }) => {
      //     state.uploadFileLoader = true;
      //     state.getAllFilesLoader = true;
      //   }
      // )
      // .addMatcher(
      //   filesApi.endpoints.getDocumentFile.matchRejected,
      //   (state, { payload }) => {
      //     state.uploadFileLoader = false;
      //     state.getAllFilesLoader = false;
      //   }
      // )
      .addMatcher(
        companyApi.endpoints.updateClientInfo.matchFulfilled,
        (state, { payload }) => {
          state.documentsComments = validationOnData(
            payload?.data?.documentsComment,
            "array"
          );
        }
      )
      .addMatcher(
        documentUploadApi.endpoints.addDocumentFile.matchFulfilled,
        (state, { payload }) => {
          state.uploadFileLoader = false;
          state.getAllFilesLoader = false;
        }
      )
      .addMatcher(
        documentUploadApi.endpoints.addDocumentFile.matchPending,
        (state, { payload }) => {
          state.uploadFileLoader = true;
          state.getAllFilesLoader = true;
        }
      )
      .addMatcher(
        documentUploadApi.endpoints.addDocumentFile.matchRejected,
        (state, { payload }) => {
          state.uploadFileLoader = false;
          state.getAllFilesLoader = false;
        }
      )

      .addMatcher(
        api.endpoints.getProfile.matchFulfilled,
        (state, { payload }) => {
          state.documentsComments = validationOnData(
            payload?.data?.entity?.documentsComment,
            "array"
          );
        }
      );
  }
});

export const {
  nextStepAction,
  previousStepAction,
  updateSelectedStep,
  updateDocs
} = documentUpload.actions;

export default documentUpload.reducer;
