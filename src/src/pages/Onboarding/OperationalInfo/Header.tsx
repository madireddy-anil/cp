import { Header, HeaderContent } from "../../../components/PageHeader/Header";
import { Divider } from "antd";
import { Button, Text } from "@payconstruct/design-system";

interface HeaderProps {
  title: string;
  isFilterEnabled: boolean;
  btnLabel?: string;
  setShowModal?: (e: any) => void;
}

const OperationalInfoHeader: React.FC<HeaderProps> = ({
  title,
  isFilterEnabled,
  btnLabel,
  setShowModal
}) => {
  return (
    <div style={{ marginBottom: "-20px", marginTop: "25px" }}>
      <Header>
        <HeaderContent.LeftSide>
          {/* <HeaderContent.Title>{title}</HeaderContent.Title> */}
          <Text size="small" weight="bold" label={title} />
          {setShowModal && (
            <Button
              label={btnLabel}
              icon={{
                name: "add",
                position: "left"
              }}
              onClick={setShowModal}
              size="small"
              type="primary"
              style={{ marginLeft: "20px", marginTop: "-5px" }}
            />
          )}
        </HeaderContent.LeftSide>
        <HeaderContent.RightSide>
          {isFilterEnabled && (
            <Button
              label="Filters"
              //   onClick={() => {
              //     dispatch(showFilterAction(true));
              //   }}
              size="medium"
              type="tertiary"
              icon={{
                name: "filter",
                position: "left"
              }}
            />
          )}
        </HeaderContent.RightSide>
      </Header>
      <Divider style={{ marginTop: "-30px", marginBottom: "50px" }} />
    </div>
  );
};

export { OperationalInfoHeader as default };
