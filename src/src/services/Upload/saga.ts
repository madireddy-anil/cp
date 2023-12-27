import { all, takeLatest, put, call, select } from "redux-saga/effects";
import axiosMethod from "../../utilities/apiCaller";
import actions from "./actions";
import {
  Files,
  UploadFileRequest,
  PresignedURLRequest,
  PresignedURLResponse,
  APIReq
} from "../../pages/Upload/Upload.interface";
import {
  fileDownloader,
  filePreview as vewFile
} from "../../config/transformer";
import { Notification } from "@payconstruct/design-system";

const {
  uploadPrivatePost,
  uploadPrivatePut,
  uploadPrivateGet,
  uploadPrivateDelete
} = axiosMethod;

const createPresignedURL = (token: string, data: PresignedURLRequest) => {
  const api = {
    endpoint: `signed-url`,
    token: token
  };

  return uploadPrivatePost(api, data).then(
    (response: { data: PresignedURLResponse }) => {
      return response.data;
    }
  );
};

export function* presignedURL(file: {
  type: string;
  payload: UploadFileRequest;
}) {
  const { presignedUrlReq, fileUploadReq } = file.payload;
  try {
    const token: string = yield select((state: any) => state.auth.token);
    const response: PresignedURLResponse = yield call(
      createPresignedURL,
      token,
      presignedUrlReq
    );

    // const formatFilesList: any = formatFilesList(fileUploadReq);
    yield put({
      type: actions.CREATE_PRESIGNED_URL_SUCCESS,
      payload: {
        ...response,
        uid: response?.uid ? response?.uid : presignedUrlReq.uid
      }
    });
    yield put({
      type: actions.UPLOAD_FILE,
      payload: {
        url: response?.url,
        file: fileUploadReq
      }
    });
  } catch (err) {
    yield put({
      type: actions.CREATE_PRESIGNED_URL_FAILURE,
      payload: JSON.stringify(err)
    });
    Notification({
      type: "error",
      message: "There was an error in uploading your files",
      description:
        "We apologise for the inconvenience. Please get in touch with your customer service representative."
    });
  }
}

const upload = (url: string, data: UploadFileRequest) => {
  const { file }: any = data;
  const api = {
    endpoint: url,
    fileType: file.type,
    token: ""
  };

  return uploadPrivatePut(api, file).then((response: any) => {
    return response;
  });
};

export function* uploadFile(data: { type: string; payload: any }) {
  const { url, file } = data.payload;
  try {
    yield call(upload, url, file);
    yield put({
      type: actions.UPLOAD_FILE_SUCCESS,
      payload: file
    });
    Notification({
      type: "success",
      message: "Your file has been uploaded successfully",
      description: "To view previous uploads, please go to the history tab."
    });
  } catch (err) {
    yield put({
      type: actions.UPLOAD_FILE_FAILURE,
      payload: JSON.stringify(err)
    });
  }
}

const getAllFiles = (token: string) => {
  const api = {
    endpoint: `files`,
    token: token
  };

  return uploadPrivateGet(api).then((response: { data: { data: Files[] } }) => {
    return response?.data?.data;
  });
};

export function* getFiles() {
  try {
    const token: string = yield select((state: any) => state.auth.token);
    const filesResp: Files[] = yield call(getAllFiles, token);
    yield put({
      type: actions.GET_FILES_SUCCESS,
      payload: filesResp
    });
  } catch (err) {
    yield put({
      type: actions.GET_FILES_FAILURE,
      payload: JSON.stringify(err)
    });
  }
}

const fileDelete = (token: string, fileId: string) => {
  const api = {
    endpoint: `files/${fileId}`,
    token: token
  };

  return uploadPrivateDelete(api).then((response: any) => {
    return response;
  });
};

export function* deleteFile(data: { type: string; payload: APIReq }) {
  const { fileId } = data.payload;
  try {
    const token: string = yield select((state: any) => state.auth.token);
    yield call(fileDelete, token, fileId);
    yield put({
      type: actions.DELETE_FILE_SUCCESS,
      payload: fileId
    });
    yield put({
      type: actions.GET_FILES
    });
    Notification({
      type: "success",
      message: "Your file has been deleted successfully"
    });
  } catch (err) {
    yield put({
      type: actions.DELETE_FILE_FAILURE,
      payload: JSON.stringify(err)
    });
    Notification({
      type: "error",
      message: "There was an error in deleting your files",
      description:
        "We apologise for the inconvenience. Please get in touch with your customer service representative."
    });
  }
}

const fileDownload = (token: string, fileId: string) => {
  const api = {
    endpoint: `signed-url/${fileId}?isDownload=true`,
    token: token
  };

  return uploadPrivateGet(api).then(
    (response: { data: PresignedURLResponse }) => {
      return response.data;
    }
  );
};

export function* downloadFile(data: { type: string; payload: APIReq }) {
  const { fileId } = data.payload;
  try {
    const token: string = yield select((state: any) => state.auth.token);
    const response: { url: string } = yield call(fileDownload, token, fileId);
    fileDownloader(response.url, fileId, "type");
    yield put({
      type: actions.DOWNLOAD_FILE_SUCCESS
    });
  } catch (err) {
    yield put({
      type: actions.DOWNLOAD_FILE_FAILURE,
      payload: JSON.stringify(err)
    });
    Notification({
      type: "error",
      message: "There was an error in downloading your files",
      description:
        "We apologise for the inconvenience. Please get in touch with your customer service representative."
    });
  }
}

const filePreview = (token: string, fileId: string) => {
  const api = {
    endpoint: `signed-url/${fileId}?isDownload=false`,
    token: token
  };

  return uploadPrivateGet(api).then(
    (response: { data: PresignedURLResponse }) => {
      return response.data;
    }
  );
};

export function* previewFile(data: { type: string; payload: APIReq }) {
  const { fileId } = data.payload;
  try {
    const token: string = yield select((state: any) => state.auth.token);
    const response: { url: string } = yield call(filePreview, token, fileId);
    vewFile(response.url, fileId, "type");
    yield put({
      type: actions.PREVIEW_FILE_SUCCESS
    });
  } catch (err) {
    yield put({
      type: actions.PREVIEW_FILE_FAILURE,
      payload: JSON.stringify(err)
    });
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.CREATE_PRESIGNED_URL, presignedURL),
    takeLatest(actions.UPLOAD_FILE, uploadFile),
    takeLatest(actions.GET_FILES, getFiles),
    takeLatest(actions.DELETE_FILE, deleteFile),
    takeLatest(actions.DOWNLOAD_FILE, downloadFile),
    takeLatest(actions.PREVIEW_FILE, previewFile)
  ]);
}
