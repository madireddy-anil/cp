import {
  Colors,
  CurrencyTag,
  List,
  Modal,
  Text,
  Notification
} from "@payconstruct/design-system";
import { Spacer } from "../../../../components/Spacer/Spacer";
import { Card } from "../Card/Card";
import {
  selectBeneficiary,
  showModalAction
} from "../../../Components/Beneficiary/BeneficiarySlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/store";
import { isCurrencyPresent } from "../../../Components/Helpers/currencyTag";
import {
  CreateTradeResponse,
  useCreateTradeMutation
} from "../../../../services/tradesService";
import { setLoading } from "../../../../config/general/generalSlice";
import { useNavigate } from "react-router-dom";
import { selectDepositForm } from "../../Deposit/DepositSlice";
import styles from "./confirmTrade.module.css";
import { useEffect } from "react";
import { selectCurrencies } from "../../../../config/currencies/currenciesSlice";
import { selectCompanyName } from "../../../../config/auth/authSlice";
import { numberFormat } from "../../../../utilities/transformers";

const ConfirmTradeBody: React.FC = () => {
  const {
    executionDate,
    buyAmount,
    sellCurrency = "",
    mainSellCurrency,
    buyCurrency,
    remarks
  } = useAppSelector(selectDepositForm);

  const { beneficiaryName } = useAppSelector(selectBeneficiary);
  const currenciesList = useAppSelector(selectCurrencies);

  const getCurrencyName = (currencyCode: string) => {
    if (!currencyCode) return "";
    return currenciesList.find(
      (currency: { [key: string]: string }) => currency.code === currencyCode
    )?.name;
  };

  return (
    <div className={styles["order-confirm-wrapper"]}>
      <p>Please review and corfirm the Exotic FX order.</p>
      <Card
        style={{
          borderColor: "transparent",
          backgroundColor: Colors.grey.neutral50
        }}
      >
        <Text label="You Sell" weight="bold" />
        <Spacer size={15}></Spacer>
        <Card style={{ borderColor: Colors.grey.neutral100, padding: "20px" }}>
          <div className={styles["currency-card"]}>
            {/* <p className={styles["currency-card__value"]}>
              {numberFormat(buyAmount ?? 0)}
            </p> */}
            <CurrencyTag
              prefix={isCurrencyPresent(buyCurrency)}
              currency={buyCurrency ? buyCurrency : ""}
            />
          </div>
          <Text
            className={styles["currency-card__account"]}
            label={getCurrencyName(buyCurrency)}
            weight="regular"
            size="small"
            color={Colors.grey.neutral500}
          />
          {/* <Text
            className={styles["currency-card__account"]}
            label={`${selectedAccount?.accountName}`}
            weight="regular"
            size="small"
            color={Colors.grey.neutral500}
          /> */}
        </Card>
        <Spacer size={15}></Spacer>
        <List
          background={false}
          listType="horizontal"
          src={[
            {
              label: "Sell amount",
              value: numberFormat(buyAmount ?? 0)
            }
          ]}
        />
        <Text label="You Buy" weight="bold" />
        <Spacer size={15}></Spacer>
        <Card style={{ borderColor: Colors.grey.neutral100, padding: "20px" }}>
          <div className={styles["currency-card"]}>
            <CurrencyTag
              prefix={isCurrencyPresent(sellCurrency)}
              currency={`${sellCurrency}(${
                mainSellCurrency ? mainSellCurrency : "ETH"
              })`}
            />
          </div>
          <Text
            className={styles["currency-card__account"]}
            label={`${beneficiaryName ?? ""}`}
            weight="regular"
            size="small"
            color={Colors.grey.neutral500}
          />
        </Card>
        <Spacer size={15}></Spacer>
        <List
          background={false}
          listType="horizontal"
          src={[
            {
              label: "Execution Date",
              value: executionDate
            },
            {
              label: "Remarks",
              value: `${remarks}`
            }
          ]}
        />
      </Card>
    </div>
  );
};

interface ConfirmTradeProps {
  show: boolean;
}

const ConfirmTrade: React.FC<ConfirmTradeProps> = ({ show }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [newTrade, { isLoading }] = useCreateTradeMutation();
  const registeredCompanyName = useAppSelector(selectCompanyName);

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch, isLoading]);

  const depositForm = useAppSelector(selectDepositForm);

  const onTradeConfirmation = async () => {
    try {
      await newTrade({ ...depositForm, clientName: registeredCompanyName })
        .unwrap()
        .then((tradeStatus: CreateTradeResponse) => {
          navigate(
            `/order/deposit/status?id=${tradeStatus.id}&orderReference=${tradeStatus.orderReference}`
          );
        });
      dispatch(setLoading(false));
      dispatch({ type: "reset/deposit" });
    } catch (err) {
      console.log(err);
      dispatch(setLoading(false));
      Notification({
        message: "Trade order error",
        description: `There was an error with your EFX order. Please get in touch with your customer representative.`,
        type: "error"
      });
    }
  };

  return (
    <Modal
      modalView={show}
      title={"Confirm order"}
      onCancelText={"Cancel"}
      onOkText={"Confirm"}
      btnLoading={isLoading}
      onClickCancel={() => {
        dispatch(showModalAction(false));
      }}
      onClickOk={() => {
        onTradeConfirmation();
      }}
      description={<ConfirmTradeBody />}
    />
  );
};

export { ConfirmTrade };
