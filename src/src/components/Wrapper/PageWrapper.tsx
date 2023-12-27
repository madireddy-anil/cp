import React from "react";
import { Colors } from "@payconstruct/design-system";

const PageWrapper: React.FC = ({ children }) => {
  return (
    <main
      style={{
        padding: "40px 100px 30px",
        margin: 0,
        overflowY: "auto",
        background: Colors.grey.neutral50
      }}
    >
      {children}
    </main>
  );
};

export default PageWrapper;
