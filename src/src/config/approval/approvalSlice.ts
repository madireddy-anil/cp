import { createSlice } from "@reduxjs/toolkit";
import { userIdAction, userLogoutAction } from "../general/actions";
import { RootState } from "../../redux/store";
import {
  ModalProps,
  ModalShowProps,
  GroupModalType,
  TransactionDetails,
  PaymentConfirmModalType,
  AddRuleMessageModalType,
  ApprovalRule,
  ApproverUserIds,
  Transaction,
  Config
} from "../../pages/Approvals/Approval.Interface";
import { api } from "../../services/authService";
import { GroupModal, PaymentModal, MessageModal } from "../../enums/Approval";
import actions from "../../services/approvalService/actions";

type SliceState = {
  userId: string;
  isLoading: boolean;

  showGroup: boolean;
  showPayment: boolean;
  showMessage: boolean;
  showDeactivateRule: boolean;

  groupModalType: string;
  paymentModalType: string;
  messageModalType: string;

  // isApprovalRuleActiavted: boolean;

  approvalsRequired: boolean;
  totalApprovalsRequired: number;
  approvers: ApproverUserIds[];

  selectedApprovers: string[];
  approvalQueue: Transaction[];
  approvalQueueExist: boolean;
  selectedTransaction: { [key: string]: any };
  activeAccordionKeys: string[];

  isUserExistInApprovers: boolean;

  notificationModal: ModalProps;

  isToggleOff: boolean;
};

const initialState: SliceState = {
  userId: "",
  isLoading: false,

  showGroup: false,
  showPayment: false,
  showMessage: false,
  showDeactivateRule: false,

  groupModalType: GroupModal.Add,
  paymentModalType: PaymentModal.Approve,
  messageModalType: MessageModal.Success,

  approvalsRequired: false,
  totalApprovalsRequired: 0,
  approvers: [],
  approvalQueueExist: false,

  selectedApprovers: [],
  approvalQueue: [],
  selectedTransaction: {},
  activeAccordionKeys: [],

  isUserExistInApprovers: false,
  notificationModal: {
    show: false,
    title: "o",
    text: "o",
    textOne: "o",
    modalType: "default"
  },

  isToggleOff: false
};

const approvalSlice = createSlice({
  name: "approval",
  initialState: initialState,
  reducers: {
    updateGroupModalShow: (state, action: ModalShowProps) => {
      state.showGroup = action.payload;
    },
    updateGroupModalType: (state, action: GroupModalType) => {
      state.groupModalType = action.payload;
    },

    updatePaymentModalShow: (state, action: ModalShowProps) => {
      state.showPayment = action.payload;
    },
    updatePaymentModalType: (state, action: PaymentConfirmModalType) => {
      state.paymentModalType = action.payload;
    },

    updateMessageModalShow: (state, action: ModalShowProps) => {
      state.showMessage = action.payload;
    },
    updateMessageModalType: (state, action: AddRuleMessageModalType) => {
      state.messageModalType = action.payload;
    },

    updateDeactivateModalShow: (state, action: ModalShowProps) => {
      state.showDeactivateRule = action.payload;
    },

    updateActiveAccordionKeys: (state, action: { payload: string[] }) => {
      state.activeAccordionKeys = action.payload;
    },

    updateNotificationModal: (state, action: { payload: ModalProps }) => {
      state.notificationModal = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogoutAction, () => {
        return initialState;
      })
      .addCase(userIdAction, (state, action) => {
        state.userId = action.payload ?? "";
      })
      // .addCase(action.GET_CLIENT_BY_ID, () => {
      //   return initialState;
      // })
      .addCase(actions.TOGGLE_ON_RULE, (state: SliceState) => {
        state.isLoading = true;
      })
      .addCase(actions.TOGGLE_ON_RULE_FAILURE, (state: SliceState) => {
        state.isLoading = false;
      })
      .addCase(
        actions.TOGGLE_ON_RULE_SUCCESS,
        (state: SliceState, action: { payload: boolean; type: string }) => {
          const { payload } = action;
          // state.showGroup = false;
          state.isLoading = false;
          state.approvalsRequired = payload;
          state.showDeactivateRule = false;
        }
      )
      .addCase(actions.TOGGLE_OFF_RULE, (state: SliceState) => {
        state.isToggleOff = false;
        state.isLoading = true;
      })
      .addCase(actions.TOGGLE_OFF_RULE_FAILURE, (state: SliceState) => {
        state.isLoading = false;
      })
      .addCase(
        actions.TOGGLE_OFF_RULE_SUCCESS,
        (state: SliceState, action: { payload: boolean; type: string }) => {
          // const { payload } = action;
          // state.showGroup = false;
          state.isLoading = false;
          state.isToggleOff = true;
          state.approvalsRequired = false;
          state.showDeactivateRule = false;
        }
      )
      .addCase(actions.GET_APPROVAL_RULE, (state: SliceState) => {
        state.isLoading = true;
      })

      .addCase(
        actions.GET_APPROVAL_RULE_SUCCESS,
        (state: SliceState, action: { payload: Config; type: string }) => {
          const { payload } = action;
          state.isLoading = false;
          state.approvers = payload?.TransactionApprovalRule?.approvers;
          state.totalApprovalsRequired =
            payload?.TransactionApprovalRule?.approvalsRequired;
          state.approvalsRequired = payload.clientConfig?.transactionApproval
            ? true
            : false;
          const selectedApproversUserIds = payload?.TransactionApprovalRule
            ?.approvers?.length
            ? payload?.TransactionApprovalRule?.approvers
                .filter((item: ApproverUserIds) => item.id && item.id)
                .map((user: any) => {
                  return user.id;
                })
            : state.selectedApprovers;
          state.selectedApprovers = selectedApproversUserIds;
          state.isUserExistInApprovers = selectedApproversUserIds?.includes(
            state.userId
          );
        }
      )
      .addCase(actions.GET_APPROVAL_RULE_FAILURE, (state: SliceState) => {
        state.isLoading = false;
      })
      .addCase(actions.GET_TRANSACTION_BY_ID, (state: SliceState) => {
        state.isLoading = true;
        state.selectedTransaction = {};
      })
      .addCase(actions.GET_TRANSACTION_BY_ID_FAILURE, (state: SliceState) => {
        state.isLoading = false;
      })
      .addCase(
        actions.GET_TRANSACTION_BY_ID_SUCCESS,
        (
          state: SliceState,
          action: { payload: TransactionDetails; type: string }
        ) => {
          const { payload } = action;
          state.isLoading = false;
          state.selectedTransaction = payload;
        }
      )
      .addCase(actions.GET_APPROVAL_QUEUE, (state: SliceState) => {
        // state.isLoading = true;
      })
      .addCase(actions.GET_APPROVAL_QUEUE_FAILURE, (state: SliceState) => {
        // state.isLoading = false;
      })
      .addCase(
        actions.GET_APPROVAL_QUEUE_SUCCESS,
        (
          state: SliceState,
          action: { payload: Transaction[]; type: string }
        ) => {
          const { payload } = action;
          // state.isLoading = false;
          state.approvalQueue = payload;
          state.approvalQueueExist = payload?.length ? true : false;
        }
      )
      .addCase(actions.POST_APPROVAL_RULE, (state: SliceState) => {
        state.isLoading = true;
      })
      .addCase(actions.POST_APPROVAL_RULE_FAILURE, (state: SliceState) => {
        state.isLoading = false;
        state.messageModalType = MessageModal.Error;
        state.showMessage = true;
      })
      .addCase(
        actions.POST_APPROVAL_RULE_SUCCESS,
        (
          state: SliceState,
          action: { payload: ApprovalRule; type: string }
        ) => {
          const { payload } = action;
          state.showGroup = false;
          state.isLoading = false;
          state.showMessage = true;
          state.messageModalType = MessageModal.Success;

          state.totalApprovalsRequired = payload?.approvalsRequired;
          state.approvers = payload?.approvers;
          state.selectedApprovers = payload?.approvers?.length
            ? payload?.approvers
                .filter((item: ApproverUserIds) => item.id && item.id)
                .map((user: any) => {
                  return user.id;
                })
            : state.selectedApprovers;
          state.isUserExistInApprovers = state.selectedApprovers?.includes(
            state.userId
          );
        }
      )
      .addCase(actions.APPROVE_PAYMENT, (state: SliceState) => {
        state.isLoading = true;
      })
      .addCase(actions.APPROVE_PAYMENT_SUCCESS, (state: SliceState) => {
        state.isLoading = false;
        state.showPayment = false;
      })
      .addCase(actions.APPROVE_PAYMENT_FAILURE, (state: SliceState) => {
        state.isLoading = false;
      })
      .addCase(actions.REJECT_PAYMENT, (state: SliceState) => {
        state.isLoading = true;
      })
      .addCase(actions.REJECT_PAYMENT_SUCCESS, (state: SliceState) => {
        state.isLoading = false;
        state.showPayment = false;
      })
      .addCase(actions.REJECT_PAYMENT_FAILURE, (state: SliceState) => {
        state.isLoading = false;
        state.activeAccordionKeys = [];
      })
      .addMatcher(
        api.endpoints.getProfile.matchFulfilled,
        (state, { payload }) => {
          state.userId = payload?.data?.id;
          state.isUserExistInApprovers = state.selectedApprovers?.includes(
            state.userId
          );
        }
      );
  }
});

export const {
  updateGroupModalShow,
  updateGroupModalType,
  updatePaymentModalShow,
  updatePaymentModalType,
  updateMessageModalShow,
  updateMessageModalType,
  updateDeactivateModalShow,

  updateActiveAccordionKeys,
  updateNotificationModal
} = approvalSlice.actions;

export const selectLoading = (state: RootState) => state.approval.isLoading;

export const selectApprovalRequired = (state: RootState) =>
  state.approval.approvalsRequired;
export const selectApprovalCount = (state: RootState) =>
  state.approval.totalApprovalsRequired;
export const selectedApprovers = (state: RootState) =>
  state.approval.selectedApprovers;
export const selectedApprovalExist = (state: RootState) =>
  state.approval.approvalQueueExist;

export const selectApprovalQueue = (state: RootState) =>
  state.approval.approvalQueue;
export const selectTransaction = (state: RootState) =>
  state.approval.selectedTransaction;

export const selectGroupModalShow = (state: RootState) =>
  state.approval.showGroup;
export const selectGroupModalType = (state: RootState) =>
  state.approval.groupModalType;

export const selectPaymentModalShow = (state: RootState) =>
  state.approval.showPayment;
export const selectPaymentModalType = (state: RootState) =>
  state.approval.paymentModalType;

export const selectMessageModalShow = (state: RootState) =>
  state.approval.showMessage;
export const selectMessageModalType = (state: RootState) =>
  state.approval.messageModalType;

export const selectDeactivateModalShow = (state: RootState) =>
  state.approval.showDeactivateRule;

export const selectNotificationModal = (state: RootState) =>
  state.approval.notificationModal;

export const selectUserExistInApprovers = (state: RootState) =>
  state.approval.isUserExistInApprovers;

export const selectApprovalToggleOff = (state: RootState) =>
  state.approval.isToggleOff;

export default approvalSlice.reducer;
