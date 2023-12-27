import TradesTieringItem from "./tradesTiering";

interface PricingTradesItem {
  tradesActive: string;
  tiering: TradesTieringItem;
}

type ForeignExchangeItem = {
  trades: PricingTradesItem;
};
export default ForeignExchangeItem;
