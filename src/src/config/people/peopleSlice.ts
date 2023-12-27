import { createSlice } from "@reduxjs/toolkit";

import { api } from "../../services/peopleService";
import { userLogoutAction } from "../general/actions";
import { totalSharePercentOfPeople } from "../transformer";

interface SliceState {
  listOfPeoples: any;
  onPersonAddedSuccessfully: boolean;
  isAllPeopleFetch: boolean;
  btnLoading: boolean;
  deletionTriggeredId: string;

  latestCreatedRecord: { [key: string]: any };
  totalPeopleSharePercent: number;
  isAuthorisedToAcceptTerms: any[];
  disableStep: boolean;
  isPeopleFetching: boolean;
}

const initialState: SliceState = {
  listOfPeoples: [],
  onPersonAddedSuccessfully: false,
  isAllPeopleFetch: true,
  btnLoading: false,
  deletionTriggeredId: "",

  latestCreatedRecord: {},
  totalPeopleSharePercent: 0,
  isAuthorisedToAcceptTerms: [],
  disableStep: false,
  isPeopleFetching: false
};

const people = createSlice({
  name: "people",
  initialState,
  reducers: {
    disableStepOnLoading(state, action) {
      return {
        ...state,
        disableStep: action.payload
      };
    },
    updateLatestCreatedRecord(state, action) {
      return {
        ...state,
        latestCreatedRecord: action.payload
      };
    },
    resetFormToInitial(state) {
      const percent = totalSharePercentOfPeople(state?.listOfPeoples);
      return {
        ...state,
        onPersonAddedSuccessfully: false,
        totalPeopleSharePercent: percent
      };
    },
    updateTempDeletionId(state, action) {
      return {
        ...state,
        deletionTriggeredId: action.payload
      };
    },
    setPeopleSuccess(state, action) {
      return {
        ...state,
        listOfPeoples: action.payload.people
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogoutAction, () => {
        return initialState;
      })
      .addCase("GET_PEOPLE", (state: any, action: any) => {
        state.listOfPeoples = [];
      })
      /* 
          Get list of people
      */
      .addMatcher(
        api.endpoints.getListOfPeople.matchFulfilled,
        (state, { payload }) => {
          const getPersonTermsservice = payload.data?.people
            .filter((el) => el?.isAuthorisedToAcceptTerms)
            .map((person) => {
              return person.isAuthorisedToAcceptTerms;
            });
          state.isAuthorisedToAcceptTerms = getPersonTermsservice;
          state.latestCreatedRecord =
            payload.data?.people?.length < 0 ? {} : state.latestCreatedRecord;

          // all people
          state.listOfPeoples = payload.data?.people;
          state.isAllPeopleFetch = !state.isAllPeopleFetch;
          state.totalPeopleSharePercent = totalSharePercentOfPeople(
            payload.data?.people
          );
          state.isPeopleFetching = false;
        }
      )

      .addMatcher(
        api.endpoints.getListOfPeople.matchPending,
        (state, { payload }) => {
          state.isPeopleFetching = true;
        }
      )
      .addMatcher(
        api.endpoints.getListOfPeople.matchRejected,
        (state, { payload }) => {
          state.isPeopleFetching = false;
        }
      )
      /* 
          Add People
      */
      .addMatcher(api.endpoints.addNewPeople.matchPending, (state) => {
        state.btnLoading = true;
      })
      .addMatcher(
        api.endpoints.addNewPeople.matchFulfilled,
        (state, { payload }) => {
          state.listOfPeoples = [payload.data, ...state.listOfPeoples];
          state.onPersonAddedSuccessfully = true;
          state.btnLoading = false;
          const getPersonTermsservice = state.listOfPeoples
            ?.filter((el: any) => el?.isAuthorisedToAcceptTerms)
            .map((person: any) => {
              return person?.isAuthorisedToAcceptTerms;
            });
          state.isAuthorisedToAcceptTerms = getPersonTermsservice;
        }
      )
      .addMatcher(api.endpoints.addNewPeople.matchRejected, (state) => {
        state.btnLoading = false;
      })
      /* 
          Remove People
      */
      .addMatcher(api.endpoints.removePeople.matchFulfilled, (state) => {
        // state.listOfPeoples = state.listOfPeoples.filter((item: any) => {
        //   return item.id !== state.deletionTriggeredId;
        // });
        // state.listOfPeoples = [];
        state.isPeopleFetching = true;
        state.deletionTriggeredId = "";
      })
      /* 
          Update People
      */
      .addMatcher(
        api.endpoints.updatePeopleDetails.matchFulfilled,
        (state, { payload }) => {
          state.listOfPeoples = state.listOfPeoples.map((item: any) => {
            if (item.id === payload.data?.id) {
              return payload.data;
            }
            return payload.data;
          });
        }
      );
  }
});

export const {
  resetFormToInitial,
  updateTempDeletionId,
  updateLatestCreatedRecord,
  disableStepOnLoading,
  setPeopleSuccess
} = people.actions;

export default people.reducer;
