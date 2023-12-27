import React from "react";
import { FallbackProps } from "react-error-boundary";
import { Button } from "@payconstruct/design-system";
import { Result } from "antd";

const ErrorFallback: React.FC<FallbackProps> = ({ resetErrorBoundary }) => {
  return (
    <Result
      style={{ height: "calc(100vh - 56px" }}
      status={"500"}
      title={"500"}
      subTitle={"Sorry, something went wrong."}
      extra={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Button
            type="primary"
            onClick={resetErrorBoundary}
            label={"Try again"}
          />
        </div>
      }
    />
  );
};

const ErrorHandler = (error: Error, info: { componentStack: string }) => {
  // Do something with the error
  // E.g. log to an error logging client here
  console.log("error", error);
  console.log("Information", info);
};

export { ErrorHandler, ErrorFallback };
