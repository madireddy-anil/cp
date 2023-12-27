import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../redux/store";
import { userLogoutAction } from "../general/actions";

type rememberState = {
  isLoading: boolean;
};

const initialState = {
  isLoading: false
} as rememberState;

const accountSettingSlice = createSlice({
  name: "accountSetting",
  initialState: initialState,
  reducers: {
    updateProfileLoader(state, action) {
      return {
        ...state,
        isLoading: action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(userLogoutAction, () => {
      return initialState;
    });
  }
});

export const { updateProfileLoader } = accountSettingSlice.actions;

export default accountSettingSlice.reducer;

export const selectShowModal = (state: RootState) => state;
