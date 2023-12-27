import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import {
  Account,
  accountApi,
  Transaction
} from "../../services/accountService";
import { userLogoutAction } from "../general/actions";

type SliceState = {
  drawerVisible: boolean;
  accounts: Account[];
  currentPageList: {
    [productId: string]: Account[];
  };
  account: Account | null;
  issuerCompanyName: string;
  transactions: Transaction[];
  selectedAccount: any;
  selectedTransaction: object;
  accountsListView: string;
  appliedPaginationProperty: {
    [productId: string]: {
      pageNumber: number;
      pageSize: number;
    };
  };
  newlycreatedAccountId: string;
};

const initialState: SliceState = {
  drawerVisible: false,
  accounts: [],
  currentPageList: {},
  account: null,
  issuerCompanyName: "",
  transactions: [],
  selectedAccount: {},
  selectedTransaction: {},
  accountsListView: "grid",
  appliedPaginationProperty: {},
  newlycreatedAccountId: ""
};

const accountSlice = createSlice({
  name: "account",
  initialState: initialState,
  reducers: {
    updateSelectedAccount(state, action) {
      return {
        ...state,
        selectedAccount: action.payload
      };
    },
    selectTransaction(state, action) {
      return {
        ...state,
        selectedTransaction: action.payload
      };
    },

    changePageAction(state, action) {
      return {
        ...state,
        currentPageList: {
          ...state.currentPageList,
          [action.payload.productId]: action.payload.list
        }
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogoutAction, () => {
        return initialState;
      })
      .addMatcher(
        accountApi.endpoints.getAccounts.matchFulfilled,
        (state, { payload }) => {
          state.accounts = payload.data.accounts;
        }
      );
    // .addMatcher(
    //   accountApi.endpoints.getTransactions.matchFulfilled,
    //   (state, { payload }) => {
    //     state.transactions = payload.data.transactions;
    //   }
    // );
    // .addMatcher(
    //   accountApi.endpoints.getAccount.matchFulfilled,
    //   (state, { payload }) => {
    //     const validatedData: any = validationOnData(payload.data, "object");
    //     state.account = validatedData;
    //   }
    // )
  }
});

export const { selectTransaction, updateSelectedAccount, changePageAction } =
  accountSlice.actions;

export const selectAccounts = (state: RootState) => state.account.accounts;
export const selectAccount = (state: RootState) => state.account.account;

export const selectedTransaction = (state: RootState) =>
  state.account.selectedTransaction;
export const selectedAccount = (state: RootState) =>
  state.account.selectedAccount;

export default accountSlice.reducer;
