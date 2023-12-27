import React, { ReactNode } from "react";
import {
  Button,
  Colors,
  Text,
  Col,
  Row,
  Divider,
  Tooltip
} from "@payconstruct/design-system";
import { Spacer } from "../../../../components/Spacer/Spacer";

import Styles from "./accountSettings.module.css";

interface AccountSettingsCardProps {
  headingTitle: string;
  headingSubTitle?: string;
  contentData: any[];
  onClickEdit?: (data?: any) => void;
}

type TContentData = {
  id: number;
  label: string;
  value: string | ReactNode;
  editIcon: boolean;
};

const AccountSettings: React.FC<AccountSettingsCardProps> = ({
  headingTitle,
  headingSubTitle,
  contentData,
  onClickEdit
}) => {
  return (
    <div className={Styles["account_settings__card__container"]}>
      <div className={Styles["account_settings__header"]}>
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }}>
            <Text
              size="medium"
              weight="bold"
              color={Colors.grey.neutral700}
              label={headingTitle}
            />
            <Spacer size={5} />
            {headingSubTitle && (
              <Text
                size="default"
                color={Colors.grey.neutral500}
                label={headingSubTitle}
              />
            )}
          </Col>
        </Row>
      </div>
      <div className={Styles["account_settings__body"]}>
        {contentData.map((d: TContentData, i: number) => {
          const test: any = d.value;
          return (
            <div key={i} className={Styles["account_settings__content"]}>
              <Row style={{ marginTop: "17px" }} gutter={15}>
                <Col xs={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }}>
                  <Text
                    size="default"
                    color={Colors.grey.neutral500}
                    label={d.label}
                  />
                </Col>
                <Col xs={{ span: 20 }} md={{ span: 12 }} lg={{ span: 10 }}>
                  <Text
                    // size="medium"
                    weight="bold"
                    color={Colors.grey.neutral700}
                    label={test}
                  />
                </Col>
                <Col
                  style={{ marginTop: "-6px", marginBottom: "-10px" }}
                  xs={{ span: 4 }}
                  md={{ span: 2, offset: 4 }}
                  lg={{ span: 2, offset: 6 }}
                >
                  {d.editIcon && onClickEdit && (
                    <Tooltip
                      text={
                        d.label === "Email" ||
                        d.label === "Two Factor Authentication"
                          ? "Please contact Orbital support"
                          : ""
                      }
                    >
                      <Button
                        type="tertiary"
                        loading={false}
                        disabled={false}
                        icon={{
                          name: "pen",
                          position: "left"
                        }}
                        onClick={() => onClickEdit(d)}
                      />
                    </Tooltip>
                  )}
                </Col>
              </Row>
              {contentData?.slice(-1)[0]?.label !== d?.label && (
                <Divider type="horizontal" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccountSettings;
