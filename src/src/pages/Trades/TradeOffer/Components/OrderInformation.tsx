import { Col, Icon, Row, Tag } from "@payconstruct/design-system";
import { EFXOrder } from "@payconstruct/pp-types";

interface OrderInformationProps {
  trade: EFXOrder;
}

const OrderInformation: React.FC<OrderInformationProps> = ({ trade }) => {
  //Portal can be: bms | cms;
  const company =
    trade.createdBy.portal === "bms" ? "Orbital" : `${trade.clientName}`;

  const createdBy = `${trade.createdBy.firstName} - ${company}`;

  return (
    <Row gutter={[15, 15]} style={{ marginBottom: "15px" }}>
      <Col xs={24}>
        <div
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center"
          }}
        >
          <span
            style={{
              display: "inline-block",
              marginRight: "10px"
            }}
          >
            Created by:
          </span>
          <Tag
            hasEffect={false}
            label={createdBy}
            isPrefix={true}
            prefix={<Icon name="user" />}
          />
        </div>
      </Col>
    </Row>
  );
};

export { OrderInformation };
