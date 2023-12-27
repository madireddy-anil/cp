import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState
} from "react";
import axios from "axios";
import {
  Actions,
  ActionType,
  updateApprovalConfig,
  updateApprovalConfigLoading
} from "./ApprovalsActions";
import { AuthContext } from "@payconstruct/orbital-auth-provider";
import { approvalUrl } from "../../../config/variables";
import { ApproverUserIds, Config } from "../Approval.Interface";

export type ApprovalsStateProps = {
  loading?: boolean;
  approvers: Partial<ApproverUserIds>[];
  isUserApprover: boolean;
  totalApprovalsRequired: number;
  isApprovalRuleActivated: boolean;
  approvalsUserIds: string[];
  refetchApprovalConfig: () => void;
  dispatch?: React.Dispatch<ActionType>;
};

const ApprovalsState: ApprovalsStateProps = {
  loading: false,
  approvers: [],
  isUserApprover: false,
  totalApprovalsRequired: 0,
  isApprovalRuleActivated: false,
  approvalsUserIds: [],
  refetchApprovalConfig: () => null
};

export function ApprovalsReducer(
  state: ApprovalsStateProps,
  action: ActionType
): ApprovalsStateProps {
  switch (action.type) {
    case Actions.UPDATE_APPROVAL_CONFIG_RULE:
      return { ...state, ...action.payload };
    case Actions.UPDATE_APPROVAL_LOADING:
      return { ...state, loading: action.payload };
    case Actions.UPDATE_APPROVAL_RULE:
      return { ...state, isApprovalRuleActivated: action.payload };
    default:
      return state;
  }
}

export const ApprovalsContext = React.createContext(ApprovalsState);

const ApprovalProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(ApprovalsReducer, {
    ...ApprovalsState
  });

  const { token, userId, orgId } = useContext(AuthContext);

  const [refetch, setRefetch] = useState<boolean>(false);
  const [URL] = useState(`${approvalUrl}/config`);

  const getApprovals = useCallback(async () => {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`
      }
    };
    return axios.get<void, { data: Config }>(URL, config).then((response) => {
      return response;
    });
  }, [URL, token]);

  useEffect(() => {
    if (token && userId && orgId) {
      dispatch(updateApprovalConfigLoading(true));
      getApprovals()
        .then((response) => {
          const { data } = response;
          if (data.hasOwnProperty("TransactionApprovalRule")) {
            const isApprover = data.TransactionApprovalRule.approvers
              .map((approver: ApproverUserIds) => approver.id)
              .includes(userId);
            const selectedApprovers = data?.TransactionApprovalRule?.approvers
              ?.length
              ? data?.TransactionApprovalRule?.approvers
                  .filter((item: ApproverUserIds) => item.id && item.id)
                  .map((user: ApproverUserIds) => {
                    return user.id;
                  })
              : [];

            dispatch(
              updateApprovalConfig({
                approvers: data?.TransactionApprovalRule?.approvers,
                isUserApprover: isApprover,
                totalApprovalsRequired:
                  data.TransactionApprovalRule.approvalsRequired,
                isApprovalRuleActivated:
                  !!data.clientConfig?.transactionApproval,
                approvalsUserIds: selectedApprovers,
                refetchApprovalConfig: () => null
              })
            );
          }
        })
        .catch((err) => console.log("APPROVAL_CONFIG_ERROR:", err))
        .finally(() => dispatch(updateApprovalConfigLoading(false)));
    }
  }, [token, orgId, userId, refetch, getApprovals]);

  return (
    <ApprovalsContext.Provider
      value={{
        ...state,
        dispatch: dispatch,
        refetchApprovalConfig: () => setRefetch(!refetch)
      }}
    >
      {children}
    </ApprovalsContext.Provider>
  );
};

export default ApprovalProvider;
