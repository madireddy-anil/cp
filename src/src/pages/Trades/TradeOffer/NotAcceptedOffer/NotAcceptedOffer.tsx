import {
  Button,
  Col,
  Colors,
  Row,
  Notification,
  Accordions,
  Text,
  Status
} from "@payconstruct/design-system";
import { Empty, PageHeader } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { EFXOrder } from "@payconstruct/pp-types";
import { useIntl } from "react-intl";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { Spacer } from "../../../../components/Spacer/Spacer";
import { AccountDetails } from "../Components/AccountDetails";
import { BeneficiaryDetails } from "../Components/BeneficiaryDetails";
import { PaymentDetails } from "../Components/PaymentDetails";
import { ClientDetails } from "../Components/ClientDetails";
import styles from "../tradeOffer.module.css";
import useElementSize from "../../../../customHooks/useElementSize";
import {
  useAcceptTradeMutation,
  useRejectTradeMutation
} from "../../../../services/tradesService";
import { Account } from "../../../../services/accountService";
import { selectTimezone } from "../../../../config/general/generalSlice";
import { useAppSelector } from "../../../../redux/hooks/store";
import {
  formatDate,
  getOrderStatusWithCamelCase
} from "../../../../config/transformer";

import Wrapper from "../../Components/Wrapper";
import { Card } from "../../Components/Card/Card";
import css from "../tradeOffer.module.css";

interface NotAcceptedOfferProps {
  trade?: EFXOrder;
  account?: Account;
  style?: CSSProperties;
}

const NotAcceptedOffer: React.FC<NotAcceptedOfferProps> = ({
  trade,
  account,
  style
}) => {
  let { id } = useParams<{ id: string }>();

  const queueRef = useRef(null);
  const intl = useIntl();
  const navigate = useNavigate();
  const { width } = useElementSize(queueRef);
  const [acceptTrade] = useAcceptTradeMutation();
  const [rejectTrade] = useRejectTradeMutation();
  const [processing, setProcessing] = useState(false);
  const timezone = useAppSelector(selectTimezone);
  const [pendingApproval, setPendingApproval] = useState(
    trade?.status === "pending_approval_client"
  );

  useEffect(() => {
    if (trade?.status === "pending_approval_client")
      return setPendingApproval(true);

    setPendingApproval(false);
  }, [trade]);

  const customStyles = {
    padding: `20px 40px 30px ${width + 40}px`,
    background: Colors.grey.neutral50
  };

  // const pageHeaderDesign = {
  //   topPadding: { paddingTop: `20px` },
  //   title: { paddingBottom: `12px` },
  //   titleLast: { paddingBottom: `25px` }
  // };

  const handleClickAccept = async () => {
    setProcessing(true);

    try {
      await acceptTrade({ id }).unwrap();
      navigate("/orders");
    } catch (err) {
      Notification({
        message: intl.formatMessage({ id: "acceptTradeError" }),
        description: intl.formatMessage({ id: "acceptTradeErrorDescription" }),
        type: "error"
      });
      setProcessing(false);
    }
  };

  const handleClickReject = async () => {
    setProcessing(true);
    try {
      await rejectTrade({ id }).unwrap();
      navigate("/orders");
    } catch (err) {
      Notification({
        message: intl.formatMessage({ id: "rejectTradeError" }),
        description: intl.formatMessage({ id: "rejectTradeErrorDescription" }),
        type: "error"
      });
      setProcessing(false);
    }
  };

  const company =
    trade?.createdBy.portal === "bms" ? "Orbital" : `${trade?.clientName}`;
  const createdBy = `${trade?.createdBy.firstName} - ${company}`;

  return (
    <Col xs={24} sm={24} md={24} lg={24} xl={24} style={style}>
      {/* <TradeQueue ref={queueRef} style={{ position: "fixed" }} /> */}
      {!trade && (
        <main style={customStyles}>
          <Empty
            description={
              <span>
                Trade Reference was not found: <b>{id}</b>
              </span>
            }
          />
        </main>
      )}
      {trade && (
        <main style={customStyles}>
          {/* <Header>
            <LeftSide>
              <Title subtitle={`Execution Date - ${day} ${month}, ${year}`}>
                Order Id - {trade?.orderReference}
              </Title>
            </LeftSide>
          </Header> */}
          <PageHeader
            title={`Order Id - ${trade?.orderReference}`}
            className="site-page-header"
            style={{ padding: "0px 0px 0px 0px" }}
          />
          <Spacer size={15} />
          <Wrapper>
            <div className={css["summary-content"]}>
              <div className={css["summary-element"]}>
                <p>
                  <Text
                    label="Execution Date"
                    size="small"
                    color={Colors.grey.neutral500}
                  />
                </p>
                <Text
                  label={formatDate(trade?.executionDate, timezone)}
                  color={Colors.grey.neutral700}
                  weight="bold"
                />
              </div>
              <div className={css["summary-element"]}>
                <p>
                  <Text
                    label="Status"
                    size="small"
                    color={Colors.grey.neutral500}
                  />
                </p>
                <Text
                  label={getOrderStatusWithCamelCase(trade?.status)}
                  color={Colors.grey.neutral700}
                  weight="bold"
                />
              </div>
              <div className={css["summary-element"]}>
                <p>
                  <Text
                    label="Currency Pair"
                    size="small"
                    color={Colors.grey.neutral500}
                  />
                </p>
                <Text
                  label={`${trade.buyCurrency}.${trade.sellCurrency} (${
                    trade.mainSellCurrency ? trade.mainSellCurrency : "ETH"
                  })`}
                  color={Colors.grey.neutral700}
                  weight="bold"
                />
              </div>
            </div>
          </Wrapper>
          <Spacer size={15} />
          <Accordions
            // status="completed"
            accordionType="simple"
            header="Order Information"
            headerRight={
              <Status type={pendingApproval ? "approved" : "pending"} />
            }
            text={
              <>
                {/* <OrderInformation trade={trade} /> */}
                <Row
                  gutter={[15, 15]}
                  style={{
                    marginBottom: 15,
                    marginLeft: 50,
                    marginTop: -30
                  }}
                >
                  <Col span={24}>
                    <Text
                      label={`Created by: ${createdBy}`}
                      color={Colors.grey.neutral500}
                    />
                  </Col>
                </Row>
                <Row gutter={[15, 15]} style={{ marginBottom: "15px" }}>
                  <Col span={24}>
                    <Card>
                      <div className={css["order-wrapper"]}>
                        <AccountDetails trade={trade} account={account} />
                        <ClientDetails trade={trade} />
                        <BeneficiaryDetails trade={trade} />
                      </div>
                    </Card>
                  </Col>
                </Row>
                <Row gutter={[15, 15]}>
                  <Col span={24}>
                    <PaymentDetails trade={trade} />
                  </Col>
                </Row>
              </>
            }
          />
          <Spacer size={15} />
          <Row gutter={15}>
            <Col span={24}>
              <Accordions
                accordionType="simple"
                disabled={true}
                header="We'll notify you when deposit details are available"
                headerRight={<Status type="pending" tooltipText="Pending" />}
                text={<></>}
              />
            </Col>
          </Row>
          <Spacer size={15} />

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Button
              disabled={!pendingApproval}
              loading={processing}
              type="primary"
              label="Accept Order"
              style={{ marginRight: "15px" }}
              icon={{ name: "checkCircleOutline" }}
              className={styles["button-icon"]}
              onClick={handleClickAccept}
            />
            <Button
              disabled={!pendingApproval}
              loading={processing}
              type="secondary"
              label="Decline Order"
              icon={{ name: "close" }}
              onClick={handleClickReject}
            />
          </div>
        </main>
      )}
    </Col>
  );
};

export { NotAcceptedOffer };
