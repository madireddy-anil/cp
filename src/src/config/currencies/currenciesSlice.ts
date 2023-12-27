import { createSlice } from "@reduxjs/toolkit";
import { currenciesApi, Currency } from "../../services/currencies";
import { RootState } from "../../redux/store";

type SliceState = {
  currencyList: Currency[];
};

const initialState: SliceState = {
  currencyList: []
};

const currenciesSlice = createSlice({
  name: "currencies",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      currenciesApi.endpoints.getCurrencies.matchFulfilled,
      (state, { payload }) => {
        state.currencyList = payload?.data?.currency;
      }
    );
  }
});

export const selectCurrencies = (state: RootState) =>
  state.currencies.currencyList;
export default currenciesSlice.reducer;
