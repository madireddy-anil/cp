import React, { useState } from "react";
import { Table, Select, Text, Colors } from "@payconstruct/design-system";
import { Spacer } from "../../../components/Spacer/Spacer";
import StatusIcon from "./StatusIcon";
import { MoreOutlined } from "@ant-design/icons";
import { useGetPricingPaymentsQuery } from "../../../services/pricingService";
import { Spinner } from "../../../components/Spinner/Spinner";
import TieringItem from "../types/tiering";
import PaymentsItem from "../types/payment";

import { availableCurrencies } from "./availableCurrencies";

const Payments: React.FC = () => {
  const columns = [
    { title: "Tiering", dataIndex: "tearing" },
    { title: "Method", dataIndex: "method" },
    { title: "Min Value", dataIndex: "minValue" },
    { title: "Max Value", dataIndex: "maxValue" },
    { title: "Fee Method", dataIndex: "feeMethod" },
    { title: "Lifting Fee Amount", dataIndex: "liftingAmt" },
    { title: "Invoice Fee Method", dataIndex: "invoiceFee" },
    { title: "Invoice Amount", dataIndex: "invoiceAmt" },
    { title: "Invoice Currency", dataIndex: "invoiceCurrency" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => <StatusIcon level={status} />
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => (
        <div className="payments-action">
          <MoreOutlined twoToneColor={Colors.grey.neutral900} />
        </div>
      )
    }
  ];

  const tieringRemap = (tiering: any) => {
    let n: number = 0;
    const tieringData = tiering.map((item: TieringItem, index: number) => {
      let method = "";
      let minValue = "";
      let maxValue = "";

      const {
        paymentsTier,
        paymentsTieringMethod,
        invoiceFeeMethod,
        invoiceAmount,
        invoiceCurrency,
        liftingFeeMethod,
        liftingFeeAmount,
        monthly,
        single,
        isFinalTier,
        paymentsTieringActive
      } = item;
      if (paymentsTieringMethod === "monthly_volume") {
        method = "Monthly trade volume";
        minValue = monthly.fromNumberOfMonthlyPayments;
        maxValue = monthly.maxNumberOfMonthlyPayments;
      } else if (paymentsTieringMethod === "single_value") {
        method = "Single buy amount";
        minValue = single.fromValueOfSinglePayment;
        maxValue = single.maxValueOfSinglePayment;
      } else if (paymentsTieringMethod === "monthly_value") {
        method = "Monthly buy amount";
        minValue = monthly.fromValueOfMonthlyPayments;
        maxValue = monthly.maxValueOfMonthlyPayments;
      }
      const row = {
        key: `payments${index}${n}`,
        tearing: paymentsTier ? "Yes" : "No",
        method: method + (isFinalTier ? " (*Final Tier)" : ""),
        minValue,
        maxValue,
        feeMethod: liftingFeeMethod,
        liftingAmt: liftingFeeAmount,
        invoiceFee: invoiceFeeMethod,
        invoiceAmt: invoiceAmount,
        invoiceCurrency,
        status: paymentsTieringActive ? "active" : "inactive"
      };
      return row;
    });
    return tieringData;
  };

  const [formValue, setFormValue] = useState({});

  const onChangeHandler = (name: string) => (value: string) => {
    setFormValue({ ...formValue, [name]: value });
  };

  const { payments, isLoading } = useGetPricingPaymentsQuery(
    { formValue },
    {
      refetchOnMountOrArgChange: true,
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        payments: data?.data,
        isLoading,
        isFetching
      })
    }
  );

  return (
    <div>
      <Spacer size={20} />
      <>
        <Select
          label="Currency"
          optionlist={availableCurrencies.map((ccy) => {
            if (ccy === "USDT (ERC-20)") return ["USDT", ccy];
            return [ccy, ccy];
          })}
          onChange={onChangeHandler("transactionCurrency")}
        />
      </>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Spacer size={30} />
          {payments?.map((item: PaymentsItem, idx: number) => {
            const {
              direction,
              priority,
              transactionCurrency,
              type,
              paymentsActive,
              tiering
            } = item.payments;
            if (!direction) return [];
            let tieringData = tieringRemap(tiering);

            return (
              <div key={idx}>
                <div className="payments-list">
                  <div className="payments-list-item">
                    <Text
                      size="xxsmall"
                      color={Colors.grey.neutral500}
                      label="Direction"
                    />
                    <Text
                      size="small"
                      color={Colors.grey.neutral700}
                      label={direction}
                    />
                  </div>
                  <div className="payments-list-item">
                    <Text
                      size="xxsmall"
                      color={Colors.grey.neutral500}
                      label="Priority"
                    />
                    <Text
                      size="small"
                      color={Colors.grey.neutral700}
                      label={priority}
                    />
                  </div>
                  <div className="payments-list-item">
                    <Text
                      size="xxsmall"
                      color={Colors.grey.neutral500}
                      label="Transaction Currency"
                    />
                    <Text
                      size="small"
                      color={Colors.grey.neutral700}
                      label={transactionCurrency}
                    />
                  </div>
                  <div className="payments-list-item">
                    <Text
                      size="xxsmall"
                      color={Colors.grey.neutral500}
                      label="Payment Type"
                    />
                    <Text
                      size="small"
                      color={Colors.grey.neutral700}
                      label={type}
                    />
                  </div>
                  <div className="payments-list-item">
                    <Text
                      size="xxsmall"
                      color={Colors.grey.neutral500}
                      label="Status"
                    />
                    <StatusIcon
                      level={paymentsActive ? "active" : "inactive"}
                    />
                  </div>
                </div>
                <Spacer size={30} />
                <Table
                  dataSource={tieringData}
                  tableColumns={columns}
                  tableSize="small"
                  pagination={false}
                />
                <Spacer size={30} />
              </div>
            );
          })}
        </>
      )}
      <Spacer size={30} />
    </div>
  );
};

export { Payments as default };
