import TieringItem from "./tiering";

interface PricingPaymentsItem {
  direction: string;
  priority: string;
  transactionCurrency: string;
  type: string;
  paymentsActive: boolean;
  tiering: TieringItem;
}

type PaymentsItem = {
  payments: PricingPaymentsItem;
};
export default PaymentsItem;
