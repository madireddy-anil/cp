import { UploadFile } from "antd/es/upload/interface";

export interface APIReq {
  fileId: string;
}
export interface PresignedURLRequest {
  fileName: string;
  uid?: string;
}

export interface PresignedURLResponse {
  url: string;
  fileName?: string;
  uid?: string;
}

export interface FileUploadRequest {
  fileType: string | undefined;
  file: UploadFile;
}

export type UploadFileRequest = {
  presignedUrlReq: PresignedURLRequest;
  fileUploadReq: FileUploadRequest;
};

export interface Files {
  uid: string;
  id: string;
  clientId: string;
  userId: string;
  fileName: string;
  friendlyName: string;
  clientName: string;
  filePath: string;
  type?: string;
  percent?: number;
  status?: string;
  uploadedAt: string;
  uploadedBy: string;
}
