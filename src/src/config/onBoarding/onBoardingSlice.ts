import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { api } from "../../services/onBoardClientService";
import { userLogoutAction } from "../general/actions";

// A "slice" is a collection of Redux reducer logic and
// actions for a single feature in your app

type SliceState = {
  onBoardNewClientInfo: any;
  selectEntityId: any;
  showModal: boolean;
};

const initialState: SliceState = {
  onBoardNewClientInfo: {},
  selectEntityId: "",
  showModal: false
};

const onBoardingSlice = createSlice({
  name: "onBoarding",
  initialState: initialState,
  reducers: {
    updateShowOnboardModal(state, action) {
      return {
        ...state,
        showModal: action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogoutAction, () => {
        return initialState;
      })
      .addMatcher(
        api.endpoints.addNewOnboardClient.matchFulfilled,
        (state, { payload }) => {
          state.onBoardNewClientInfo = payload?.data;
          state.selectEntityId = payload?.data?.id;
        }
      );
  }
});

// Pull Actions and Reducer from AuthSlice
const { actions, reducer } = onBoardingSlice;

// Export All the actions
export const { updateShowOnboardModal } = actions;

export default reducer;

export const selectOnboardEntityId = (state: RootState) =>
  state.onBoarding.selectEntityId;
