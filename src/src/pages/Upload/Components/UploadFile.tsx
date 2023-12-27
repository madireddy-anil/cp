import { useEffect, useState } from "react";
import {
  // Button,
  Colors,
  Notification,
  Upload as UploadDragger,
  Upload as UploadList,
  UploadProps
} from "@payconstruct/design-system";
// import { Upload as UplaodButton } from "antd";
import {
  createPresignedURL,
  deleteFile,
  downloadFile,
  previewFile
} from "../../../services/Upload/actions";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/store";
import actions from "../../../services/Upload/actions";
import {
  selectCurrentUplodedFile,
  selectRecentFileDeletedIds,
  selectUploadFileActions,
  selectUploadLoading
} from "../../../config/upload/uploadSlice";
import { Files } from "../Upload.interface";

import "../upload.css";

enum FileStatus {
  Uploading = "uploading",
  Error = "error",
  Done = "done",
  Remove = "removed"
}

const SupportedFileTypes = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "application/pdf",
  "jpg",
  "jpeg",
  "png",
  "pdf",
  "xls",
  "xlsx",
  "text/csv",
  "image/svg+xml",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const UploadFileHandler = () => {
  const dispatch = useAppDispatch();

  const fileActionType = useAppSelector(selectUploadFileActions);
  const loading = useAppSelector(selectUploadLoading);
  const currentUploadedFile = useAppSelector(selectCurrentUplodedFile);
  const recentFileDeletedIds = useAppSelector(selectRecentFileDeletedIds);

  const [fileId, setFileId] = useState<string>("");
  const [stateFileList, setFileList] = useState<Files[]>([]);

  useEffect(() => {
    if (fileActionType) {
      fileStatusTracker(fileActionType);
    }
    // eslint-disable-next-line
  }, [fileActionType]);

  useEffect(() => {
    if (currentUploadedFile) {
      updateFileName();
    }
    // eslint-disable-next-line
  }, [currentUploadedFile]);

  useEffect(() => {
    if (recentFileDeletedIds?.length) {
      validateWithRecentDeletedFiles();
    }
    // eslint-disable-next-line
  }, [recentFileDeletedIds]);

  const fileStatusTracker = (fileActionType: string[]) => {
    stateFileList.forEach((fileItem: Files) => {
      if (fileId === fileItem.uid) {
        if (fileActionType.includes(actions.CREATE_PRESIGNED_URL_FAILURE)) {
          fileItem.status = FileStatus.Error;
        }
        if (fileActionType.includes(actions.UPLOAD_FILE_FAILURE)) {
          fileItem.status = FileStatus.Error;
        }
        if (fileActionType.includes(actions.CREATE_PRESIGNED_URL)) {
          fileItem.percent = 30;
          fileItem.status = FileStatus.Uploading;
        }
        if (fileActionType.includes(actions.CREATE_PRESIGNED_URL_SUCCESS)) {
          fileItem.percent = 60;
          fileItem.status = FileStatus.Uploading;
        }
        if (fileActionType.includes(actions.UPLOAD_FILE)) {
          fileItem.percent = 100;
          fileItem.status = FileStatus.Done;
        }
        if (fileActionType.includes(actions.UPLOAD_FILE_SUCCESS)) {
          fileItem.percent = 100;
          fileItem.status = FileStatus.Done;
        }
      }
    });
    setFileList(stateFileList);
    return stateFileList;
  };

  const updateFileName = () => {
    stateFileList.forEach((fileItem: Files) => {
      if (currentUploadedFile.uid === fileItem.uid) {
        fileItem.fileName = currentUploadedFile?.fileName;
      }
    });
    setFileList(stateFileList);
    return stateFileList;
  };

  const validateWithRecentDeletedFiles = () => {
    const validateDeletedFiles = stateFileList?.filter(
      (fileItem: Files) => !recentFileDeletedIds.includes(fileItem.uid)
    );
    setFileList(validateDeletedFiles);
    return validateDeletedFiles;
  };

  const handleChange: UploadProps["onChange"] = (fileItem) => {
    const { file } = fileItem;

    if (file.type && SupportedFileTypes.includes(file.type)) {
      setFileId(file?.uid);
      setFileList((prev: any) => [...prev, file]);
    }

    const presignedUrlReq = {
      fileName: file.name,
      uid: file.uid
    };
    const fileUploadReq = {
      fileType: file?.type,
      file: file,
      fileList: fileItem.fileList
    };

    if (
      (file.status !== FileStatus.Error &&
        file?.status !== FileStatus.Remove &&
        file.status === FileStatus.Done) ||
      file.status === undefined
    ) {
      dispatch(createPresignedURL({ presignedUrlReq, fileUploadReq }));
    }
  };

  const handleOnRemove: UploadProps["onChange"] = (fileItem) => {
    const { file } = fileItem;
    if (file?.fileName && file.status === FileStatus.Remove) {
      dispatch(deleteFile({ fileId: file?.uid }));
      const removeFileInState = stateFileList.filter(
        (fileItem: { uid: string }) => fileItem.uid !== file.uid
      );
      setFileList(removeFileInState);
    }
  };

  return (
    <>
      <div className={"custom-upload--wrapper"}>
        <UploadDragger
          listSize={"standard"}
          listType={"text"}
          disabled={loading}
          isDownloadEnabled={true}
          onChange={(e) => handleChange(e)}
          beforeUpload={(file) => {
            if (SupportedFileTypes.includes(file.type)) {
              return false;
            } else {
              Notification({
                type: "warning",
                message: "Unsupported file format",
                description: "supported formats: png, jpg, xls, xlsx and pdf"
              });
              return true;
            }
          }}
        >
          <p>
            Drag-n-drop here or{" "}
            <b style={{ color: Colors.blue.blue900 }}>Upload file</b> from your
            PC
          </p>
        </UploadDragger>
      </div>

      {/* <Spin loading={loading}> */}
      {stateFileList?.map((fileD: Files) => {
        return (
          <div className={"custom-uploadlist--wrapper"}>
            <UploadList
              key={fileD?.friendlyName}
              name={"file"}
              listSize={"standard"}
              listType={"text"}
              disabled={loading}
              defaultFileList={[fileD]}
              // @ts-ignore
              // isDownloadEnabled
              onChange={handleOnRemove}
              onDownload={() =>
                dispatch(
                  downloadFile({
                    fileId: fileD.uid
                  })
                )
              }
              showUploadList={{
                showPreviewIcon: false,
                showDownloadIcon: true,
                showRemoveIcon: true
              }}
              onPreview={() =>
                dispatch(
                  previewFile({
                    fileId: fileD.uid
                  })
                )
              }
            ></UploadList>
          </div>
        );
      })}
      {/* </Spin> */}
      {/* 
      {stateFileList?.length > 0 && (
        <div className="upload_file-btn">
          <div className={"custom-uploadbtn--wrapper"}>
            <UplaodButton
              listType={"text"}
              disabled={loading}
              onChange={(e) => handleChange(e)}
              beforeUpload={(file) => {
                if (SupportedFileTypes.includes(file.type)) {
                  return false;
                } else {
                  Notification({
                    type: "warning",
                    message: "Unsupported file",
                    description:
                      "supported formats: csv, docx, jpg, png, xls, xlsx and pdf"
                  });
                  return true;
                }
              }}
            >
              <Button disabled={loading} type="primary" label="Upload Files" />
            </UplaodButton>
          </div>
        </div>
      )} */}
    </>
  );
};

export default UploadFileHandler;
