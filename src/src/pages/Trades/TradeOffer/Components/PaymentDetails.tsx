import { Text } from "@payconstruct/design-system";
import { EFXOrder } from "@payconstruct/pp-types";
import { Card } from "../../Components/Card/Card";
import styles from "../tradeOffer.module.css";
import { Statistic } from "antd";
import {
  fieldCurrencyFormatter,
  fractionFormat
} from "../../../../utilities/transformers";
import { camelize } from "../../../../config/transformer";
const { Countdown } = Statistic;

interface PaymentDetailsProps {
  trade: EFXOrder;
}
const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  trade: {
    buyCurrency,
    id,
    status,
    buyAmount,
    sellCurrency,
    mainSellCurrency,
    financials,
    requestedAccountType,
    depositType
  }
}) => {
  const { exchange, clientAllRate } = financials || {};
  const { client } = exchange || {};
  const { sellAmount } = client || {};

  const deadline =
    (financials?.approvedAt
      ? new Date(financials?.approvedAt)
      : new Date()
    ).getTime() +
    1000 * 30 * 60;

  const _buyAmount = fractionFormat(buyAmount ?? buyAmount);

  return (
    <Card>
      <p className={styles["trade-offer-card__title"]}>Payment Details</p>
      {/* {isLoading ? (
        <Spinner />
      ) : (
        <> */}
      <div className={styles["space-between"]}>
        <Text size="default" label="You Sell" weight="lighter" />
        <Text
          size="default"
          label={`${buyCurrency} ${_buyAmount}`}
          weight="regular"
        />
      </div>
      <div className={styles["space-between"]}>
        <Text size="default" label="You Buy" weight="lighter" />
        <Text
          size="default"
          label={
            sellCurrency && sellAmount
              ? `${sellCurrency} (${
                  mainSellCurrency ? mainSellCurrency : "ETH"
                }) ${fieldCurrencyFormatter(sellAmount, sellCurrency)}`
              : `${sellCurrency ?? sellCurrency} (${
                  mainSellCurrency ? mainSellCurrency : "ETH"
                }) --`
          }
          weight="regular"
        />
      </div>
      <div className={styles["space-between"]}>
        <Text size="default" label="Deposit Account Type" weight="lighter" />
        <Text
          size="default"
          label={`${
            requestedAccountType === "personal" ? "Personal" : "Corporate"
          }`}
          weight="regular"
        />
      </div>
      <div className={styles["space-between"]}>
        <Text size="default" label="Order Type" weight="lighter" />
        <Text size="default" label={camelize(depositType)} weight="regular" />
      </div>
      <div className={styles["space-between"]}>
        <Text size="default" label="Conversion Rate" weight="lighter" />
        <div>
          <Text
            size="default"
            label={`${buyCurrency}.${sellCurrency} ${
              clientAllRate
                ? parseFloat(clientAllRate ?? "0").toPrecision(8)
                : "--"
            }`}
            weight="regular"
          />
          <br />
          <Text
            size="default"
            weight="lighter"
            label={`${sellCurrency}.${buyCurrency} ${
              clientAllRate
                ? (1 / parseFloat(clientAllRate ?? "0")).toPrecision(8)
                : "--"
            }`}
          />
        </div>
      </div>
      {status === "pending_approval_client" && (
        <div className={styles["space-between"]}>
          <Text size="default" label="Expires In" weight="lighter" />
          <Countdown value={deadline} format="mm:ss" />
        </div>
      )}
      {/* </>
      )} */}
    </Card>
  );
};

export { PaymentDetails };
