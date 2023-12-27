import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Tab } from "@payconstruct/design-system";
import UploadFileHandler from "./UploadFile";
import UploadHistory from "./UploadHistory";
import { getFiles } from "../../../services/Upload/actions";
import "../upload.css";

const Tabs = () => {
  const dispatch = useDispatch();

  const onChangeTabs = (tab: string) => {
    if (tab === "files_history") {
      dispatch(getFiles());
    }
  };

  const tabsContent = useMemo(() => {
    const tabs: any = [
      {
        key: "file_upload",
        title: (
          <div style={{ width: "200px", paddingLeft: "75px" }}>Upload</div>
        ),
        content: (
          <div className="tab_container">
            <UploadFileHandler />
          </div>
        )
      },
      {
        key: "files_history",
        title: (
          <div style={{ width: "200px", paddingLeft: "75px" }}>History</div>
        ),
        content: (
          <div className="tab_container">
            <UploadHistory />
          </div>
        )
      }
    ];

    return tabs;
  }, []);

  return (
    <Tab
      defaultActiveKey="1"
      tabbarstyle={{ backgroundColor: "#fff" }}
      initialpanes={tabsContent}
      onChange={onChangeTabs}
      size="middle"
      tabposition="top"
      type="line"
    />
  );
};

export default Tabs;
