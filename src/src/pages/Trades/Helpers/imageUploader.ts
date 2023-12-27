import { financeApiUrl } from "../../../config/variables";
import { Upload as AntUpload } from "antd";
import { UploadChangeParam, RcFile } from "antd/lib/upload/interface";
import { stringify } from "query-string";
import { Notification } from "@payconstruct/design-system";
import { OrderDepositDetails } from "../../../services/ExoticFX/Finance/financeService";

//* Still need improvement
export const handleUploadFiles = async (
  info: UploadChangeParam,
  deposit: OrderDepositDetails,
  token: string | null,
  setLoading: (loading: boolean) => void,
  setDocuments: (documents: string[]) => void
) => {
  const { file, fileList } = info;
  const { status, name, originFileObj } = file;
  const { orderId, vendorId, accountId } = deposit;

  // Add or remove file from list object
  setDocuments(fileList.map((file) => file.name));

  if (status !== "removed" && status !== "uploading") {
    const url = {
      orderId,
      vendorId,
      accountId,
      fileName: name,
      type: "deposit"
    };

    setLoading(true);

    const res = await getPresignedUrl(stringify(url), token);

    //! Trusting the response from the server to have filePreSignedData
    await uploadImage(originFileObj, res.filePreSignedData);

    setLoading(false);
  }
};

export const checkFileType = (file: RcFile) => {
  const supportedTypes = ["png", "jpg", "jpeg", "pdf"];
  const { type } = file;
  if (!supportedTypes.includes(type.split("/")[1])) {
    Notification({
      message: "Unsupported file type",
      description: "Please upload a valid file type (png, jpg, jpeg, pdf)",
      type: "error"
    });
    return AntUpload.LIST_IGNORE;
  }
  return true;
};

export const getPresignedUrl = async (url: string, token: string | null) => {
  const requestOptions = {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`
    }
  };
  try {
    const res = await fetch(
      `${financeApiUrl}/getPreSignedUrl?${url}`,
      requestOptions
    );
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export const generatePresignedDownload = async (url: string, token: any) => {
  const requestOptions = {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`
    }
  };
  try {
    const res: any = await fetch(
      `${financeApiUrl}/getPreSignedURLForDownload?${url}`,
      requestOptions
    );
    const result = await res.json();
    return result?.filePreSignedDownloadData;
    // window.open(result?.filePreSignedDownloadData, "_newtab");
  } catch (error) {
    console.log(error);
  }
};

export const uploadImage = async (file: any, url: string) => {
  const fd = new FormData();
  fd.append("file", file);
  const requestOptions = {
    method: "PUT",
    body: file
  };
  try {
    const res = await fetch(url, requestOptions);
    return await res;
  } catch (error) {
    console.log(error);
  }
};

// @ts-ignore
export const dummyRequest = ({ onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};
