type PricingStaticFeesItem = {
  currency: string;
  amount: string;
  description: string;
  feeFrequency: string;
  staticFeesActive: boolean;
};

type StaticFeesItem = {
  staticFees: PricingStaticFeesItem;
};
export default StaticFeesItem;
