import React from "react";
import { Icon, Text } from "@payconstruct/design-system";

interface StatusProps {
  level: string;
}

const StatusIcon: React.FC<StatusProps> = ({ level }) => {
  let statusI: any = level === "active" ? "checkCircle" : "fallColored";

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Icon name={statusI} size="small" />
      <Text size="small">{level}</Text>
    </div>
  );
};

export default StatusIcon;
