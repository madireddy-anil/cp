import React, { useState } from "react";
import { Table, Select, Icon } from "@payconstruct/design-system";
import { Space } from "antd";
import { Spacer } from "../../../components/Spacer/Spacer";
import {
  Tiering,
  useGetForeignExchangeQuery
} from "../../../services/pricingService";
import { Spinner } from "../../../components/Spinner/Spinner";
import { availableCurrencies } from "./availableCurrencies";

const statusIcon = (iconName: keyof typeof icons) => {
  const icons = [
    {
      name: "active",
      icon: "checkCircle"
    },
    {
      name: "inactive",
      icon: "closeCircle"
    }
  ];
  const icon: any = icons.find((icon) => icon.name === iconName);
  return icon ? icon.icon : "error";
};

const columns = [
  { title: "Method", dataIndex: "method" },
  { title: "Minimum", dataIndex: "minimum" },
  { title: "Maximum", dataIndex: "maximum" },
  { title: "Spread", dataIndex: "spread" },
  { title: "Mark Up", dataIndex: "markUp" },
  {
    title: "Status",
    dataIndex: "status",
    render: (status: keyof typeof statusIcon) => {
      return (
        <Space size={5}>
          <Icon name={statusIcon(status)} size="small" />
          <div style={{ paddingBottom: 5 }} className="uc-first">
            {status}
          </div>
        </Space>
      );
    }
  }
];

const ForeignExchange: React.FC = () => {
  const [formValues, setFormValues] = useState(
    {} as { sellCurrency: string; buyCurrency: string }
  );

  const onChangeHandler = (name: string) => (value: string) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const getTieringType = (tiering: Tiering) => {
    const minimum =
      tiering?.single?.fromValueOfSingleBuyAmount ??
      tiering?.monthly?.fromNumberOfMonthlyTrades ??
      tiering?.monthly?.fromMonthlyBuyAmount;

    const maximum =
      tiering?.single?.maxValueOfSingleBuyAmount ??
      tiering?.monthly?.maxNumberOfMonthlyTrades ??
      tiering?.monthly?.maxMonthlyBuyAmount;

    let method;
    if (tiering.tradesTieringMethod === "single_value")
      method = "Single buy amount";
    if (tiering.tradesTieringMethod === "monthly_volume")
      method = "Monthly trade volume";
    if (tiering.tradesTieringMethod === "single_value")
      method = "Monthly buy amount";

    return {
      method,
      minimum,
      maximum,
      spread: tiering.spread
    };
  };

  const { exchangeData, isLoading } = useGetForeignExchangeQuery(
    { formValues },
    {
      skip: !(!!formValues.sellCurrency && !!formValues.buyCurrency),
      refetchOnMountOrArgChange: true,
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        exchangeData: data?.data
          ?.map(({ trades }, idx) => {
            // if (!trades?.tradesActive) return [];

            return (
              trades?.tiering?.map((tiering, index) => {
                const {
                  method = "",
                  minimum = "",
                  maximum = "",
                  spread = ""
                } = getTieringType(tiering);

                console.log("tiering", tiering);

                return {
                  key: `foreignRates_${idx}${index}`,
                  tradesTier: tiering.tradesTier,
                  method:
                    method + (tiering.isFinalTier ? " (*Final Tier)" : ""),
                  minimum,
                  maximum,
                  spread,
                  status: trades?.tradesActive ? "active" : "inactive"
                };
              }) ?? []
            );
          })
          .flat(),
        isLoading,
        isFetching
      })
    }
  );

  console.log("exchangeData", exchangeData);

  // TODO: Refactor this
  const fromCurrencies = [...availableCurrencies];
  const matchFrom =
    formValues?.sellCurrency === "USDT"
      ? "USDT (ERC-20)"
      : formValues?.sellCurrency;
  const fromIndex = fromCurrencies.indexOf(matchFrom);
  if (fromIndex > -1) {
    fromCurrencies.splice(fromIndex, 1);
  }

  const toCurrencies = [...availableCurrencies];
  const matchTo =
    formValues?.buyCurrency === "USDT"
      ? "USDT (ERC-20)"
      : formValues?.buyCurrency;
  const toIndex = toCurrencies.indexOf(matchTo);
  if (toIndex > -1) {
    toCurrencies.splice(toIndex, 1);
  }

  return (
    <div>
      <Spacer size={30} />
      <div className="pricing-options">
        <>
          <Select
            label="From"
            style={{
              width: "97%"
            }}
            optionlist={fromCurrencies.map((ccy) => {
              if (ccy === "USDT (ERC-20)") return ["USDT", ccy];
              return [ccy, ccy];
            })}
            // optionlist={currencies?.currency.map((item: CurrenciesItem) => {
            //   return [item.code, item.code];
            // })}
            onChange={onChangeHandler("sellCurrency")}
          />
          <Select
            label="To"
            optionlist={toCurrencies.map((ccy) => {
              if (ccy === "USDT (ERC-20)") return ["USDT", ccy];
              return [ccy, ccy];
            })}
            // optionlist={currencies?.currency.map((item: CurrenciesItem) => {
            //   return [item.code, item.code];
            // })}

            onChange={onChangeHandler("buyCurrency")}
          />
        </>
      </div>
      <Spacer size={30} />
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Table
            dataSource={exchangeData ?? []}
            tableColumns={columns}
            scroll={{ x: true }}
            tableSize="small"
            pagination={false}
          />
        </>
      )}
      <Spacer size={20} />
    </div>
  );
};

export { ForeignExchange as default };
