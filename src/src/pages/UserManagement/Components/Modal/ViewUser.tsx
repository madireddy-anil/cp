import React, { useState } from "react";
import { Row, Col, Modal, Text, Spin } from "@payconstruct/design-system";
import { useAppSelector } from "../../../../redux/hooks/store";
import { useGetUserByIdQuery } from "../../../../services/userService";

import { formatDate, capitalizeString } from "../../../../config/transformer";
import { selectTimezone } from "../../../../config/general/generalSlice";

interface ViewUserModalProps {
  show: boolean;
  userId: string;
  handleCloseViewModal: () => void;
}

const ViewUser: React.FC<ViewUserModalProps> = ({
  show,
  userId,
  handleCloseViewModal
}) => {
  const timeZone: string = useAppSelector(selectTimezone);
  /* Global State */
  const { isUserEditLoading } = useAppSelector((state) => state.userManagement);
  const [noData] = useState<string>("--");
  const { userDetails, isUsersLoading } = useGetUserByIdQuery(
    { id: userId },
    {
      refetchOnMountOrArgChange: true,
      skip: userId === undefined,
      selectFromResult: ({ data, isLoading }) => ({
        userDetails: data?.data,
        isUsersLoading: isLoading
      })
    }
  );

  const userRecord = {
    "User Name": `${userDetails?.firstName ? userDetails?.firstName : noData} ${
      userDetails?.lastName ? userDetails?.lastName : noData
    }`,
    "Email Address": userDetails?.email ? userDetails?.email : noData,
    Role: userDetails?.role ? capitalizeString(userDetails?.role) : "",
    "Last login": formatDate(userDetails?.lastLogin, timeZone),
    "User added by": userDetails?.createdBy,
    "User added on": formatDate(userDetails?.createdAt, timeZone)
  };

  return (
    <Modal
      modalView={show}
      modalWidth={550}
      title={"User Details"}
      onOkText={"Close"}
      onClickOk={() => handleCloseViewModal()}
      description={
        <Spin loading={isUsersLoading}>
          <Row>
            {Object.entries(userRecord)?.length &&
              Object.entries(userRecord).map(([key, value]) => {
                return (
                  <Col key={key} style={{ marginBottom: "10px" }} span={12}>
                    <Text size="xxsmall" label={key} />
                    <br />
                    <Text size="small" color="#000000" label={value} />
                  </Col>
                );
              })}
          </Row>
        </Spin>
      }
      btnLoading={isUserEditLoading}
    />
  );
};

export { ViewUser };
