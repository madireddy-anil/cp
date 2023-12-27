import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "antd";
import {
  Button,
  DatePicker,
  Form,
  Input,
  NumberInput,
  Select,
  SwitchName,
  Text,
  Tooltip,
  Icon
} from "@payconstruct/design-system";
import moment, { Moment } from "moment-timezone";

import {
  Header,
  HeaderContent
} from "../../../../components/PageHeader/Header";
import { Card } from "../../../Components/Card/Card";
import { Spacer } from "../../../../components/Spacer/Spacer";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/store";
import {
  updateFormValue,
  selectDepositAmount,
  showModalAction
} from "../../../Components/DepositAmount/DepositAmountSlice";
import {
  selectAccountCurrency,
  selectAccountSelection
} from "../../../Components/AccountSelection/AccountSelectionSlice";
import { useGetExitCurrencyQuery } from "../../../../services/routesService";
import { selectTimezone } from "../../../../config/general/generalSlice";

interface DepositAmountProps {
  ConfirmModal?: React.FunctionComponent<any>;
  confirmBtnLabel?: string;
  nextStepHandler?: () => void;
  previousStepHandler: () => void;
}

const DepositAmount: React.FC<DepositAmountProps> = (props) => {
  const {
    ConfirmModal,
    confirmBtnLabel,
    nextStepHandler,
    previousStepHandler
  } = props;
  const { Title } = HeaderContent;
  const dispatch = useAppDispatch();
  const selectedAccount = useAppSelector(selectAccountSelection);
  const selectCurrency = useAppSelector(selectAccountCurrency);
  const timezone = useAppSelector(selectTimezone);

  const { form, showModal } = useAppSelector(selectDepositAmount);
  const [depositForm] = Form.useForm();
  const {
    sellCurrency,
    mainSellCurrency,
    depositType,
    executionDate,
    requestedAccountType,
    // buyCurrency,
    buyAmount
    // remarks
  } = form;

  const dateFormat = "DD/MM/YYYY";
  const [date] = useState(
    executionDate
      ? moment(executionDate, dateFormat).tz(timezone)
      : moment().tz(timezone)
  );

  const [enableButton, setButtonEnabled] = useState(
    !!buyAmount && !!sellCurrency
  );

  useEffect(() => {
    dispatch(
      updateFormValue({
        sellCurrency: sellCurrency || "USDT",
        mainSellCurrency: mainSellCurrency || "ETH"
      })
    );
  }, [dispatch, sellCurrency, mainSellCurrency]);

  useEffect(() => {
    if (buyAmount && sellCurrency) {
      setButtonEnabled(true);
    } else {
      setButtonEnabled(false);
    }
  }, [buyAmount, sellCurrency]);

  useEffect(() => {
    const formattedDate = date.format(dateFormat);
    dispatch(
      updateFormValue({
        executionDate: formattedDate
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(
  //     updateFormValue({
  //       buyCurrency: buyCurrency ? buyCurrency : selectedAccount?.currency,
  //       sellCurrency,
  //       depositType,
  //       requestedAccountType,
  //       remarks,
  //       executionDate: date.format()
  //     })
  //   );
  // }, [
  //   dispatch,
  //   buyCurrency,
  //   sellCurrency,
  //   depositType,
  //   requestedAccountType,
  //   remarks,
  //   executionDate,
  //   selectedAccount?.currency,
  //   date
  // ]);

  const { data: dataCurrencies } = useGetExitCurrencyQuery(
    {
      currency: selectCurrency ?? ""
    },
    { skip: selectCurrency == null, refetchOnMountOrArgChange: true }
  );

  const onDatePick = (e: any, value: string) => {
    const formattedDate = moment(value, dateFormat)
      .tz(timezone)
      .format(dateFormat);
    dispatch(updateFormValue({ executionDate: formattedDate }));
  };

  type requestedAccountTypeOptionsType = {
    label: string;
    value: typeof requestedAccountType;
  }[];

  const requestedAccountTypeOptions: requestedAccountTypeOptionsType = [
    { label: "Personal Account", value: "personal" },
    { label: "Corporate Account", value: "corporate" }
  ];

  type accountTypeOptionsType = {
    label: string;
    value: typeof depositType;
  }[];

  const accountTypeOptions: accountTypeOptionsType = [
    { label: "Day Order", value: "day" },
    { label: "Overnight Order", value: "overnight" }
  ];

  const disabledDate = (current: Moment) => {
    // Can not select days before today
    return current < moment().subtract(2, "day").endOf("day");
  };

  // Cursor input
  let inputEl = useRef<HTMLInputElement>({} as HTMLInputElement);

  return (
    <div className="deposit-amount--wrapper">
      <Header>
        <Title subtitle="Enter the amount you would like sell, select the currency you want to buy and define required order attributes.">
          Amount
        </Title>
      </Header>
      <Form form={depositForm} initialValues={form}>
        <Row gutter={15}>
          <Col className="gutter-row" span={12}>
            <Card>
              <Text label="You Sell" weight="bold" />
              <Spacer size={15}></Spacer>
              <Row gutter={15}>
                <Col className="gutter-row" span={6}>
                  <Select
                    disabled={true}
                    label="Currency"
                    defaultValue={selectedAccount?.currency}
                    optionlist={[
                      [selectedAccount?.currency, selectedAccount?.currency]
                    ]}
                    onChange={(value) => {
                      dispatch(updateFormValue({ buyCurrency: value }));
                    }}
                    placeholder="Select Options"
                  />
                </Col>
                <Col className="gutter-row" span={18}>
                  <div className="currency-with-prefix">
                    <Form.Item name="buyAmount" required>
                      <NumberInput
                        label="Amount"
                        ref={inputEl}
                        autoFocus={true}
                        type="number"
                        min={0}
                        placeholder="0.00"
                        required
                        onChange={(value) => {
                          dispatch(
                            updateFormValue({ buyAmount: value as number })
                          );
                        }}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Text label="Select the currency you want to buy" weight="bold" />
              <Spacer size={15}></Spacer>
              <Select
                defaultValue={
                  sellCurrency
                    ? `${sellCurrency} (${mainSellCurrency})`
                    : "USDT (ETH)"
                }
                onChange={(value) => {
                  const [sellCurrency, mainSellCurrency] = value
                    .replace(/[()]/g, "")
                    .split(" ");
                  dispatch(updateFormValue({ sellCurrency, mainSellCurrency }));
                }}
                label="Currency"
                optionlist={dataCurrencies?.exitCurrencies?.map(
                  (currency: string) => {
                    return [currency, currency];
                  }
                )}
                placeholder="Select Options"
              />
            </Card>

            <div className="trade">
              <Spacer size={20}></Spacer>
              <div style={{ display: "flex", alignItems: "center" }}>
                <SwitchName
                  selectedOption={requestedAccountType === "personal" ? 0 : 1}
                  name="requestedAccountType"
                  onChange={(value) => {
                    const AccountValue = Object.values(
                      value
                    )[0] as typeof requestedAccountType;
                    dispatch(
                      updateFormValue({ requestedAccountType: AccountValue })
                    );
                  }}
                  options={requestedAccountTypeOptions}
                />
                <Tooltip
                  tooltipPlacement="right"
                  text="Choose a deposit account type."
                >
                  <Icon name="infoColored" />
                </Tooltip>
              </div>
              <Spacer size={20}></Spacer>
              <div style={{ display: "flex", alignItems: "center" }}>
                <SwitchName
                  selectedOption={depositType === "day" ? 0 : 1}
                  name="depositType"
                  onChange={(value) => {
                    const AccountValue = Object.values(
                      value
                    )[0] as typeof depositType;
                    dispatch(updateFormValue({ depositType: AccountValue }));
                  }}
                  options={accountTypeOptions}
                />
                <Tooltip
                  tooltipPlacement="right"
                  text="Choose 'Day Account' to deposit sell currency funds in an account within trading hours, or choose 'Overnight Account' to deposit sell currency accounts outside the trading hours."
                >
                  <Icon name="infoColored" />
                </Tooltip>
              </div>
              <Spacer size={20}></Spacer>
              <Card>
                <Text label="Execution date" weight="bold" />
                <Spacer size={15}></Spacer>
                <DatePicker
                  style={{ width: "100%" }}
                  disabledDate={disabledDate}
                  defaultValue={date}
                  onChange={onDatePick}
                  format={dateFormat}
                />
              </Card>
            </div>
            <Spacer size={40} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={previousStepHandler}
                type="secondary"
                label="Previous"
                icon={{
                  name: "leftArrow",
                  position: "left"
                }}
              />
              {ConfirmModal ? (
                <Button
                  disabled={enableButton ? false : true}
                  type="primary"
                  label={confirmBtnLabel}
                  icon={{
                    name: "rightArrow",
                    position: "right"
                  }}
                  onClick={() => dispatch(showModalAction(true))}
                />
              ) : (
                <Button
                  disabled={enableButton ? false : true}
                  onClick={nextStepHandler}
                  type="primary"
                  label="Continue"
                  icon={{
                    name: "rightArrow",
                    position: "right"
                  }}
                />
              )}
            </div>
          </Col>
          <Col className="gutter-row" span={12}>
            <Card>
              <Text label="Optional Remarks" weight="bold" />
              <Spacer size={15}></Spacer>
              <Input
                label="Remarks"
                name="remarks"
                type="textarea"
                size="medium"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  dispatch(updateFormValue({ remarks: event.target.value }));
                }}
              />
            </Card>
          </Col>
        </Row>
      </Form>
      {ConfirmModal && <ConfirmModal show={showModal} />}
    </div>
  );
};

export default DepositAmount;
