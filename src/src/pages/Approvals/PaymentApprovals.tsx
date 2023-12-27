import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Spin,
  Text,
  Button,
  Icon,
  Accordions as TransactionList
} from "@payconstruct/design-system";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/store";
import TransactionCard from "./Components/TransactionCard";
import AcceptRejectPayment from "./Components/Modals/AcceptRejectPayment";
import { selectTimezone } from "../../config/general/generalSlice";
import {
  updateActiveAccordionKeys,
  updatePaymentModalShow,
  updatePaymentModalType,
  selectPaymentModalShow,
  selectPaymentModalType,
  selectApprovalQueue,
  selectTransaction,
  selectLoading
} from "../../config/approval/approvalSlice";
import { selectCurrentUserId } from "../../config/auth/authSlice";
import {
  getApprovalQueue,
  getTransactionById
} from "../../services/approvalService/actions";
import { formatDateAndTime } from "../../config/transformer";

import { PaymentModal } from "../../enums/Approval";
import { Transaction } from "./Approval.Interface";

import style from "./style.module.css";
import { ApprovalsContext } from "./ApprovalsContext/ApprovalsProvider";
import { AuthContext } from "@payconstruct/orbital-auth-provider";

import { Constants } from "@payconstruct/fe-utils";

const PaymentApprovalsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { token } = useContext(AuthContext);
  const { providedBy } = Constants;

  const { isUserApprover, totalApprovalsRequired } =
    useContext(ApprovalsContext);

  const timeZone: string = useAppSelector(selectTimezone);
  const isLoading = useAppSelector(selectLoading);
  const userId = useAppSelector(selectCurrentUserId);
  const showPayment = useAppSelector(selectPaymentModalShow);
  const paymentModalType = useAppSelector(selectPaymentModalType);

  const approvalQueue = useAppSelector(selectApprovalQueue);
  const selectedTransaction = useAppSelector(selectTransaction);

  const filteredQueue = useMemo(() => {
    return approvalQueue.filter((queueItem: any) => {
      return (
        queueItem?.type !== "internalTransfer" &&
        queueItem?.type !== "crypto_payout"
      );
    });
  }, [approvalQueue]);

  const activeAccordionKeys = useAppSelector(
    (state) => state.approval.activeAccordionKeys
  );
  const [paymentIdd, selectedPaymentId] = useState<string>("");

  useEffect(() => {
    if (token) dispatch(getApprovalQueue({ token }));
  }, [dispatch, token]);

  const handleViewTransaction = (paymentId: any) => {
    dispatch(updateActiveAccordionKeys([paymentId]));
    if (paymentId) {
      selectedPaymentId(paymentId);
      dispatch(getTransactionById(paymentId));
    }
  };

  const isTransactionApproved = (approvers: string[]) => {
    const isUserApproved = approvers?.length
      ? approvers.find((approverUserId: string) => approverUserId === userId)
      : undefined;
    return isUserApproved;
  };

  const getCardFooter = (
    paymentId: string,
    approvers: string[],
    createdById: string
  ) => {
    const userid = userId === createdById;
    let returnTransactionFooter;
    const isTransactionApprovedCheck = isTransactionApproved(approvers);
    returnTransactionFooter = (
      <>
        {userid ? (
          <div style={{ display: "flex", margin: "22px 8px 12px 25px" }}>
            <Text size="xxsmall">
              You cannot approve or reject a payment you created.
            </Text>
          </div>
        ) : (
          <div className={style["approval__btns"]}>
            {!isTransactionApprovedCheck &&
              isUserApprover &&
              buttons(paymentId)}
            {isTransactionApprovedCheck && (
              <div style={{ display: "flex", marginTop: "10px" }}>
                <div style={{ marginTop: "-2px" }}>
                  <Icon name="checkCircle" />
                </div>{" "}
                &nbsp;
                <Text>You have approved this payment</Text>
              </div>
            )}

            <div
              className={
                !isTransactionApprovedCheck && isUserApprover
                  ? style["approval__count"]
                  : ""
              }
            >
              {totalTransactionApprovalCount(approvers)}
            </div>
          </div>
        )}
      </>
    );
    return returnTransactionFooter;
  };

  const buttons = (paymentId: string) => {
    return (
      <>
        <Button
          style={{
            marginRight: "15px"
          }}
          type="primary"
          label="Approve"
          icon={{ name: "checkCircleOutline" }}
          onClick={() => {
            selectedPaymentId(paymentId);
            dispatch(updatePaymentModalShow(true));
            dispatch(updatePaymentModalType(PaymentModal.Approve));
          }}
        />
        <Button
          type="secondary"
          label="Reject"
          icon={{ name: "x" }}
          onClick={() => {
            selectedPaymentId(paymentId);
            dispatch(updatePaymentModalShow(true));
            dispatch(updatePaymentModalType(PaymentModal.Reject));
          }}
        />
      </>
    );
  };

  const stringDataValidation = (value: string) => {
    return value ? value : "--";
  };

  const totalTransactionApprovalCount = (approvers: string[]) => {
    return (
      <span className={style["approvers--counts"]}>
        <b>{approvers?.length ? <b>{approvers?.length}</b> : <b>0</b>}</b> of{" "}
        <b>{totalApprovalsRequired}</b> approvers have approved this payment
      </span>
    );
  };

  const getApprovalsQueue = () => {
    let returnApprovalQueue;
    const noContent = (
      <Text size="small">
        You have no payments in your payment queue. Any future payments will
        appear here for review.
      </Text>
    );
    returnApprovalQueue = (
      <TransactionList
        key="1"
        header=""
        headerSubtitle=""
        text=""
        activeKey={activeAccordionKeys}
        accordionData={filteredQueue.map((payment: Transaction) => {
          const paymentId: any = payment?.txId;
          return {
            id: paymentId,
            unCollapse: paymentIdd ? true : false,
            header: `Payment of ${stringDataValidation(
              payment?.debitAmount
            )} ${stringDataValidation(payment?.debitCurrency)}`,
            headerSubtitle: `To ${stringDataValidation(payment?.creditor)}`,
            headerRight: (
              <React.Fragment>
                <span>
                  {" "}
                  {formatDateAndTime(payment?.createdAt, timeZone)} &nbsp;
                </span>
                {isTransactionApproved(payment?.approvedBy) && (
                  <Icon name="checkCircle" />
                )}
              </React.Fragment>
            ),
            text: (
              <Spin loading={isLoading} label="Loading">
                <div style={{ marginTop: "-15px" }}>
                  <TransactionCard
                    title="Transfer Details"
                    data={{
                      "Created on": formatDateAndTime(
                        selectedTransaction?.createdAt,
                        timeZone
                      ),
                      "Created by": stringDataValidation(
                        selectedTransaction?.createdBy
                      ),

                      "Remittance information": stringDataValidation(
                        selectedTransaction?.remittanceInformation
                      ),
                      "Transaction reference": stringDataValidation(
                        selectedTransaction?.transactionReference
                      ),
                      "Amount instructed": `${stringDataValidation(
                        selectedTransaction?.debitAmount
                      )} ${stringDataValidation(
                        selectedTransaction?.debitCurrency
                      )}`,
                      "Amount to be received": `${stringDataValidation(
                        selectedTransaction?.creditAmount
                      )} ${stringDataValidation(
                        selectedTransaction?.creditCurrency
                      )}`,
                      Fees: stringDataValidation(selectedTransaction?.fees)
                    }}
                  />
                  {selectedTransaction?.debtorCurrencyType === "fiat" && (
                    <TransactionCard
                      title="Payout Account Details"
                      data={{
                        Account: stringDataValidation(
                          selectedTransaction?.debtorAccount
                        ),
                        "Account name": stringDataValidation(
                          selectedTransaction?.accountName
                        ),
                        "Provided by":
                          selectedTransaction?.debtorCurrencyType === "fiat"
                            ? providedBy.PayPerformLtd
                            : providedBy.PayPerformOU
                      }}
                    />
                  )}
                  {selectedTransaction?.debtorCurrencyType === "crypto" && (
                    <TransactionCard
                      title="Payout Account Details"
                      data={{
                        "Vault address": stringDataValidation(
                          selectedTransaction?.debtorAccount
                        ),
                        "Account name": stringDataValidation(
                          selectedTransaction?.accountName
                        ),
                        "Provided by":
                          selectedTransaction?.debtorCurrencyType === "fiat"
                            ? providedBy.PayPerformLtd
                            : providedBy.PayPerformOU
                      }}
                    />
                  )}

                  {selectedTransaction?.debtorCurrencyType === "fiat" && (
                    <TransactionCard
                      title="Beneficiary Details"
                      data={{
                        Name: stringDataValidation(
                          selectedTransaction?.creditorName
                        ),
                        Address: stringDataValidation(
                          selectedTransaction?.creditorAddress
                        ),
                        Account: stringDataValidation(
                          selectedTransaction?.creditorAccount
                        ),
                        "Bank code / BIC": stringDataValidation(
                          selectedTransaction?.creditorAgentId
                        )
                      }}
                    />
                  )}
                  {selectedTransaction?.debtorCurrencyType === "crypto" && (
                    <TransactionCard
                      title="Beneficiary Details"
                      data={{
                        Name: stringDataValidation(
                          selectedTransaction?.creditorName
                        ),
                        Address: stringDataValidation(
                          selectedTransaction?.creditorAddress
                        ),
                        "Wallet address": stringDataValidation(
                          selectedTransaction?.creditorAccount
                        )
                      }}
                    />
                  )}

                  {Object.entries(selectedTransaction)?.length
                    ? getCardFooter(
                        payment?.txId,
                        payment?.approvedBy,
                        selectedTransaction?.createdById
                      )
                    : ""}

                  {/* {Object.entries(selectedTransaction)?.length === 0
                    ? noDataFound()
                    : ""} */}
                </div>
              </Spin>
            )
          };
        })}
        accordionType="single-collapse"
        onChange={handleViewTransaction}
      />
    );

    return filteredQueue?.length ? returnApprovalQueue : noContent;
  };

  return (
    <>
      {getApprovalsQueue()}
      <AcceptRejectPayment
        show={showPayment}
        modalType={paymentModalType}
        paymentId={paymentIdd}
        isLoading={isLoading}
        toggleShow={(value) => dispatch(updatePaymentModalShow(value))}
      />
    </>
  );
};

export { PaymentApprovalsList };
