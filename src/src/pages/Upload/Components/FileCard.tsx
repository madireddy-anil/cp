import React, { useState } from "react";
import {
  Text,
  Row,
  Col,
  Icon,
  Colors,
  Tooltip,
  Spin
} from "@payconstruct/design-system";
import { Files } from "../Upload.interface";
import { formatDateAndTime } from "../../../config/transformer";
import { useAppSelector } from "../../../redux/hooks/store";
import { selectTimezone } from "../../../config/general/generalSlice";
import { selectUploadLoading } from "../../../config/upload/uploadSlice";
import "../upload.css";

interface FileCard {
  files: Files[];
  onDelete: (v: any) => void;
  onDownload: (v: any) => void;
  onPreview: (v: any) => void;
}

const File: React.FC<FileCard> = ({
  files = [],
  onDelete,
  onDownload,
  onPreview
}) => {
  const timeZone: string = useAppSelector(selectTimezone);
  const loading = useAppSelector(selectUploadLoading);
  const [Empty] = useState<string>("--");

  return (
    <>
      <Spin loading={loading}>
        {files?.length > 0 ? (
          files.map((file: Files) => {
            return (
              <div key={file.fileName}>
                <Row className="file_wrapper">
                  <Col span={5} className="file_key">
                    File name
                  </Col>
                  <Col span={19} className="file_value-link">
                    {file?.friendlyName}
                  </Col>

                  <Col span={5} className="file_key">
                    Date
                  </Col>
                  <Col span={19} className="file_value">
                    {formatDateAndTime(file?.uploadedAt, timeZone) ?? Empty}
                  </Col>

                  <Col span={5} className="file_key">
                    User
                  </Col>
                  <Col span={19} className="file_value-last">
                    {file?.uploadedBy ?? Empty}
                  </Col>
                </Row>
                <Row>
                  <Col className="file_cardIcons-wrapper" span={5} offset={19}>
                    <Tooltip text="Preview">
                      <Icon
                        // size="extraLarge"
                        name="eyeOpened"
                        color={Colors.grey.neutral300}
                        onClick={() => onPreview(file)}
                      />
                    </Tooltip>
                    <Tooltip text="Download">
                      <Icon
                        name="download"
                        color={Colors.grey.neutral300}
                        onClick={() => onDownload(file)}
                      />
                    </Tooltip>
                    <Tooltip text="Delete">
                      <Icon
                        name="delete"
                        color={Colors.grey.neutral300}
                        onClick={() => onDelete(file)}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: "center" }}>
            <Text color="#BBBBBC">No files found</Text>
          </div>
        )}
      </Spin>
    </>
  );
};

export default File;
