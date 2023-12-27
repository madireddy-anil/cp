import React from "react";
import { Row, Col, Icon, Colors } from "@payconstruct/design-system";
import { useAppDispatch } from "../../../redux/hooks/store";
import { closeUploadModal } from "../../../config/upload/uploadSlice";

import "../upload.css";

const Title: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <div className={"upload_header-wrapper"}>
      <Row style={{ marginTop: "24px" }}>
        <Col span={16} offset={4}>
          <div className="upload_header-title">File upload</div>
        </Col>
        <Col span={4}>
          <div className="upload_heaer-icon">
            <Icon
              name={"close"}
              size="small"
              color={Colors.grey.neutral300}
              onClick={() => dispatch(closeUploadModal())}
            />
          </div>
        </Col>
      </Row>
      <div className="upload_header-subtitile">
        Use the upload function below to send files to our operations teams. To
        view previous uploads, please navigate to the history tab.
      </div>
    </div>
  );
};

export default Title;
