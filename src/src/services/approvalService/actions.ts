import { ApprovalRule } from "../../pages/Approvals/Approval.Interface";

const actions = {
  TOGGLE_ON_RULE: "TOGGLE_ON_RULE",
  TOGGLE_ON_RULE_SUCCESS: "TOGGLE_ON_RULE_SUCCESS",
  TOGGLE_ON_RULE_FAILURE: "TOGGLE_ON_RULE_FAILURE",

  TOGGLE_OFF_RULE: "TOGGLE_OFF_RULE",
  TOGGLE_OFF_RULE_SUCCESS: "TOGGLE_OFF_RULE_SUCCESS",
  TOGGLE_OFF_RULE_FAILURE: "TOGGLE_OFF_RULE_FAILURE",

  POST_APPROVAL_RULE: "POST_APPROVAL_RULE",
  POST_APPROVAL_RULE_SUCCESS: "POST_APPROVAL_RULE_SUCCESS",
  POST_APPROVAL_RULE_FAILURE: "POST_APPROVAL_RULE_FAILURE",

  GET_APPROVAL_RULE: "GET_APPROVAL_RULE",
  GET_APPROVAL_RULE_SUCCESS: "GET_APPROVAL_RULE_SUCCESS",
  GET_APPROVAL_RULE_FAILURE: "GET_APPROVAL_RULE_FAILURE",

  GET_APPROVAL_QUEUE: "GET_APPROVAL_QUEUE",
  GET_APPROVAL_QUEUE_SUCCESS: "GET_APPROVAL_QUEUE_SUCCESS",
  GET_APPROVAL_QUEUE_FAILURE: "GET_APPROVAL_QUEUE_FAILURE",

  GET_TRANSACTION_BY_ID: "GET_TRANSACTION_BY_ID",
  GET_TRANSACTION_BY_ID_SUCCESS: "GET_TRANSACTION_BY_ID_SUCCESS",
  GET_TRANSACTION_BY_ID_FAILURE: "GET_TRANSACTION_BY_ID_FAILURE",

  APPROVE_PAYMENT: "APPROVE_PAYMENT",
  APPROVE_PAYMENT_SUCCESS: "APPROVE_PAYMENT_SUCCESS",
  APPROVE_PAYMENT_FAILURE: "APPROVE_PAYMENT_FAILURE",

  REJECT_PAYMENT: "REJECT_PAYMENT",
  REJECT_PAYMENT_SUCCESS: "REJECT_PAYMENT_SUCCESS",
  REJECT_PAYMENT_FAILURE: "REJECT_PAYMENT_FAILURE"
};

export default actions;

export const toggleOnRule = (activate: boolean) => {
  return {
    type: actions.TOGGLE_ON_RULE,
    activate
  };
};

export const toggleOffRule = () => {
  return {
    type: actions.TOGGLE_OFF_RULE
  };
};

export const getRule = () => {
  return {
    type: actions.GET_APPROVAL_RULE
  };
};

export const postRule = (rule: ApprovalRule) => {
  return {
    type: actions.POST_APPROVAL_RULE,
    rule
  };
};

export interface GetApprovalQueueType {
  type:
    | typeof actions.GET_APPROVAL_QUEUE
    | typeof actions.GET_APPROVAL_QUEUE_SUCCESS
    | typeof actions.GET_APPROVAL_QUEUE_FAILURE;
  payload: {
    token: string;
  };
}

export const getApprovalQueue = (
  payload: GetApprovalQueueType["payload"]
): GetApprovalQueueType => {
  return {
    type: actions.GET_APPROVAL_QUEUE,
    payload
  };
};

export const getTransactionById = (id: string) => {
  return {
    type: actions.GET_TRANSACTION_BY_ID,
    id
  };
};

export const approvePayment = (id: string) => {
  return {
    type: actions.APPROVE_PAYMENT,
    id
  };
};

export const rejectPayment = (id: string) => {
  return {
    type: actions.REJECT_PAYMENT,
    id
  };
};
