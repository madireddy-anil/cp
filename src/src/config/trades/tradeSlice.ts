import { combineReducers, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tradeApi } from "../../services/tradesService";
import { EFXOrder, Account } from "@payconstruct/pp-types";
import depositReducer from "../../pages/Trades/Deposit//DepositSlice";
import { RootState } from "../../redux/store";
import { userLogoutAction } from "../general/actions";

export type { EFXOrder, Account };
export type SliceState = {
  list: EFXOrder[];
  showFilters: boolean;
  isFiltersApplied: boolean;
  currentPageList: EFXOrder[];
  filteredList: EFXOrder[];
  deposit: {
    step: number;
    selectedAccount: Account | null;
    youSellCurrency: string | null;
    youSellAmount: string | null;
    youBuyCurrency: string | null;
    requestedAccountType: "personal" | "corporate";
    accountType: "day" | "overnight";
    remarks: string;
    depositDate: string | null;
  };
  pageNumber: number;
};

const initialState: SliceState = {
  list: [],
  showFilters: false,
  isFiltersApplied: false,
  currentPageList: [],
  filteredList: [],
  deposit: {
    step: 0,
    selectedAccount: null,
    youSellCurrency: null,
    youSellAmount: null,
    youBuyCurrency: null,
    requestedAccountType: "personal",
    accountType: "day",
    remarks: "",
    depositDate: ""
  },
  pageNumber: 0
};

const tradeSlice = createSlice({
  name: "tradesHistory",
  initialState: initialState,
  reducers: {
    showFilterAction(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        showFilters: action.payload
      };
    },
    changePageAction(state, action: PayloadAction<any[]>) {
      let pageOptions = action.payload.length < 25 ? 25 : action.payload.length;
      if (pageOptions > 25 && pageOptions < 50) {
        pageOptions = 50;
      } else if (pageOptions > 50) {
        pageOptions = 100;
      }
      return {
        ...state,
        currentPageList: action.payload,
        pageNumber: pageOptions
      };
    },
    setListAction(state, action: PayloadAction<any[]>) {
      return {
        ...state,
        list: action.payload
      };
    },
    filterListAction(state, action: PayloadAction<any[]>) {
      return {
        ...state,
        filteredList: action.payload
      };
    },
    updateIsFiltersApplied(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isFiltersApplied: action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogoutAction, () => {
        return initialState;
      })
      .addMatcher(
        tradeApi.endpoints.getTrades.matchFulfilled,
        (state, { payload }) => {
          state.filteredList = payload.orders ?? payload.orders;
        }
      );
  }
});

export const {
  showFilterAction,
  changePageAction,
  filterListAction,
  setListAction,
  updateIsFiltersApplied
} = tradeSlice.actions;

export const selectTrades = (state: RootState) => state.trades;

export const selectTradeList = (state: RootState) =>
  state.trades.tradesHistory.list;

export const selectShowFilter = (state: RootState) =>
  state.trades.tradesHistory.showFilters;

export const selectIsFiltersApplied = (state: RootState) =>
  state.trades.tradesHistory.isFiltersApplied;

const tradesReducer: any = combineReducers({
  [tradeSlice.name]: tradeSlice.reducer,
  deposit: depositReducer
});

export default tradesReducer;
