import { createSlice } from "@reduxjs/toolkit";
// import { RootState } from "../../redux/store";
import { gppApi } from "../../services/gppService";
import { userLogoutAction } from "../general/actions";

type SliceState = {
  userId: string | null;
  invitor: string | null;
  clientName: string | null;
  role: any[];
  countries: any[];
  companyName: string;
  userInformation: { [key: string]: any };
  frontPageDocument: string;
  backPageDocument: string;
  frontPageDocumenList: any;
  backPageDocumentList: any;
  selfie: string;
  selectedDocType: { [key: string]: any };
  selectedCountryStates: any[];
  documentTypes: any[];
  onSubmitOwnerShipValues: { [key: string]: any };
  isScreeningSuccess?: boolean | null;
  errMessage: { [key: string]: any } | any;
};

const initialState: SliceState = {
  userId: "",
  invitor: "",
  clientName: "",
  countries: [],
  role: [],
  companyName: "",
  userInformation: {},
  frontPageDocument: "",
  backPageDocument: "",
  frontPageDocumenList: [],
  backPageDocumentList: [],
  selfie: "",
  selectedDocType: {},
  selectedCountryStates: [],
  documentTypes: [],
  onSubmitOwnerShipValues: {},
  isScreeningSuccess: null,
  errMessage: {}
};

const idvScreeningSlice = createSlice({
  name: "idvScreening",
  initialState: initialState,
  reducers: {
    updateUserId(state, action) {
      return {
        ...state,
        userId: action.payload
      };
    },
    updateCountryStates(state, action) {
      return {
        ...state,
        selectedCountryStates: action.payload
      };
    },
    updateDocumentsTypes(state, action) {
      return {
        ...state,
        documentTypes: action.payload
      };
    },
    updateOnSubmitOwnerShipValues(state, action) {
      return {
        ...state,
        onSubmitOwnerShipValues: action.payload
      };
    },
    updateFrontPageOfScannedDoc(state, action) {
      return {
        ...state,
        frontPageDocument: action.payload
      };
    },
    updateBackPageOfScannedDoc(state, action) {
      return {
        ...state,
        backPageDocument: action.payload
      };
    },
    updateScreeningResponse(state, action) {
      return {
        ...state,
        isScreeningSuccess: false
      };
    },
    updateFrontPageDocumenList(state, action) {
      return {
        ...state,
        frontPageDocumenList: action.payload
      };
    },
    updateBackPageDocumenList(state, action) {
      return {
        ...state,
        backPageDocumentList: action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogoutAction, () => {
        return initialState;
      })
      .addMatcher(
        gppApi.endpoints.getClientInformationIdv.matchFulfilled,
        (state, { payload }) => {
          state.invitor = payload.invitor;
          state.companyName = payload.registeredCompanyName;
          state.clientName = payload.peopleName;
          state.role = payload.role;

          // set initital state when page renders fist time
          state.isScreeningSuccess = null;
          state.userInformation = {};
          state.frontPageDocument = "";
          state.backPageDocument = "";
          state.selfie = "";
          state.selectedDocType = {};
          state.selectedCountryStates = [];
          state.documentTypes = [];
          state.onSubmitOwnerShipValues = {};
        }
      )
      .addMatcher(
        gppApi.endpoints.updateScreeningInfo.matchFulfilled,
        (state, { payload }) => {
          state.isScreeningSuccess = true;
        }
      )
      .addMatcher(
        gppApi.endpoints.updateScreeningInfo.matchRejected,
        (state, { payload }) => {
          console.log(payload, "failed scenario");
          state.errMessage = payload?.data;
        }
      );
  }
});

export const {
  updateUserId,
  updateCountryStates,
  updateDocumentsTypes,
  updateOnSubmitOwnerShipValues,
  updateFrontPageOfScannedDoc,
  updateBackPageOfScannedDoc,
  updateFrontPageDocumenList,
  updateBackPageDocumenList,
  updateScreeningResponse
} = idvScreeningSlice.actions;

export default idvScreeningSlice.reducer;
