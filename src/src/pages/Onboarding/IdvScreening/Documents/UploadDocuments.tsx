import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import {
  Colors,
  Text,
  Upload,
  Tooltip,
  Button
} from "@payconstruct/design-system";
import { store } from "../../../../redux/store";
import { Spacer } from "../../../../components/Spacer/Spacer";
import { useUpdateScreeningInfoMutation } from "../../../../services/gppService";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/store";
import {
  updateFrontPageOfScannedDoc,
  updateBackPageOfScannedDoc,
  updateFrontPageDocumenList,
  updateBackPageDocumenList
} from "../../../../config/idvScreening/idvScreeningSlice";
import { updateScreeningResponse } from "../../../../config/idvScreening/idvScreeningSlice";

import "../IdvScreening.css";

const UploadDocuments: React.FC = () => {
  const state = store.getState();
  const dispatch = useAppDispatch();
  let navigate = useNavigate();
  const userId = useAppSelector((state) => state.idvScreening.userId);
  const frontPageDocument = useAppSelector(
    (state) => state.idvScreening.frontPageDocument
  );
  const backPageDocument = useAppSelector(
    (state) => state.idvScreening.backPageDocument
  );
  const { onSubmitOwnerShipValues } = state.idvScreening;
  const documentType = onSubmitOwnerShipValues.documentType;

  const frontPageDocumenList = state.idvScreening.frontPageDocumenList;
  const backPageDocumentList = state.idvScreening.backPageDocumentList;

  const [isErrorInFile, setErrorInFile] = useState(false);

  const [updateScreeningData, { isLoading }] = useUpdateScreeningInfoMutation();

  const onSubmit = async () => {
    const userData: any =
      Object.entries(onSubmitOwnerShipValues)?.length > 0 &&
      onSubmitOwnerShipValues;
    const data: any = {
      request: {
        dateOfBirth: userData?.dateOfBirth,
        registeredAddress: {
          country: userData?.country,
          countryCode: userData?.countryCode,
          buildingNumber: userData?.buildingNumber,
          buildingName: userData?.buildingName,
          floor: userData?.floor,
          room: userData?.room,
          street: userData?.street,
          city: userData?.city,
          postCode: userData?.postCode,
          postBox: userData?.postBox ? userData.postBox : ""
        },
        documentIssuerCountry: userData?.documentIssuerCountry,
        documentIssuerState: userData?.documentIssuerState,
        documentType: documentType === "idCard" ? "id" : documentType,
        frontPageOfDocument: frontPageDocument,
        backPageOfDocument: backPageDocument,

        documentsSubmissionType: "manual"
      },
      userId
    };
    try {
      await updateScreeningData(data).unwrap();
    } catch (err) {
      dispatch(updateScreeningResponse(false));
    }
    navigate("/screening-response");
  };

  const onBack = () => {
    navigate(-1);
  };

  // cone
  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleChange = (info: any, docLabel: string) => {
    if (
      (info.file.status !== "error" && info.file.status === "done") ||
      info.file.status === undefined
    ) {
      getBase64(info.file, (imageUrl: any) =>
        docLabel === "front_page_document"
          ? dispatchDocuments(docLabel, imageUrl.split(",")[1])
          : dispatchDocuments(docLabel, imageUrl.split(",")[1])
      );
    }
    const selectedFiles: any[] = [];
    (info?.fileList || []).map((file: any) => {
      const formatedFiles: any = {};
      formatedFiles.name = file.name;
      formatedFiles.status = file.status;
      formatedFiles.type = file.type;
      formatedFiles.uid = file.uid;
      return selectedFiles.push(formatedFiles);
    });
    docLabel === "front_page_document" && info?.fileList?.length > 1
      ? dispatch(updateFrontPageDocumenList(selectedFiles))
      : dispatch(updateBackPageDocumenList(selectedFiles));
  };

  const handleRemove = (info: any, docLabel: string) => {
    if (docLabel === "front_page_document") {
      dispatch(updateFrontPageOfScannedDoc(""));
      dispatch(updateFrontPageDocumenList([]));
    } else {
      dispatch(updateBackPageOfScannedDoc(""));
      dispatch(updateBackPageDocumenList([]));
    }
  };

  const dispatchDocuments = (label: string, base64Img: string) => {
    if (label === "front_page_document") {
      dispatch(updateFrontPageOfScannedDoc(base64Img));
    } else {
      dispatch(updateBackPageOfScannedDoc(base64Img));
    }
  };

  const beforeUpload = (file: any) => {
    const fileVlidation =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg" ||
      file.type === "application/pdf" ||
      file.type === "jpeg" ||
      file.type === "jpg" ||
      file.type === "png" ||
      file.type === "pdf";
    if (!fileVlidation) {
      message.error("You can only upload JPG,JPEG,PNG and PDF file!");
      setErrorInFile(true);
      return true;
    } else {
      setErrorInFile(false);
      return false;
    }
  };

  // enable the submit button only this condition satisfy
  const isButtonEnabled: any =
    documentType === "passport"
      ? frontPageDocument && !isErrorInFile
        ? false
        : true
      : frontPageDocument && backPageDocument && !isErrorInFile
      ? false
      : true;

  return (
    <main>
      <div style={{ padding: "50px" }}>
        <div style={{ textAlign: "center" }}>
          <img
            src={process.env.PUBLIC_URL + "images/orbital-icon.png"}
            alt="Orbital"
            style={{ width: "10%", textAlign: "center" }}
          />
        </div>
        <Spacer size={20} />
        <div>
          <Text
            size="large"
            weight="bold"
            label="Please upload your ID Documents as follows..."
          />
        </div>
        <Spacer size={30} />
        <div>
          <Text
            size="medium"
            label="1. Upload a clear image of the front of your chosen ID document."
          />
        </div>
        <Spacer size={20} />

        <div className="upload__doc-wrapper">
          <Tooltip text="Maximum file size limit is 1">
            <Upload
              name={"file"}
              listSize={"standard"}
              listType={"text"}
              maxCount={1}
              defaultFileList={frontPageDocumenList}
              beforeUpload={(file) => beforeUpload(file)}
              onChange={(info) => handleChange(info, "front_page_document")}
              onRemove={(info) => handleRemove(info, "front_page_document")}
            >
              <p>
                Drag-n-drop here or{" "}
                <b style={{ color: Colors.blue.blue500 }}>Upload</b> file from
                your PC
              </p>
            </Upload>
          </Tooltip>
        </div>

        <Spacer size={40} />

        {documentType !== "passport" && (
          <>
            <div>
              <Text
                size="medium"
                label="2. Upload a clear image of the back of your chosen ID document."
              />
            </div>
            <Spacer size={20} />
            <div className="upload__doc-wrapper">
              <Tooltip text="Maximum file size limit is 1">
                <Upload
                  name={"file"}
                  listSize={"standard"}
                  listType={"text"}
                  maxCount={1}
                  defaultFileList={backPageDocumentList}
                  beforeUpload={(file) => beforeUpload(file)}
                  onChange={(info) => handleChange(info, "back_page_document")}
                  onRemove={(info) => handleRemove(info, "back_page_document")}
                >
                  <p>
                    Drag-n-drop here or{" "}
                    <b style={{ color: Colors.blue.blue500 }}>Upload</b> file
                    from your PC
                  </p>
                </Upload>
              </Tooltip>
            </div>
          </>
        )}
        <Spacer size={40} />
        <div className="upload_doc_btn">
          <Button
            type="secondary"
            label="Back"
            icon={{ name: "leftArrow", position: "left" }}
            onClick={onBack}
          />
          <Button
            disabled={isButtonEnabled}
            type="primary"
            label="Submit documents"
            loading={isLoading}
            onClick={onSubmit}
          />
        </div>
      </div>
    </main>
  );
};

export { UploadDocuments as default };
