import { all, takeLatest, put, call, select, delay } from "redux-saga/effects";
import axiosMethod from "../../utilities/apiCaller";
import { Notification } from "@payconstruct/design-system";
import {
  TransactionDetails,
  // ActivateRule,
  Transaction,
  Config
} from "../../pages/Approvals/Approval.Interface";
import { updateNotificationModal } from "../../config/approval/approvalSlice";

import actions, { GetApprovalQueueType } from "./actions";

const {
  approvalPrivateGet,
  approvalPrivatePost,
  approvalPrivatePut,
  approvalPrivateDelete
} = axiosMethod;

const toggleTurnOnRule = (
  token: string,
  activate: boolean,
  clientId: string
) => {
  const api = {
    endpoint: `toggle`,
    token: token,
    selectedEntityId: clientId
  };
  return approvalPrivatePut(api, { activate }).then((response: any) => {
    return response.data.data;
  });
};

export function* toggleOnRule(values: any) {
  const { activate } = values;
  try {
    const token: string = yield select((state: any) => state.auth.token);
    const selectedEntityId: string = yield select(
      (state: any) => state.auth.selectedEntityId
    );
    yield call(toggleTurnOnRule, token, activate, selectedEntityId);
    yield put({
      type: actions.TOGGLE_ON_RULE_SUCCESS,
      payload: activate
    });
  } catch (err) {
    yield put({
      type: actions.TOGGLE_ON_RULE_FAILURE,
      payload: JSON.stringify(err)
    });
    !activate &&
      updateNotificationModal({
        show: true,
        modalType: "error",
        title: "deactivateRuleErrTitle",
        text: "deactivateRuleErrNote"
      });
  }
}

const toggleTurnOffRule = (token: string) => {
  const api = {
    endpoint: `toggle`,
    token: token
  };
  return approvalPrivateDelete(api).then((response: any) => {
    return response.data.data;
  });
};

export function* toggleOffRule(values: any) {
  const { activate } = values;
  try {
    const token: string = yield select((state: any) => state.auth.token);
    yield call(toggleTurnOffRule, token);
    yield put({
      type: actions.TOGGLE_OFF_RULE_SUCCESS,
      payload: activate
    });
  } catch (err) {
    yield put({
      type: actions.TOGGLE_OFF_RULE_FAILURE,
      payload: JSON.stringify(err)
    });
    Notification({
      type: "warning",
      message: "",
      description:
        "We apologies for the inconvenience. Please get in touch with your customer service representative."
    });
  }
}

// get approval rule
const getApprovalRule = (token: string, clientId: string) => {
  const api = {
    endpoint: `config`,
    token: token
  };
  return approvalPrivateGet(api).then((response: any) => {
    return response.data;
  });
};

export function* getRule() {
  try {
    const token: string = yield select((state: any) => state.auth.token);
    const selectedEntityId: string = yield select(
      (state: any) => state.auth.selectedEntityId
    );
    const response: Config = yield call(
      getApprovalRule,
      token,
      selectedEntityId
    );
    const validateResponse: Config = {
      TransactionApprovalRule: {
        approvalsRequired: 0,
        approvers: []
      },
      clientConfig: {
        clientId: "",
        lastUpdatedAt: "",
        transactionApproval: false,
        type: ""
      }
    };
    const returnResponse = Object.entries(validateResponse)?.length
      ? response
      : validateResponse;
    yield put({
      type: actions.GET_APPROVAL_RULE_SUCCESS,
      payload: returnResponse
    });
  } catch (err) {
    yield put({
      type: actions.GET_APPROVAL_RULE_FAILURE
      // payload: err
    });
  }
}

// add or edit approval rule
const postApprovalRule = (token: string, data: any, clientId: string) => {
  const { rule } = data;
  const api = {
    endpoint: `rule`,
    token: token,
    selectedEntityId: clientId
  };
  return approvalPrivatePut(api, rule).then((response: any) => {
    return response.data;
  });
};

export function* postRule(rules: any) {
  const { rule } = rules;
  const groupModalType: string = yield select(
    (state: any) => state.approval.groupModalType
  );
  try {
    const token: string = yield select((state: any) => state.auth.token);
    const selectedEntityId: string = yield select(
      (state: any) => state.auth.selectedEntityId
    );
    yield call(postApprovalRule, token, rules, selectedEntityId);
    yield delay(3000);
    yield put({
      type: actions.POST_APPROVAL_RULE_SUCCESS,
      payload: rule
    });
    // on add or edit rule notifications
    yield put(
      groupModalType === "ADD"
        ? updateNotificationModal({
            show: true,
            modalType: "success",
            title: "addRuleSuccessTitle",
            text: "addRuleSuccessNoteOne",
            textOne: "addRuleSuccessNoteTwo"
          })
        : updateNotificationModal({
            show: true,
            modalType: "success",
            title: "editRuleSuccessTitle",
            text: "editRuleSuccessNoteOne"
          })
    );
  } catch (err) {
    yield put({
      type: actions.POST_APPROVAL_RULE_FAILURE,
      payload: JSON.stringify(err)
    });
    yield put(
      groupModalType === "ADD"
        ? updateNotificationModal({
            show: true,
            modalType: "error",
            title: "editRuleSuccessTitle",
            text: "editRuleSuccessNoteOne"
          })
        : updateNotificationModal({
            show: true,
            modalType: "error",
            title: "editRuleErrorTitle",
            text: "editRuleErrorNote"
          })
    );
  }
}

// get approval queue
const getTransactionList = (token: string) => {
  const api = {
    endpoint: `queue`,
    token: token
  };
  return approvalPrivateGet(api).then((response: any) => {
    return response.data;
  });
};

export function* getApprovalQueue(action: GetApprovalQueueType) {
  try {
    const {
      payload: { token }
    } = action;
    const response: Transaction[] = yield call(getTransactionList, token);
    yield put({
      type: actions.GET_APPROVAL_QUEUE_SUCCESS,
      payload: response
    });
  } catch (err) {
    yield put({
      type: actions.GET_APPROVAL_QUEUE_FAILURE
      // payload: err
    });
  }
}

// get transaction by ID
const getTransaction = (token: string, transaction: any, clientId: string) => {
  const api = {
    endpoint: `transaction/${transaction.id}`,
    token: token,
    selectedEntityId: clientId
  };
  return approvalPrivateGet(api).then((response: any) => {
    return response.data;
  });
};

export function* getTransactionById(values: any) {
  try {
    const token: string = yield select((state: any) => state.auth.token);
    const selectedEntityId: string = yield select(
      (state: any) => state.auth.selectedEntityId
    );
    const response: TransactionDetails = yield call(
      getTransaction,
      token,
      values,
      selectedEntityId
    );
    yield put({
      type: actions.GET_TRANSACTION_BY_ID_SUCCESS,
      payload: response
    });
  } catch (err) {
    yield put({
      type: actions.GET_TRANSACTION_BY_ID_FAILURE
      // payload: err
    });
  }
}

// approve payment
const approvePayment = (token: string, data: any, clientId: string) => {
  const api = {
    endpoint: `approve/${data.id}`,
    token: token,
    selectedEntityId: clientId
  };
  return approvalPrivatePost(api, {}).then((response: any) => {
    return response.data.data;
  });
};

export function* proceedApprovePayment(values: any) {
  try {
    const token: string = yield select((state: any) => state.auth.token);
    const selectedEntityId: string = yield select(
      (state: any) => state.auth.selectedEntityId
    );
    const response: null = yield call(
      approvePayment,
      token,
      values,
      selectedEntityId
    );
    yield delay(5000);
    yield put({
      type: actions.APPROVE_PAYMENT_SUCCESS,
      payload: response
    });
    yield put({
      type: actions.GET_APPROVAL_QUEUE,
      payload: { token }
    });
  } catch (err) {
    yield put({
      type: actions.APPROVE_PAYMENT_FAILURE,
      payload: JSON.stringify(err)
    });
    updateNotificationModal({
      show: true,
      modalType: "error",
      title: "approvePaymentErrorTitle",
      text: "approvePaymentErrorNote"
    });
  }
}

// reject payment
const rejectPayment = (token: string, data: any, clientId: string) => {
  const api = {
    endpoint: `reject/${data.id}`,
    token: token,
    selectedEntityId: clientId
  };
  return approvalPrivatePost(api, {}).then((response: any) => {
    return response.data.data;
  });
};

export function* proceedRejectPayment(values: any) {
  try {
    const token: string = yield select((state: any) => state.auth.token);
    const selectedEntityId: string = yield select(
      (state: any) => state.auth.selectedEntityId
    );
    const response: null = yield call(
      rejectPayment,
      token,
      values,
      selectedEntityId
    );
    yield delay(5000);
    yield put({
      type: actions.REJECT_PAYMENT_SUCCESS,
      payload: response
    });
    yield put({
      type: actions.GET_APPROVAL_QUEUE,
      payload: { token }
    });
  } catch (err) {
    yield put({
      type: actions.REJECT_PAYMENT_FAILURE,
      payload: JSON.stringify(err)
    });
    updateNotificationModal({
      show: true,
      modalType: "error",
      title: "rejectPaymentErrorTitle",
      text: "rejectPaymentErrorNote"
    });
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.TOGGLE_ON_RULE, toggleOnRule)]);
  yield all([takeLatest(actions.TOGGLE_OFF_RULE, toggleOffRule)]);
  yield all([takeLatest(actions.GET_APPROVAL_RULE, getRule)]);
  yield all([takeLatest(actions.POST_APPROVAL_RULE, postRule)]);
  yield all([takeLatest(actions.GET_APPROVAL_QUEUE, getApprovalQueue)]);
  yield all([takeLatest(actions.GET_TRANSACTION_BY_ID, getTransactionById)]);
  yield all([takeLatest(actions.APPROVE_PAYMENT, proceedApprovePayment)]);
  yield all([takeLatest(actions.REJECT_PAYMENT, proceedRejectPayment)]);
}
