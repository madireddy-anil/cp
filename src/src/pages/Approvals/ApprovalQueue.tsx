import React, { useContext, useMemo } from "react";
import { Tab, TableWrapper, Text } from "@payconstruct/design-system";
import { Spacer } from "../../components/Spacer/Spacer";
import { ApprovalsContext } from "./ApprovalsContext/ApprovalsProvider";
import { PaymentApprovalsList } from "./PaymentApprovals";
import { EcommApprovalsList } from "./EcommApprovals";
import { ManualPayoutsApproval } from "./ManualPayoutsApproval";
import { useFlags } from "launchdarkly-react-client-sdk";
import { flags } from "../../config/variables";
import { Constants } from "@payconstruct/fe-utils";

const ApprovalQueue: React.FC = () => {
  const { isApprovalRuleActivated } = useContext(ApprovalsContext);
  const LDFlags = useFlags();

  const feFlagConst = Constants.featureFlag;

  const useMemoizedApprovalTabs = useMemo(() => {
    return [
      {
        content: <PaymentApprovalsList />,
        key: "1",
        title: "Payments"
      },
      {
        content: <EcommApprovalsList />,
        key: "2",
        title: "Transfers to eCommerce",
        hidden: !LDFlags[flags.showApprovalQueue]
      },
      {
        content: <ManualPayoutsApproval />,
        key: "3",
        title: "Payouts",
        hidden: !LDFlags[feFlagConst.showManualPayout]
      }
    ];
  }, [LDFlags]);

  return (
    <>
      <Spacer size={45} />
      <Text size="medium" weight="bold">
        Approval Queue
      </Text>
      <Spacer size={20} />
      {isApprovalRuleActivated && (
        <TableWrapper>
          <Tab
            initialpanes={useMemoizedApprovalTabs}
            size="middle"
            tabposition="top"
            type="line"
          />
        </TableWrapper>
      )}

      {!isApprovalRuleActivated && (
        <Text size="small">
          Switch on the approval required toggle to view and approve
          transactions.
        </Text>
      )}

      <Spacer size={18} />
    </>
  );
};

export default ApprovalQueue;
