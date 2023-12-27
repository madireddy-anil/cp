import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
// import { RootState } from "../../redux/store";
import { Country, countriesApi } from "../../services/countriesService";
import { sortData } from "../transformer";

// A "slice" is a collection of Redux reducer logic and
// actions for a single feature in your app

type SliceState = {
  countries: Country[];
};

const initialState: SliceState = {
  countries: []
};

const countriesSlice = createSlice({
  name: "countries",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      countriesApi.endpoints.getCountries.matchFulfilled,
      (state, { payload }) => {
        const sortCountries = payload?.data?.country?.slice().sort(sortData);
        state.countries = sortCountries;
      }
    );
  }
});

// export const { } = countriesSlice.actions;

// export const getCurrentStep = (state: RootState) => state.general.isMenuEnabled;

export const selectCountries = (state: RootState) => state.countries.countries;

export default countriesSlice.reducer;
