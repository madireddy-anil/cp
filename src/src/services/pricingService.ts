import { accountApi as apiUrl } from "./accountService";

export interface ForeignExchangePricingResponse {
  status?: string;
  data?: ForeignExchangePricing[];
  message?: string;
}

export interface ForeignExchangePricing {
  payments?: Payments;
  trades?: Trades;
  products?: string[];
  _id?: string;
  profileType?: string;
  profileActive?: boolean;
  entityId?: string;
  staticFees?: any[];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
  id?: string;
}

export interface Payments {
  tiering?: Tiering[];
}

export interface Tiering {
  monthly?: Monthly;
  single?: Single;
  _id?: string;
  spread?: number;
  tradesTier?: boolean;
  tradesTieringMethod?: "monthly_volume" | "single_value" | "monthly_value";
  isFinalTier?: boolean;
  tradesTieringActive?: boolean;
}

export interface Monthly {
  fromNumberOfMonthlyTrades?: number;
  maxNumberOfMonthlyTrades?: number;
  fromMonthlyBuyAmount?: number;
  maxMonthlyBuyAmount?: number;
}
export interface Single {
  fromValueOfSingleBuyAmount?: number;
  maxValueOfSingleBuyAmount?: number;
}
export interface Trades {
  _id?: string;
  buyCurrency?: string;
  sellCurrency?: string;
  tradesActive?: boolean;
  tiering?: Tiering[];
}

export interface PricingResponse {
  data: Array<object>;
}
export interface PricingPaymentResponse {
  data: any[];
}

export interface PricingStaticFeesResponse {
  data: Array<object>;
}

export const api = apiUrl.injectEndpoints({
  endpoints: (builder) => ({
    getForeignExchange: builder.query<
      ForeignExchangePricingResponse,
      { formValues: any }
    >({
      query: ({ formValues }) => {
        const urlParam =
          formValues.buyCurrency && formValues.sellCurrency
            ? `?buyCurrency=${formValues.buyCurrency}&sellCurrency=${formValues.sellCurrency}`
            : "";
        return {
          url: `pricing/list/foreignExchange${urlParam}`,
          method: "GET"
        };
      }
    }),
    getPricingPayments: builder.query<
      PricingPaymentResponse,
      { formValue: any }
    >({
      query: ({ formValue }) => {
        const urlParam = formValue.transactionCurrency
          ? `?transactionCurrency=${formValue.transactionCurrency}`
          : "";
        return {
          url: `pricing/list/payments${urlParam}`,
          method: "GET"
        };
      }
    }),
    getPricingStaticFees: builder.query<PricingStaticFeesResponse, any>({
      query: () => {
        return {
          url: `pricing/list/staticFees`,
          method: "GET"
        };
      }
    })
  }),
  overrideExisting: true
});
export const {
  useGetForeignExchangeQuery,
  useGetPricingPaymentsQuery,
  useGetPricingStaticFeesQuery
} = api;
