import {
  UploadFileRequest,
  PresignedURLResponse,
  APIReq
} from "../../pages/Upload/Upload.interface";

const actions = {
  CREATE_PRESIGNED_URL: "CREATE_PRESIGNED_URL",
  CREATE_PRESIGNED_URL_SUCCESS: "CREATE_PRESIGNED_URL_SUCCESS",
  CREATE_PRESIGNED_URL_FAILURE: "CREATE_PRESIGNED_URL_FAILURE",

  UPLOAD_FILE: "UPLOAD_FILE",
  UPLOAD_FILE_SUCCESS: "UPLOAD_FILE_SUCCESS",
  UPLOAD_FILE_FAILURE: "UPLOAD_FILE_FAILURE",

  GET_FILES: "GET_FILES",
  GET_FILES_SUCCESS: "GET_FILES_SUCCESS",
  GET_FILES_FAILURE: "GET_FILES_FAILURE",

  DELETE_FILE: "DELETE_FILE",
  DELETE_FILE_SUCCESS: "DELETE_FILE_SUCCESS",
  DELETE_FILE_FAILURE: "DELETE_FILE_FAILURE",

  PREVIEW_FILE: "PREVIEW_FILE",
  PREVIEW_FILE_SUCCESS: "PREVIEW_FILE_SUCCESS",
  PREVIEW_FILE_FAILURE: "PREVIEW_FILE_FAILURE",

  DOWNLOAD_FILE: "DOWNLOAD_FILE",
  DOWNLOAD_FILE_SUCCESS: "DOWNLOAD_FILE_SUCCESS",
  DOWNLOAD_FILE_FAILURE: "DOWNLOAD_FILE_FAILURE"
};

export default actions;

export const createPresignedURL = (payload: UploadFileRequest) => {
  return {
    type: actions.CREATE_PRESIGNED_URL,
    payload
  };
};

export const uploadFile = (payload: PresignedURLResponse) => {
  return {
    type: actions.UPLOAD_FILE,
    payload
  };
};

export const getFiles = () => {
  return {
    type: actions.GET_FILES
  };
};

export const deleteFile = (payload: APIReq) => {
  return {
    type: actions.DELETE_FILE,
    payload
  };
};

export const previewFile = (payload: APIReq) => {
  return {
    type: actions.PREVIEW_FILE,
    payload
  };
};

export const downloadFile = (payload: APIReq) => {
  return {
    type: actions.DOWNLOAD_FILE,
    payload
  };
};
