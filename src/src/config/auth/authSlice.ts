import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";
import { api, ProfileResponse } from "../../services/authService";
import type { RootState } from "../../redux/store";
import { userLogoutAction } from "../general/actions";
import { validationOnData, getAllTaggedEntities } from "../transformer";
import { api as companyApi } from "../../services/companyService";
import { userMetaData } from "../../config/variables";

type AuthState = {
  isLoading: boolean;
  portal: "cms";
  clientId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phoneNumber: string | null;
  phoneNumberCountryCode: string | null;
  role: string | null;
  permissions: string[];
  token: string | null;
  orgToken: string | null;
  refresh_token: string | null;
  mfa_token: string | null;
  barcodeUri: string;
  recovery_codes: string | null;
  isMFAset: boolean;
  mfa_required: boolean;
  showMFAModal: boolean;
  showSetupMFAModal: boolean;
  rememberMe: boolean;
  message?: string | null;
  emailVerified?: boolean;
  profile: ProfileResponse["data"] | null;
  profileLoader: boolean;
  canFetchProfileAPI: boolean;
  termsOfService: any;
  selectedEntityId: string;
  isMfaSwitchToggled: boolean;
  entities: ProfileResponse["data"]["entities"] | [];
  id: string;
  selectedRegisteredCompanyName: string;
  isProfileSuccess: boolean;
  isEntitySwitched: boolean | null;
  organizationId: string | null;
  groupId: string | null;
  prevLocation: string | undefined;
};

const initialState = {
  isLoading: false,
  portal: "cms",
  clientId: "",
  firstName: "",
  lastName: "",
  email: null,
  phoneNumber: null,
  phoneNumberCountryCode: null,
  token: null,
  orgToken: null,
  refresh_token: null,
  mfa_token: null,
  mfa_required: false,
  isMFAset: false,
  barcodeUri: "",
  recovery_codes: "",
  showMFAModal: false,
  showSetupMFAModal: false,
  rememberMe: false,
  message: null,
  emailVerified: false,
  profileLoader: false,
  selectedEntityId: "",
  profile: {},
  entities: [],
  role: {},
  canFetchProfileAPI: false,
  termsOfService: [],
  isMfaSwitchToggled: false,
  isEntitySwitched: null,
  organizationId: null,
  groupId: null,
  permissions: [""],
  prevLocation: "/"
} as AuthState;

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    updateToken(state, action) {
      return {
        ...state,
        token: action.payload
      };
    },
    updateUserId(state, action) {
      return {
        ...state,
        id: action.payload
      };
    },
    updateOrganizationToken(state, action) {
      return {
        ...state,
        orgToken: action.payload
      };
    },
    updateAccessToken(state, action) {
      const decodeToken: any = jwt_decode(action.payload.token);
      const permissionsList = decodeToken["permissions"];
      return {
        ...state,
        token: action.payload.token,
        refresh_token: action.payload.refreshToken,
        role: decodeToken[userMetaData + "/role"],
        permissions: permissionsList?.length ? permissionsList : []
      };
    },
    updateEmailAction(state, action) {
      return {
        ...state,
        email: action.payload
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
    logoutUserAction(state) {
      return {
        ...state,
        token: null,
        email: state.rememberMe ? state.email : null
      };
    },
    showMFAModalAction(state, action) {
      return {
        ...state,
        showMFAModal: action.payload
      };
    },
    showSetupMFAModalAction(state, action) {
      return {
        ...state,
        isMFAset: state.isMFAset ? true : false,
        showSetupMFAModal: action.payload
      };
    },
    setRememberMeAction(state, action) {
      return {
        ...state,
        rememberMe: action.payload
      };
    },
    updateProfileLoader(state, action) {
      return {
        ...state,
        profileLoader: action.payload
      };
    },
    resetProfile(state) {
      return {
        ...state,
        profile: null
      };
    },
    setEntityId(state, action: PayloadAction<string>) {
      return {
        ...state,
        isEntitySwitched: true,
        selectedEntityId: action.payload,
        clientId: action.payload
      };
    },
    setEntityIdOnSignUp(state, action: PayloadAction<string>) {
      return {
        ...state,
        selectedEntityId: action.payload,
        clientId: action.payload
      };
    },
    setClientInfoSuccess(state, action) {
      return {
        ...state,
        termsOfService: action.payload.termsOfService
      };
    },
    updateOrganizationId(state, action) {
      return {
        ...state,
        organizationId: action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogoutAction, () => {
        return initialState;
      })
      // .addMatcher(
      //   api.endpoints.refreshToken.matchFulfilled,
      //   (state, { payload }) => {
      //   state.refresh_token= payload.data.refresh_token;
      //   state.token= payload.data.access_token;
      //   }
      // )
      .addCase("GET_ALL_TERMS_OF_SERVICE", (state: any) => {
        state.kycStatus = null;
        state.step = 0;
        state.termsOfService = [];
      })
      .addCase("GET_CLIENT_BY_ID", (state: any, action: any) => {
        state.isLoading = true;
        state.prevLocation = action?.location
          ? action?.location
          : state.prevLocation;
      })
      .addCase("GET_CLIENT_BY_ID_FAILURE", (state: any) => {
        state.isLoading = false;
      })
      .addCase("GET_CLIENT_BY_ID_SUCCESS", (state: any, action: any) => {
        const payload = action.payload;
        state.profile.entity = payload;
        state.isLoading = false;
        state.clientId = payload?.id;
        state.selectedEntityId = payload?.id;
        state.entities = getAllTaggedEntities(payload, state.entities);
        state.organisationId = payload?.organisationId;
        state.groupId = payload?.genericInformation?.groupId;
      })
      .addMatcher(api.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.mfa_token = payload.data.mfa_token;
        state.refresh_token = payload.data.refresh_token;
        state.token = payload?.data?.access_token
          ? payload?.data?.access_token
          : null;
        state.isMFAset = payload.data.isMFAset;
        state.mfa_required = payload.data.mfa_required;
        state.showMFAModal =
          !payload.data.mfa_required && payload.data?.isMFAset;
        state.showSetupMFAModal =
          payload.data?.mfa_required && payload.data.mfa_required;
      })
      .addMatcher(
        api.endpoints.refreshToken.matchFulfilled,
        (state, { payload }) => {
          state.token = payload.data.access_token
            ? payload.data.access_token
            : state.token;
          state.refresh_token = payload.data.refresh_token
            ? payload.data.refresh_token
            : state.refresh_token;
        }
      )
      .addMatcher(
        api.endpoints.twoFactorAuthentication.matchFulfilled,
        (state, { payload }) => {
          state.showSetupMFAModal = false;
          state.token = payload.data.access_token;
          state.message = payload.message;
        }
      )
      .addMatcher(
        api.endpoints.setupTwoFA.matchFulfilled,
        (state, { payload }) => {
          state.mfa_token = payload.data.mfa_token;
          state.barcodeUri = payload.data.barcodeUri;
        }
      )
      .addMatcher(
        api.endpoints.getTwoFAQrCode.matchFulfilled,
        (state, { payload }) => {
          state.barcodeUri = payload.data.barcode_uri;
          state.recovery_codes = validationOnData(
            payload?.data?.recovery_codes[0],
            "string"
          );
          state.isMfaSwitchToggled = true;
        }
      )
      .addMatcher(
        api.endpoints.verfiyMFACode.matchFulfilled,
        (state, { payload }) => {
          state.isMFAset = true;
          state.showSetupMFAModal = false;
        }
      )
      .addMatcher(
        api.endpoints.resetTwoFAQrCode.matchFulfilled,
        (state, { payload }) => {
          state.barcodeUri = payload.data.barcode_uri;
          state.recovery_codes = validationOnData(
            payload.data?.recovery_code,
            "string"
          );
          state.refresh_token = payload.data.refresh_token;
          state.isMfaSwitchToggled = false;
        }
      )
      .addMatcher(api.endpoints.signup.matchFulfilled, (state, { payload }) => {
        state.token = payload.data.access_token;
        state.message = payload.message;
        state.refresh_token = payload.data.refresh_token;
      })
      .addMatcher(
        api.endpoints.resetPassword.matchFulfilled,
        (state, { payload }) => {
          state.message = payload.message;
        }
      )
      .addMatcher(
        api.endpoints.getProfile.matchFulfilled,
        (state, { payload }) => {
          // state.profile = payload.data;
          state.entities = getAllTaggedEntities(
            payload.data.entity,
            payload.data?.entities
          );
          state.email = payload?.data?.email;
          // state.role = payload?.data?.role;
          // if (state.clientId.length < 1)
          //   state.clientId = payload.data.entity?.id;

          // if (state.selectedEntityId.length < 1)
          //   state.selectedEntityId = payload.data.entity?.id;

          state.id = payload?.data?.id;
          state.firstName = payload.data.firstName;
          state.lastName = payload.data.lastName;
          state.phoneNumber = payload.data.phoneNumber;
          state.phoneNumberCountryCode = payload.data.phoneNumberPrefix;
          state.emailVerified = payload.data.emailVerified;
          state.isMFAset = payload?.data?.mfaEnabled;
          state.profileLoader = false;

          // state.termsOfService = validationOnData(
          //   payload?.data?.entity?.termsOfService,
          //   "array"
          // );
          state.canFetchProfileAPI = false;
          state.isProfileSuccess = true;
        }
      )
      // .addMatcher(
      //   api.endpoints.getUserById.matchFulfilled,
      //   (state, { payload }) => {
      //     state.profile = payload.data;
      //     state.email = payload?.data?.email;
      //     state.id = payload?.data?.id;
      //     state.firstName = payload.data.firstName;
      //     state.lastName = payload.data.lastName;
      //     state.phoneNumber = payload.data.phoneNumber;
      //     state.phoneNumberCountryCode = payload.data.phoneNumberPrefix;
      //     state.emailVerified = payload.data.emailVerified;
      //     state.isMFAset = payload?.data?.mfaEnabled;
      //     state.entities = getAllTaggedEntities(
      //       payload.data.entity,
      //       payload.data?.entities
      //     );
      //   }
      // )
      .addMatcher(
        api.endpoints.getProfile.matchPending,
        (state, { payload }) => {
          state.profileLoader = true;
          state.isProfileSuccess = false;
        }
      )
      .addMatcher(
        api.endpoints.getProfile.matchRejected,
        (state, { payload }) => {
          state.profileLoader = false;
          state.isProfileSuccess = false;
        }
      )
      .addMatcher(
        api.endpoints.updateTermsOfService.matchFulfilled,
        (state, { payload }) => {
          state.termsOfService = validationOnData(
            payload?.data?.termsOfService,
            "array"
          );
        }
      )
      .addMatcher(
        api.endpoints.refreshToken.matchFulfilled,
        (state, { payload }) => {
          state.canFetchProfileAPI = true;
        }
      )
      .addMatcher(
        api.endpoints.updatePhoneNumber.matchFulfilled,
        (state, { payload }) => {
          state.canFetchProfileAPI = true;
        }
      )
      .addMatcher(
        companyApi.endpoints.getCustomerInfo.matchFulfilled,
        (state, { payload }) => {
          state.termsOfService = payload.data.termsOfService;
          // state.clientId = payload.data.id;
        }
      );
  }
});

// Pull Actions and Reducer from AuthSlice
const { actions, reducer } = authSlice;

// Export All the actions
export const {
  updateToken,
  updateUserId,
  updateEmailAction,
  updatePhoneNumberAction,
  logoutUserAction,
  showMFAModalAction,
  updateProfileLoader,
  showSetupMFAModalAction,
  setRememberMeAction,
  setEntityId,
  setEntityIdOnSignUp,
  resetProfile,
  updateAccessToken,
  setClientInfoSuccess,
  updateOrganizationToken,
  updateOrganizationId
} = actions;

// Export default the reducer
export default reducer;

//Export select to get specific data from the store
export const selectAuth = (state: RootState) => state.auth;
export const selectToken = (state: RootState) => state.auth.token;
export const selectOrgToken = (state: RootState) => state.auth.orgToken;
export const selectCurrentUser = (state: RootState) => state.auth.firstName;
export const selectMFAToken = (state: RootState) => state.auth.mfa_token;

export const selectCompanyName = (state: RootState) => {
  const { entities, selectedEntityId } = state.auth;

  if (entities?.length > 0) {
    const [entity] = entities.filter(
      (entity: ProfileResponse["data"]["entity"]) =>
        entity.id === selectedEntityId
    );

    const registeredCompanyName =
      entity?.genericInformation?.registeredCompanyName;

    return registeredCompanyName;
  }
};

export const selectCompanyAddress = (state: RootState) => {
  const { entities, selectedEntityId } = state.auth;

  if (entities?.length > 0) {
    const [entity] = entities.filter(
      (entity: ProfileResponse["data"]["entity"]) =>
        entity.id === selectedEntityId
    );

    const selectedCompanyAddress = entity?.genericInformation?.addresses;
    return selectedCompanyAddress;
  }
};

export const selectTradingName = (state: RootState) =>
  state.auth.profile?.entity?.genericInformation?.tradingName;

export const selectEntityId = (state: RootState) => state.auth.selectedEntityId;
export const selectOrgId = (state: RootState) => state.auth.organisationId;

export const selectIndustries = (state: RootState) =>
  state.auth.profile?.entity?.genericInformation?.industries;

export const selectEntities = (state: RootState) =>
  state.auth.profile?.entities;

export const selectCurrentUserId = (state: RootState) => state.auth?.id;

export const selectUserFullName = (state: RootState) =>
  state.auth?.firstName + " " + state.auth?.lastName;

export const selectPermissions = (state: RootState) => state.auth?.permissions;

export const selectRole = (state: RootState) => state.auth?.role;
