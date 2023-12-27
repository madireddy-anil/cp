import React from "react";
// import { FallbackProps } from "react-error-boundary";
import { Button } from "@payconstruct/design-system";
import { Result } from "antd";
import { useNavigate } from "react-router-dom";

const ServiceNotAvailable: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Result
      style={{ height: "calc(100vh - 56px" }}
      status={"500"}
      title={"Not available"}
      subTitle={"The service is not available at the moment."}
      extra={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Button
            type="secondary"
            onClick={() => navigate("/")}
            label={"Go back to the home page"}
            style={{ marginRight: "30px" }}
          />

          <Button
            type="primary"
            onClick={() => {
              navigate(0);
            }}
            label={"Try again"}
          />
        </div>
      }
    />
  );
};

export { ServiceNotAvailable };
