import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api as authApi } from "../../services/authService";
import { userManagementApi } from "../../services/userManagementService";
import { RootState } from "../../redux/store";
import { validationOnData } from "../transformer";
import { ModalProps } from "../../pages/UserManagement/UserManagement.Interface";
import { UserRoles } from "@payconstruct/fe-utils/dist/Enum/userManagementEnums";

export type SliceState = {
  selectedUsers: any[];
  appliedUserFilters: {
    userId: string;
  };
  searchQuery: string;
  paginationProps: {
    current: number;
    pageSize: number;
  };
  allUsers: any[];
  email: string | null;
  phoneNumber: string | null;
  phoneNumberCountryCode: string | null;
  isUserCreateLoading: boolean;
  isUserEditLoading: boolean;
  selectedEntityId: string;
  addUserShow: boolean;
  initialFormData: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    roleId: string | null;
  };
  notificationModal: ModalProps;
  isAddUserDisabled: boolean;
};

const initialState: SliceState = {
  selectedUsers: [],
  appliedUserFilters: {
    userId: ""
  },
  searchQuery: "",
  paginationProps: {
    current: 1,
    pageSize: 10
  },
  allUsers: [],
  email: null,
  phoneNumber: null,
  phoneNumberCountryCode: null,
  isUserCreateLoading: false,
  isUserEditLoading: false,
  selectedEntityId: "",
  addUserShow: false,
  initialFormData: {
    firstName: "",
    lastName: "",
    email: "",
    roleId: ""
  },

  notificationModal: {
    show: false,
    title: "o",
    noteOne: "o",
    noteTwo: "",
    modalType: "default"
  },
  isAddUserDisabled: false
};

const userManagementSlice = createSlice({
  name: "userManagement",
  initialState: initialState,
  reducers: {
    updateSelectedUsers: (state, action) => {
      return {
        ...state,
        selectedUsers: action.payload
      };
    },
    updateUsersFilterData: (state, action) => {
      state.appliedUserFilters = action.payload;
    },
    updateSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    updatePaginationProps: (state, action) => {
      return {
        ...state,
        paginationProps: {
          current: action.payload.current,
          pageSize: action.payload.pageSize
        }
      };
    },
    updatePhoneNumberAction(state, action) {
      const { phone, phoneNumberCountryCode } = action.payload;
      return {
        ...state,
        phoneNumberCountryCode: phoneNumberCountryCode,
        phoneNumber: phone
      };
    },
    setEntityId(state, action: PayloadAction<string>) {
      return {
        ...state,
        selectedEntityId: action.payload
      };
    },
    updateFormValue: (state, action) => {
      return {
        ...state,
        initialFormData: action.payload
      };
    },
    updateAddUserShow: (state, action: { payload: boolean }) => {
      state.addUserShow = action.payload;
    },
    updateNotificationModal: (state, action: { payload: ModalProps }) => {
      state.notificationModal = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        userManagementApi.endpoints.getUsersByEntityId.matchFulfilled,
        (state, { payload }) => {
          state.allUsers = validationOnData(payload?.data, "array");
        }
      )
      .addMatcher(
        userManagementApi.endpoints.createUser.matchPending,
        (state, { payload }) => {
          state.isUserCreateLoading = true;
        }
      )
      .addMatcher(
        userManagementApi.endpoints.createUser.matchFulfilled,
        (state, { payload }) => {
          state.isUserCreateLoading = false;
        }
      )
      .addMatcher(
        userManagementApi.endpoints.createUser.matchRejected,
        (state, { payload }) => {
          state.isUserCreateLoading = false;
        }
      )
      .addMatcher(
        userManagementApi.endpoints.updateUser.matchPending,
        (state, { payload }) => {
          state.isUserEditLoading = true;
        }
      )
      .addMatcher(
        userManagementApi.endpoints.updateUser.matchFulfilled,
        (state, { payload }) => {
          state.isUserEditLoading = false;
        }
      )
      .addMatcher(
        userManagementApi.endpoints.updateUser.matchRejected,
        (state, { payload }) => {
          state.isUserEditLoading = false;
        }
      )
      .addMatcher(
        authApi.endpoints.getUserById.matchFulfilled,
        (state, { payload }) => {
          state.isAddUserDisabled =
            payload?.data?.role?.name === UserRoles.Creator ||
            payload?.data?.role?.name === UserRoles.Viewer;
        }
      );
  }
});

export const searchQuery = (state: RootState) =>
  state.userManagement.searchQuery;

export const selectedUserFilterData = (state: RootState) =>
  state.userManagement.appliedUserFilters;

export const selectedAddUserDisabled = (state: RootState) =>
  state.userManagement.isAddUserDisabled;

// Pull Actions and Reducer from AuthSlice
const { actions, reducer } = userManagementSlice;

export const {
  updateNotificationModal,
  updateSelectedUsers,
  updateUsersFilterData,
  updateSearchQuery,
  updatePaginationProps,
  updatePhoneNumberAction,
  setEntityId,
  updateFormValue,
  updateAddUserShow
} = actions;

export default reducer;
