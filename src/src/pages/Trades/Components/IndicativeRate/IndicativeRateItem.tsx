import {
  Text,
  Status,
  Colors,
  CurrencyTag,
  Tooltip
} from "@payconstruct/design-system";
import { Col, Row } from "antd";
import React from "react";
import {
  IndicativeRate,
  IndicativeRateRates
} from "../../../../services/routesService";
import { isCurrencyPresent } from "../../../Components/Helpers/currencyTag";
import moment from "moment";
import "./IndicativeRate.css";

interface PropTypesItem {
  rate: IndicativeRate;
}

// const currencyIcon = (iconName: string): any => {
//   const currency = isCurrencyPresent(iconName);
//   if (currency) return `flag${currency}`;
//   return "error";
// };

const IndicativeRateItem: React.FC<PropTypesItem> = ({ rate }) => {
  const rates = rate.rates;

  return (
    <Col
      className="rate-grid-card-container"
      key={`grid`}
      style={{ padding: "0.5rem" }}
    >
      <Col className="rate-grid-card">
        <Row style={{ padding: "10px 10px 0 10px" }}>
          <div className="rate-grid-card-currency">
            {rate.currency && (
              <>
                <Tooltip text="Sell currency">
                  <CurrencyTag
                    type="simple"
                    currency={rate.currency}
                    prefix={isCurrencyPresent(rate.currency)}
                  />
                  <Text
                    size="medium"
                    weight="bold"
                    label={rate.currency}
                    style={{ marginLeft: "5px" }}
                  />
                </Tooltip>
              </>
            )}
            {!rate.currency && <div className="dot-grey" />}
          </div>
        </Row>
        {rates.map((item: IndicativeRateRates, index: number) => {
          const isLast = index < rates.length - 1;
          const isExpired = item.expiresAt && moment(item.expiresAt).isAfter();
          const inverseRate = isNaN(parseInt(item.inverseRate))
            ? item.inverseRate === "NaN"
              ? "N/A"
              : "0.0000"
            : item.inverseRate.toString().substring(0, 16);
          const rate = isNaN(parseInt(item.rate))
            ? item.rate === "NaN"
              ? "N/A"
              : "0.0000"
            : item.rate.toString().substring(0, 16);

          return (
            <React.Fragment key={index}>
              <Row
                align="middle"
                justify="start"
                wrap={false}
                style={{
                  padding: "0px 5px 0 15px",
                  marginBottom: "10px",
                  marginTop: "10px"
                }}
              >
                <Col
                  style={{ display: "flex", alignItems: "center", width: 50 }}
                >
                  <Tooltip text="Buy currency">
                    <Text
                      size="small"
                      className="text-value"
                      label={item.quoteCurrency}
                      style={{ color: Colors.black.primary }}
                    />
                  </Tooltip>
                </Col>
                <Col
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: "column",
                    marginRight: "auto"
                  }}
                >
                  <div>
                    <Tooltip
                      text={
                        <div>
                          <p style={{ color: "#ffffff" }}>Multiply rate:</p>
                          <p style={{ color: "#ffffff" }}>
                            Sell currency amount x Rate = Buy currency amount
                          </p>
                        </div>
                      }
                    >
                      <Text
                        className="text-value"
                        size="small"
                        label={inverseRate}
                        style={{ color: Colors.black.primary }}
                      />
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip
                      text={
                        <div>
                          <p style={{ color: "#ffffff" }}>Divide rate:</p>
                          <p style={{ color: "#ffffff" }}>
                            Sell currency amount / Rate = Buy currency amount
                          </p>
                        </div>
                      }
                    >
                      <Text
                        className="text-value"
                        size="small"
                        label={rate}
                        style={{ color: Colors.black.primary }}
                      />
                    </Tooltip>
                  </div>
                </Col>
                <Col style={{ display: "flex", alignItems: "center" }}>
                  {item.expiresAt !== null ? (
                    isExpired === false ? (
                      <Status type="rejected" tooltipText="Expired rate" />
                    ) : (
                      <Status type="approved" tooltipText="Active rate" />
                    )
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
              {isLast && (
                <div
                  style={{
                    borderBottom: `1px solid ${Colors.grey.neutral100}`
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Col>
    </Col>
  );
};

export default IndicativeRateItem;
