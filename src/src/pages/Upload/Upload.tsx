import React, { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/store";
import {
  openUploadModal,
  selectShow,
  closeUploadModal
} from "../../config/upload/uploadSlice";
import PopupContent from "./Components/PopupWrapper";
import { flags } from "../../config/variables";
import upload from "./Images/upload.svg";
import downArrow from "./Images/downArrow.svg";

import "./upload.css";
import { useFlags } from "launchdarkly-react-client-sdk";
import { AuthContext } from "@payconstruct/orbital-auth-provider";

const Upload: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const show = useAppSelector(selectShow);
  const { token } = useContext(AuthContext);

  const LDFlags = useFlags();

  useEffect(() => {
    token && dispatch(closeUploadModal());
  }, [token, dispatch]);

  const handleOpenChat = () => {
    if (show) dispatch(closeUploadModal());
    if (!show) dispatch(openUploadModal());
  };

  return (
    <>
      {children}
      {LDFlags[flags.showUploadFiles] && (
        <div className="upload-popup">
          {show && (
            <div className={"upload_room"}>
              <PopupContent />
            </div>
          )}
          <div className="upload_popup-button">
            {/* <Button
            onClick={handleOpenChat}
            type="primary"
            icon={{ name: !show ? "chat" : "dropdown" }}
            size="large"
          /> */}
            <img
              src={!show ? upload : downArrow}
              alt="upload"
              onClick={handleOpenChat}
              height="56"
              width="56"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Upload;
