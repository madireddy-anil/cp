import { ApprovalsStateProps } from "./ApprovalsProvider";

export const Actions = {
  UPDATE_APPROVAL_CONFIG_RULE: "UPDATE_APPROVAL_CONFIG_RULE",
  UPDATE_APPROVAL_LOADING: "UPDATE_APPROVAL_LOADING",
  UPDATE_APPROVAL_RULE: "UPDATE_APPROVAL_RULE"
} as const;

export type PayloadAction<T> = T;

type UpdateApprovalConfig = {
  type: typeof Actions.UPDATE_APPROVAL_CONFIG_RULE;
  payload: ApprovalsStateProps;
};
export const updateApprovalConfig = (payload: ApprovalsStateProps) => {
  return {
    type: Actions.UPDATE_APPROVAL_CONFIG_RULE,
    payload
  };
};

type UpdateApprovalConfigLoading = {
  type: typeof Actions.UPDATE_APPROVAL_LOADING;
  payload: boolean;
};
export const updateApprovalConfigLoading = (payload: boolean) => {
  return {
    type: Actions.UPDATE_APPROVAL_LOADING,
    payload
  };
};

type UpdateApprovalRule = {
  type: typeof Actions.UPDATE_APPROVAL_RULE;
  payload: boolean;
};
export const updateApprovalRule = (payload: boolean) => {
  return {
    type: Actions.UPDATE_APPROVAL_RULE,
    payload
  };
};

export type ActionType =
  | UpdateApprovalConfig
  | UpdateApprovalConfigLoading
  | UpdateApprovalRule;
