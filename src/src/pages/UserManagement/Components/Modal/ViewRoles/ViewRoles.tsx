import { Col, Modal, Row, Text } from "@payconstruct/design-system";
import { Spacer } from "../../../../../components/Spacer/Spacer";
import { UserRolesHeader, UserRole } from "../../../UserManagement.Interface";
import roleData from "./roles.json";
import style from "../../../style.module.css";

interface ViewRoleModalProps {
  show: boolean;
  title: string;
  onOkText: string;
  onClickOk: (data?: any) => void;
}
export const ViewRoleModal: React.FC<ViewRoleModalProps> = ({
  show,
  title,
  onClickOk,
  onOkText
}) => {
  return (
    <>
      <Modal
        modalView={show}
        modalWidth={620}
        title={title}
        onOkText={onOkText}
        onClickOk={onClickOk}
        description={
          <>
            <div className={style["role_subtitle"]}>
              <Text weight={"lighter"} size="small">
                Please read the description for each role below to understand
                the level of access or responsibility for each role.
              </Text>
            </div>
            <ViewRoleModalBody />
          </>
        }
      />
    </>
  );
};

const getBoldWords = (strWord: string, boldWords: string[]) => {
  boldWords.forEach((word: string) => {
    strWord = strWord?.replaceAll(
      new RegExp("(\\b" + word + "\\b)", "g"),
      (str = "$1") => `<strong>${str}</strong>`
    );
  });
  return <span dangerouslySetInnerHTML={{ __html: strWord }}></span>;
};

export const ViewRoleModalBody = () => {
  const heading: UserRolesHeader[] = [
    {
      key: "01",
      name: "Super Admin",
      description: getBoldWords(
        "Super Admins are the signatories of the entity. They have the highest level of access and authority on the platform. Super Admins cannot be added from the user management function on the platform.",
        ["can", "cannot"]
      )
    },
    {
      key: "02",
      name: "Admin",
      description: getBoldWords(
        "Admins are not signatories. They have the second highest level of access and authority on the platform. Admins can be added from the user management function on the platform by Super Admins only.",
        ["can", "cannot"]
      )
    },
    {
      key: "03",
      name: "Creator",
      description: getBoldWords(
        "Creators are not signatories. They have the third highest level of access and authority on the platform. Creators can be added from the user management function on the platform by Super Admins and Admins only.",
        ["can", "cannot"]
      )
    },
    {
      key: "04",
      name: "Viewer",
      description: getBoldWords(
        "Viewers are not signatories. They have the lowest level of access and authority on the platform. Viewers can be added from the user management function on the platform by Super Admins and Admins only.",
        ["can", "cannot"]
      )
    },
    {
      key: "05",
      name: "eCommerce Viewer",
      description: getBoldWords(
        "eCommerce viewers are only able to view eCommerce activity. eCommerce viewers can be added from the user management function on the platform by Super Admins and Admins only.",
        ["can", "cannot"]
      )
    }
  ];

  const getuserRoles: any = (key: string) => {
    switch (key) {
      case "01":
        return roleData.superadmin.map((data: any) => {
          return (
            <div key={data.label}>
              <Text size="small" weight={"bold"}>
                {data.label}
              </Text>
              <Row>
                <Col span={22}>
                  <ul>
                    {data.value.map((data: string, index: number) => {
                      return (
                        <li key={index}>
                          <span>{getBoldWords(data, ["can", "cannot"])}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <ul>
                    {data.label === "Transaction approval rule"
                      ? roleData.subLabel.map((item: UserRole) => {
                          return (
                            <li>
                              <Text size="small" weight={"bold"}>
                                {item.label}
                              </Text>
                              <ul>
                                {item.value.map((data: string) => {
                                  return (
                                    <li>
                                      <span>
                                        {getBoldWords(data, ["can", "cannot"])}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </li>
                          );
                        })
                      : ""}
                  </ul>
                </Col>
              </Row>
            </div>
          );
        });
      case "02":
        return roleData.admin.map((data: UserRole) => {
          return (
            <div key={data.label}>
              <Text size="small" weight={"bold"}>
                {data.label}{" "}
              </Text>
              <Row>
                <Col span={22}>
                  <ul>
                    {data.value.map((data: string, index: number) => {
                      return (
                        <li key={index}>
                          <span>{getBoldWords(data, ["can", "cannot"])}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <ul>
                    {data.label === "Transaction approval rule"
                      ? roleData.subLabel.map((item: UserRole) => {
                          return (
                            <li>
                              <Text size="small" weight={"bold"}>
                                {item.label}
                              </Text>
                              <ul>
                                {item.value.map((data: string) => {
                                  return (
                                    <li>
                                      <span>
                                        {getBoldWords(data, ["can", "cannot"])}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </li>
                          );
                        })
                      : ""}
                  </ul>
                </Col>
              </Row>
            </div>
          );
        });
      case "03":
        return roleData.creator.map((data: UserRole) => {
          return (
            <div key={data.label}>
              <Text size="small" weight={"bold"}>
                {data.label}
              </Text>
              <Row>
                <Col span={22}>
                  <ul>
                    {data.value.map((data: string, index: number) => {
                      return (
                        <li key={index}>
                          <span>{getBoldWords(data, ["can", "cannot"])}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <ul>
                    {data.label === "Transaction approval rule"
                      ? roleData.subLabel.map((item: UserRole) => {
                          return (
                            <li>
                              <Text size="small" weight={"bold"}>
                                {item.label}
                              </Text>
                              <ul>
                                {item.value.map((data: string) => {
                                  return (
                                    <li>
                                      <span>
                                        {getBoldWords(data, ["can", "cannot"])}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </li>
                          );
                        })
                      : ""}
                  </ul>
                </Col>
              </Row>
            </div>
          );
        });
      case "04":
        return roleData.viewer.map((data: UserRole) => {
          return (
            <div key={data.label}>
              <Text size="small" weight={"bold"}>
                {data.label}
              </Text>
              <Row>
                <Col span={22}>
                  <ul>
                    {data.value.map((data: string, index: number) => {
                      return (
                        <li key={index}>
                          <span>{getBoldWords(data, ["can", "cannot"])}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <ul>
                    {data.label === "Transaction approval rule"
                      ? roleData.subLabel.map((item: UserRole) => {
                          if (
                            item.label ===
                            "If not granted approver entitlement:"
                          ) {
                            return (
                              <li>
                                <Text size="small">
                                  {getBoldWords(item.label, ["can", "cannot"])}
                                </Text>
                                <ul>
                                  {[
                                    "They cannot view the payments approval queue",
                                    "They cannot approve or reject payments"
                                  ].map((data: string) => {
                                    return (
                                      <li>
                                        <span>
                                          {getBoldWords(data, [
                                            "can",
                                            "cannot"
                                          ])}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </li>
                            );
                          } else {
                            return (
                              <li>
                                <Text size="small" weight={"bold"}>
                                  {item.label}
                                </Text>
                                <ul>
                                  {item.value.map((data: string) => {
                                    return (
                                      <li>
                                        <span>
                                          {getBoldWords(data, [
                                            "can",
                                            "cannot"
                                          ])}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </li>
                            );
                          }
                        })
                      : ""}
                  </ul>
                </Col>
              </Row>
            </div>
          );
        });
      case "05":
        return roleData.eCommerceViewer.map((data: UserRole) => {
          return (
            <div key={data.label}>
              <Text size="small" weight={"bold"}>
                {data.label}
              </Text>
              <Row>
                <Col span={22}>
                  <ul>
                    {data.value.map((data: string, index: number) => {
                      return (
                        <li key={index}>
                          <span>{getBoldWords(data, ["can", "cannot"])}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <ul>
                    {data.label === "Transaction approval rule"
                      ? roleData.subLabel.map((item: UserRole) => {
                          if (
                            item.label === "If granted approver entitlement:"
                          ) {
                            return (
                              <li>
                                <Text size="small">
                                  {getBoldWords(
                                    "They cannot be granted approver entitlement, therefore:",
                                    ["can", "cannot"]
                                  )}
                                </Text>
                                <ul>
                                  {[
                                    "They cannot view the payments approval queue",
                                    "They cannot approve or reject payments"
                                  ].map((data: string) => {
                                    return (
                                      <li>
                                        <span>
                                          {getBoldWords(data, [
                                            "can",
                                            "cannot"
                                          ])}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </li>
                            );
                          }
                        })
                      : ""}
                  </ul>
                </Col>
              </Row>
            </div>
          );
        });
    }
  };
  return (
    <>
      <div style={{ display: "grid", height: "290px", overflowY: "scroll" }}>
        {heading.map((role: UserRolesHeader) => {
          return (
            <div key={role.key}>
              <Spacer size={5} />
              <Text weight={"bold"} size={"medium"}>
                {role.name}
              </Text>
              <Spacer size={5} />
              <Text weight={"regular"} size="small">
                {role.description}
              </Text>
              <Spacer size={15} />
              <Text weight={"regular"} size="small">
                List of platform access and authority:
              </Text>
              <Spacer size={5} />
              <Text size="small">{getuserRoles(role.key)}</Text>
            </div>
          );
        })}
      </div>
    </>
  );
};
