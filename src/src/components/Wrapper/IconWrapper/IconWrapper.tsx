import React from "react";
import { Icon, IconProps, Tooltip } from "@payconstruct/design-system";
import "./IconWrapper.css";

interface IconWrapperProps {
  icon: IconProps["name"];
  tooltip?: React.ReactNode;
  onClick?: () => void;
}

const IconWrapper: React.FC<IconWrapperProps> = ({
  icon,
  tooltip,
  onClick
}) => {
  return (
    <div className="icon-wrapper">
      <Tooltip text={tooltip}>
        <Icon name={icon} onClick={onClick} />
      </Tooltip>
    </div>
  );
};

export { IconWrapper as default };
