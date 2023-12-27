import { EFXOrder } from "@payconstruct/pp-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../redux/store";
import { Account } from "../../../services/accountService";
import {
  beneficiaryApi,
  BeneficiaryResponse,
  newBeneficiaryDocument
} from "../../../services/beneficiaryService";
import { resetAction as depositRestAction } from "../../Trades/Deposit/DepositActions";

export type BeneficiaryState = {
  beneficiaryList: BeneficiaryResponse["response"] | [];
  allBeneficiaries: any;
  settlementType: EFXOrder["settlementType"];
  selectedBeneficiary?: newBeneficiaryDocument | any;
  newBeneficiary?: any;
  selectedInternalAccount?: Account;
  beneficiaryId: string;
  beneficiaryName: string;
  showModal: boolean;
  showFormModal: boolean;
  showAddNewBeneModal: boolean;
  submittingBeneficiary: boolean;
  hasNewBeneCreated: boolean;
};

const initialState: BeneficiaryState = {
  settlementType: "external",
  beneficiaryList: [],
  allBeneficiaries: [],
  selectedBeneficiary: undefined,
  newBeneficiary: undefined,
  selectedInternalAccount: undefined,
  beneficiaryId: "",
  beneficiaryName: "",
  showModal: false,
  showFormModal: false,
  showAddNewBeneModal: false,
  submittingBeneficiary: false,
  hasNewBeneCreated: false
};

const beneficiarySlice = createSlice({
  name: "beneficiary",
  initialState: initialState,
  reducers: {
    toggleModalAction: (state) => {
      return {
        ...state,
        hasNewBeneCreated: false,
        showAddNewBeneModal: !state.showAddNewBeneModal
      };
    },
    showModalAction: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        showModal: action.payload
      };
    },
    showFormModalAction: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        showFormModal: action.payload
      };
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        submittingBeneficiary: action.payload
      };
    },
    changeSettlementType: (
      state,
      action: PayloadAction<BeneficiaryState["settlementType"]>
    ) => {
      return {
        ...state,
        settlementType: action.payload
      };
    },
    setBeneficiaryAction: (state, action: PayloadAction<any | undefined>) => {
      return {
        ...state,
        selectedBeneficiary: action.payload,
        beneficiaryId: action.payload?.id ?? "",
        beneficiaryName: action.payload?.accountDetails?.nameOnAccount ?? ""
      };
    },
    setInternalAccountAction: (
      state,
      action: PayloadAction<Account | undefined>
    ) => {
      return {
        ...state,
        selectedInternalAccount: action.payload,
        beneficiaryId: action.payload?.id ?? "",
        beneficiaryName: action.payload?.accountName ?? ""
      };
    },
    setToInitialBeneficiary: (state) => {
      return {
        ...state,
        settlementType: "external",
        selectedInternalAccount: undefined,
        selectedBeneficiary: undefined,
        beneficiaryId: "",
        beneficiaryName: ""
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(depositRestAction, () => {
        return initialState;
      })
      .addMatcher(
        beneficiaryApi.endpoints.getBeneficiaryByClientId.matchFulfilled,
        (state, { payload }) => {
          state.beneficiaryList = payload.response;
        }
      )
      .addMatcher(
        beneficiaryApi.endpoints.getAllBeneficiary.matchFulfilled,
        (state, { payload }) => {
          state.allBeneficiaries = payload.response;
        }
      )
      .addMatcher(
        beneficiaryApi.endpoints.createBeneficiary.matchFulfilled,
        (state, { payload }) => {
          state.hasNewBeneCreated = true;
          state.newBeneficiary = payload;
        }
      );
  }
});

export const selectShowAddNewBene = (state: RootState) =>
  state.beneficiary.showAddNewBeneModal;
export const selectBeneficiary = (state: RootState) => state.beneficiary;
export const selectNewBeneficiary = (state: RootState) =>
  state.beneficiary?.newBeneficiary?.beneficiary;

export const {
  toggleModalAction,
  showModalAction,
  showFormModalAction,
  setSubmitting,
  changeSettlementType,
  setBeneficiaryAction,
  setInternalAccountAction,
  setToInitialBeneficiary
} = beneficiarySlice.actions;
export default beneficiarySlice.reducer;
