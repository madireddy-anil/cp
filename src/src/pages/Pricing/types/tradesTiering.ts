interface MonthlyData {
  fromNumberOfMonthlyTrades: string;
  maxNumberOfMonthlyTrades: string;
  fromMonthlyBuyAmount: string;
  maxMonthlyBuyAmount: string;
}

interface SingleData {
  fromValueOfSingleBuyAmount: string;
  maxValueOfSingleBuyAmount: string;
}

type TradesTieringItem = {
  tradesTier: boolean;
  tradesTieringMethod: string;
  spread: string;
  monthly: MonthlyData;
  single: SingleData;
  isFinalTier: boolean;
};

export default TradesTieringItem;
