import React from "react";
import { Spin } from "@payconstruct/design-system";

export const Spinner: React.FC = () => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Spin />
    </div>
  );
};
