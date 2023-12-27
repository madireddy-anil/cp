import { Col, Row, Button } from "@payconstruct/design-system";

interface ButtonProps {
  onSaveText?: string;
  onBackText?: string;
  btnLoader?: boolean;
  btnLoaderOnBack?: boolean;
  isBtnEnabled?: boolean;
  formType?: "button" | "submit" | "reset";
  btnLeftIcon?: any;
  btnRightIcon?: any;
  aIconPosition?: "left" | "right";
  bIconPosition?: "left" | "right";
  onSave?: (e: any) => void;
  onBack?: (e: any) => void;
}

const Buttons: React.FC<ButtonProps> = ({
  onSaveText,
  onBackText,
  btnLoader,
  btnLoaderOnBack,
  isBtnEnabled,
  formType,
  btnLeftIcon = "leftArrow",
  btnRightIcon = "arrowRight",
  aIconPosition = "left",
  bIconPosition = "right",
  onSave,
  onBack
}) => {
  return (
    <Row>
      {onBackText && (
        <Col>
          <Button
            type="secondary"
            label={onBackText}
            icon={{
              name: btnLeftIcon,
              position: aIconPosition
            }}
            loading={btnLoaderOnBack}
            onClick={onBack}
          />
        </Col>
      )}
      {onSaveText && (
        <Col offset={1}>
          <Button
            type={"primary"}
            label={onSaveText}
            icon={{
              name: btnRightIcon,
              position: bIconPosition
            }}
            formType={formType}
            loading={btnLoader}
            disabled={isBtnEnabled}
            onClick={onSave}
          />
        </Col>
      )}
    </Row>
  );
};

export { Buttons };
