import React from "react";
import { Card } from "antd";
import { Row, Col, Text } from "@payconstruct/design-system";
import { Spacer } from "../../../components/Spacer/Spacer";

import style from "../style.module.css";

interface TxnSummaryCardProps {
  title: string;
  data: { [key: string]: string };
}

const TransactionCard: React.FC<TxnSummaryCardProps> = ({ title, data }) => {
  return (
    <Card className={style["approval__queue--card"]}>
      <Text size="small" weight="bold" label={title} />
      <Spacer size={10} />
      <Row>
        {Object.entries(data).length &&
          Object.entries(data).map(([key, value]) => {
            return (
              <Col
                style={{ overflowWrap: "break-word", marginBottom: "10px" }}
                key={key}
                span={12}
              >
                <Text size="xxsmall" color="#787879" label={key} />
                <br />
                <Text size="small" label={value} />
              </Col>
            );
          })}
      </Row>
    </Card>
  );
};

export default TransactionCard;
