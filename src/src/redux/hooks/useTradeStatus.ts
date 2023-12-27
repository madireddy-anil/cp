import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectTradeStatus } from "../../pages/Trades/Deposit/DepositSlice";

export const useTradeStatus = () => {
  const tradeStatus = useSelector(selectTradeStatus);

  return useMemo(() => ({ tradeStatus }), [tradeStatus]);
};
