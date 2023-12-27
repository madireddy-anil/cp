import { useAppDispatch, useAppSelector } from "../../../redux/hooks/store";
import {
  selectFilesHistory,
  updateDeleteFileId
} from "../../../config/upload/uploadSlice";
import {
  deleteFile,
  downloadFile,
  previewFile
} from "../../../services/Upload/actions";
import FileCard from "./FileCard";
import { Files } from "../Upload.interface";
import "../upload.css";

const UploadHistory = () => {
  const dispatch = useAppDispatch();
  const filesHistory = useAppSelector(selectFilesHistory);

  const handleDeleteFile = (file: Files) => {
    dispatch(updateDeleteFileId(file.id));
    dispatch(deleteFile({ fileId: file.id }));
  };

  const handleDownLoadFile = (file: Files) => {
    dispatch(downloadFile({ fileId: file.id }));
  };

  const handlePreviewFile = (file: Files) => {
    dispatch(previewFile({ fileId: file.id }));
  };

  return (
    <FileCard
      files={filesHistory}
      onDelete={(v) => handleDeleteFile(v)}
      onDownload={(v) => handleDownLoadFile(v)}
      onPreview={(v) => handlePreviewFile(v)}
    />
  );
};

export default UploadHistory;
