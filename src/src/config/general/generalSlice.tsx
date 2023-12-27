import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { userLogoutAction } from "../general/actions";
import { api } from "../../services/companyService";

// A "slice" is a collection of Redux reducer logic and
// actions for a single feature in your app

type SliceState = {
  env: string;
  isMenuEnabled: boolean;
  isMenuCollapsed: boolean;
  topBarViewFlip: boolean;
  isLoading: boolean;
  timezone: string;
  companies: any[];
  selectedProduct: string;
};

const initialState: SliceState = {
  env: "localhost",
  isMenuEnabled: true,
  isMenuCollapsed: false,
  topBarViewFlip: false,
  isLoading: false,
  timezone: "Asia/Hong_Kong",
  companies: [],
  selectedProduct: ""
};

const generalSlice = createSlice({
  name: "general",
  initialState: initialState,
  reducers: {
    updateMenuShow(state, action) {
      return {
        ...state,
        isMenuEnabled: action.payload
      };
    },
    updateMenuCollapse(state, action) {
      return {
        ...state,
        isMenuCollapsed: action.payload
      };
    },
    updateTopBarShow(state, action) {
      return {
        ...state,
        topBarViewFlip: action.payload
      };
    },
    setLoading(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isLoading: action.payload
      };
    },
    updateSelectedProduct(state, action) {
      return {
        ...state,
        selectedProduct: action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogoutAction, () => {
        return initialState;
      })
      .addMatcher(
        api.endpoints.getAllCompanies.matchFulfilled,
        (state, { payload }) => {
          state.companies = payload?.data?.entities;
        }
      );
  }
});

export const {
  updateMenuShow,
  updateTopBarShow,
  setLoading,
  updateMenuCollapse,
  updateSelectedProduct
} = generalSlice.actions;

export const selectMenuEnable = (state: RootState) =>
  state.general.isMenuEnabled;

export const selectMenuCollapsed = (state: RootState) =>
  state.general.isMenuCollapsed;

export const selectTopBarShow = (state: RootState) =>
  state.general.topBarViewFlip;
export const selectLoading = (state: RootState) => state.general.isLoading;
export const selectTimezone = (state: RootState) => state.general.timezone;
export const selectCompanies = (state: RootState) => state.general.companies;
export const selectedProduct = (state: RootState) =>
  state.general.selectedProduct;

export default generalSlice.reducer;
