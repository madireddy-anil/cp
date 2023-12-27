import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userLogoutAction } from "../general/actions";
import actions from "../../services/Upload/actions";
import { RootState } from "../../redux/store";
import {
  UploadFileRequest,
  PresignedURLResponse,
  Files
} from "../../pages/Upload/Upload.interface";

type SliceState = {
  loading: boolean;
  show: boolean;
  currentUploadedFile: PresignedURLResponse;
  fileActionType: string[];
  filesHistory: Files[];
  recentDeletedFileIds: string[];
};

const initialState: SliceState = {
  show: false,
  loading: false,
  currentUploadedFile: {
    url: "",
    uid: "",
    fileName: ""
  },
  fileActionType: [],
  filesHistory: [],
  recentDeletedFileIds: []
};

const uploadSlice = createSlice({
  name: "upload",
  initialState: initialState,
  reducers: {
    openUploadModal: (state) => {
      return {
        ...state,
        show: true,
        fileActionType: []
      };
    },
    closeUploadModal: (state) => {
      return {
        ...state,
        show: false,

        // reset on close file upload modal
        fileActionType: [],
        recentDeletedFileIds: [],
        currentUploadedFile: state.currentUploadedFile
      };
    },
    resetFileActions: (state) => {
      return {
        ...state,
        fileActionType: []
      };
    },
    updateDeleteFileId: (state, action: { payload: string }) => {
      return {
        ...state,
        recentDeletedFileIds: [...state.recentDeletedFileIds, action.payload]
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogoutAction, () => {
        return initialState;
      })
      .addCase(
        actions.CREATE_PRESIGNED_URL,
        (state: SliceState, action: PayloadAction<UploadFileRequest>) => {
          state.fileActionType = [action.type];
          state.loading = true;
        }
      )
      .addCase(
        actions.CREATE_PRESIGNED_URL_SUCCESS,
        (state: SliceState, action: PayloadAction<PresignedURLResponse>) => {
          state.fileActionType = [action.type];
          state.currentUploadedFile = action.payload;
        }
      )
      .addCase(
        actions.CREATE_PRESIGNED_URL_FAILURE,
        (state: SliceState, action: PayloadAction<UploadFileRequest>) => {
          state.fileActionType = [action.type];
          state.loading = false;
        }
      )
      .addCase(
        actions.UPLOAD_FILE,
        (state: SliceState, action: PayloadAction<PresignedURLResponse>) => {
          state.fileActionType = [action.type];
        }
      )
      .addCase(
        actions.UPLOAD_FILE_SUCCESS,
        (state: SliceState, action: PayloadAction<UploadFileRequest>) => {
          state.fileActionType = [action.type];
          state.loading = false;
        }
      )
      .addCase(
        actions.UPLOAD_FILE_FAILURE,
        (state: SliceState, action: PayloadAction<UploadFileRequest>) => {
          state.fileActionType = [action.type];
          state.loading = false;
        }
      )

      // get files ---
      .addCase(actions.GET_FILES, (state: SliceState) => {
        state.loading = true;
      })
      .addCase(
        actions.GET_FILES_SUCCESS,
        (state: SliceState, action: PayloadAction<Files[]>) => {
          state.filesHistory = action.payload;
          state.loading = false;
        }
      )
      .addCase(actions.GET_FILES_FAILURE, (state: SliceState) => {
        state.loading = false;
      })

      // delete file
      .addCase(actions.DELETE_FILE, (state: SliceState) => {
        state.loading = true;
      })
      .addCase(actions.DELETE_FILE_SUCCESS, (state: SliceState) => {
        state.loading = false;
      })
      .addCase(actions.DELETE_FILE_FAILURE, (state: SliceState) => {
        state.loading = false;
      })

      // preview file
      .addCase(actions.PREVIEW_FILE, (state: SliceState) => {
        state.loading = true;
      })
      .addCase(actions.PREVIEW_FILE_SUCCESS, (state: SliceState) => {
        state.loading = false;
      })
      .addCase(actions.PREVIEW_FILE_FAILURE, (state: SliceState) => {
        state.loading = false;
      });
  }
});

export const { openUploadModal, closeUploadModal, updateDeleteFileId } =
  uploadSlice.actions;

export const selectShow = (state: RootState) => state.upload.show;
export const selectUploadFileActions = (state: RootState) =>
  state.upload.fileActionType;
export const selectUploadLoading = (state: RootState) => state.upload.loading;
export const selectFilesHistory = (state: RootState) =>
  state.upload.filesHistory;
export const selectCurrentUplodedFile = (state: RootState) =>
  state.upload.currentUploadedFile;
export const selectRecentFileDeletedIds = (state: RootState) =>
  state.upload.recentDeletedFileIds;

export default uploadSlice.reducer;
