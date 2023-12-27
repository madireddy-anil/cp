import { createSlice } from "@reduxjs/toolkit";
import { userLogoutAction } from "../general/actions";
import { RootState } from "../../redux/store";
import { OrganizationsProps } from "../../services/orgService";

type OrgState = {
  orgToken: string | null;
  organizations: OrganizationsProps[];
  selectedOrganization: OrganizationsProps;
};

const initialState: OrgState = {
  orgToken: null,
  organizations: [],
  selectedOrganization: {
    organisationId: "",
    display_name: "",
    registeredCompanyName: "",
    entityId: ""
  }
};

const orgSlice = createSlice({
  name: "organisation",
  initialState: initialState,
  reducers: {
    updateOrganizationToken(state, action) {
      return {
        ...state,
        orgToken: action.payload
      };
    },
    updateOrganizations(state, action) {
      return {
        ...state,
        organizations: action.payload
      };
    },
    updatedSelectedOrganization(state, action) {
      return {
        ...state,
        selectedOrganization: action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogoutAction, () => {
        return initialState;
      })
      .addCase("GET_CLIENT_BY_ID_SUCCESS", (state: any, action: any) => {
        const payload = action.payload;
        const exitsingOrg = state.selectedOrganization;
        state.selectedOrganization = {
          organisationId: payload?.organisationId
            ? payload.organisationId
            : exitsingOrg.organisationId,
          display_name: exitsingOrg?.display_name,
          registeredCompanyName: payload?.genericInformation
            ?.registeredCompanyName
            ? payload.genericInformation.registeredCompanyName
            : exitsingOrg.display_name,
          entityId: payload?.id ? payload.id : exitsingOrg.entityId
        };
      });
  }
});

export const selectOrganization = (state: RootState) =>
  state.organisation?.selectedOrganization;
export const selectOrganizationId = (state: RootState) =>
  state.organisation?.selectedOrganization?.organisationId;

export const {
  updateOrganizationToken,
  updateOrganizations,
  updatedSelectedOrganization
} = orgSlice.actions;

export default orgSlice.reducer;
