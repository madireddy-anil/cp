export type PaymentConfirmModalType = {
  payload: "APPROVE" | "REJECT";
};

export type AddRuleMessageModalType = {
  payload: "SUCCESS" | "ERROR";
};

export type GroupModalType = {
  payload: "ADD" | "EDIT";
};

export type ModalShowProps = {
  payload: boolean;
};

export interface ApprovalRule {
  approvalsRequired: number;
  approvers: ApproverUserIds[];
}

export interface ApproverUserIds {
  id: string;
  name?: string;
}

export interface ActivateRule {
  activate: boolean;
}

export interface Config {
  TransactionApprovalRule: ApprovalRule;
  clientConfig: {
    clientId: string;
    lastUpdatedAt: string;
    transactionApproval: boolean;
    type: string;
  };
}
export interface Transaction {
  GSI1PK: string;
  GSI1SK: string;
  PK: string;
  SK: string;
  creditor: string;
  createdAt: string;
  beneficiary: string;
  creditAmount: string;
  creditCurrency: string;
  creditorAccount: string;
  debitAmount: string;
  debitCurrency: string;
  mainDebitCurrency: string;
  providedBy: string;
  ruleMatched: string;
  approvedBy: string[];
  totalApprovalsRequired: number;
  transactionReference: string;
  type: string;
  txId: string;
  targetAmount?: string;
  targetCurrency?: string;
  withdrawalAddress?: string;
}

export interface TransactionDetails {
  accountName: string;
  amountInstructed: string;
  amountReceived: string;
  beneficiary: string;
  createdAt: string;
  createdBy: string;
  createdById: string;
  creditAmount: string;
  creditCurrency: string;
  creditorAccount: string;
  creditorAddress: string;
  creditorAgentId: string;
  creditorName: string;
  debitAmount: string;
  debitCurrency: string;
  debtorAccount: string;
  fees: string;
  providedBy: string;
  remittanceInformation: string;
  transactionReference: string;
  type: string;
  debtorCurrencyType: string;
  mainDebitCurrency: string;
  mainCreditCurrency: string;
}

export interface Users {
  id: string;
  addressValidated: boolean;
  addressVerified: boolean;
  mobilePhoneValidated: boolean;
  mobilePhoneVerified: boolean;
  emailValidated: boolean;
  emailVerified: true;
  loginFailCount: number;
  isProfileUpdated: boolean;
  tAndCsAccepted: boolean;
  emailSubscription: boolean;
  active: boolean;
  _id: string;
  entityId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneNumberPrefix: string;
  portal: string;
  userType: string;
  mfaEnabled: boolean;
  role: string;
  entities: string[];
  entity: string;
}

export interface ModalProps {
  show?: boolean;
  title?: string;
  text?: string;
  textOne?: string;
  modalType?: "default" | "notification" | "success" | "error" | "warning";
}
