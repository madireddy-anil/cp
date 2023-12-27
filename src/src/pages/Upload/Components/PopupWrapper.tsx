import React from "react";
import Title from "./Title";
import Tabs from "./Tabs";

import "../upload.css";

const PopupContent: React.FC = () => {
  return (
    <div className={"upload_popup-wrapper"}>
      <Title />
      <div className="upload_popup-content">
        <Tabs />
      </div>
    </div>
  );
};

export default PopupContent;
