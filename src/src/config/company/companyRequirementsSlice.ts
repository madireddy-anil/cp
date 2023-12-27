import { createSlice } from "@reduxjs/toolkit";
// import { RootState } from "../../redux/store";

// A "slice" is a collection of Redux reducer logic and
// actions for a single feature in your app

type SliceState = {};

const initialState: SliceState = {};

const companyRequirementsSlice = createSlice({
  name: "companyRequirements",
  initialState: initialState,
  reducers: {}
});

export default companyRequirementsSlice.reducer;
