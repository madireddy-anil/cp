import React, { useState, useEffect } from "react";
import { Upload, Tooltip, Notification } from "@payconstruct/design-system";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks/store";
import {
  GetPreSignedURLReq,
  useGetPresignedURLMutation
} from "../../../../services/documentService";
import { useAddDocumentFileMutation } from "../../../../services/documentUploadService";
import {
  updateCurrentFile,
  updateCurrentFileList
} from "../../../../config/company/regulatoryInformationSlice";
import { checkLowRiskCountryAvailability } from "../../../../config/transformer";

interface LicenseCardProps {
  licenseType: string;
  regulatoryContry: string;
  licenseHolderName: string;
  fileList?: any[];
  isLicenseTypeCountryUpdated?: boolean;
  updateClientLicenses: (e: any) => void;
  onUpload: () => void;
  onDocumentUploadSuccess: () => void;
}

const UploadLicense: React.FC<LicenseCardProps> = (props) => {
  const dispatch = useAppDispatch();
  const {
    licenseType,
    regulatoryContry,
    licenseHolderName,
    fileList,
    isLicenseTypeCountryUpdated,
    updateClientLicenses,
    onUpload,
    onDocumentUploadSuccess
  } = props;
  const [preSignedURLState, setPreSignedURLState] =
    useState<GetPreSignedURLReq>({
      data: {},
      file: {}
    });
  const [getPresignedURL, { isSuccess: preSignedURLSuccess }] =
    useGetPresignedURLMutation();
  const [addDocumentFiles] = useAddDocumentFileMutation();
  const { preSignedURLData } = useAppSelector((state) => state.documentUpload);
  const isLicenceLocationDuplicate = useAppSelector(
    (state) => state.regulatoryInformation.isLicenceLocationDuplicate
  );
  const { countries } = useAppSelector((state) => state.countries);
  const {
    progressLogs: { isRegulatoryInformationDone }
  } = useAppSelector((state) => state.company);
  const { currentFileList, regulatoryDetails } = useAppSelector(
    (state) => state.regulatoryInformation
  );

  // const onBeforeUpload = (file: any) => {
  //   const { uid, name } = file;
  //   dispatch(updateCurrentFile({ uid, name }));
  //   return false;
  // };

  const onBeforeUpload = (file: any) => {
    const { uid, name } = file;
    const fileValidation =
      file.type === "image/png" ||
      file.type === "image/jpg" ||
      file.type === "image/jpeg" ||
      file.type === "application/pdf" ||
      file.type === "jpg" ||
      file.type === "jpeg" ||
      file.type === "png" ||
      file.type === "pdf";
    if (!fileValidation) {
      return true;
    } else {
      dispatch(updateCurrentFile({ uid, name }));
      return false;
    }
  };

  const uploadHandler = (info: any) => {
    const { file, fileList: newFileList } = info;
    const modifiedNewFileList = newFileList.map((newFile: any) => {
      newFile.licenseType = licenseType;
      newFile.regulatedCountry = regulatoryContry;
      newFile.licenseHolderName = licenseHolderName;
      const { lastModifiedDate, originFileObj, ...rest } = newFile;
      return rest;
    });
    if (licenseType && regulatoryContry) {
      if (file.status !== "removed") {
        file.documentType = "regulatory_license";
        setPreSignedURLState((prev) => ({
          ...prev,
          data: {
            fileName: file.name,
            uid: file.uid,
            documentType: file.documentType
          },
          file: file
        }));
      }
      const updatedFileList = [...currentFileList, ...modifiedNewFileList];
      dispatch(updateCurrentFileList(updatedFileList));
    } else if (!licenseType && regulatoryContry) {
      Notification({
        message: "License type is required!",
        description: "Please select license type and upload license again.",
        type: "error"
      });
    } else if (licenseType && !regulatoryContry) {
      Notification({
        message: "License country is required!",
        description: "Please select license country and upload license again.",
        type: "error"
      });
    } else {
      Notification({
        message: "License type and country are required!",
        description:
          "Please select license type and country and upload license again.",
        type: "error"
      });
    }
    if (onUpload) onUpload();
  };

  useEffect(() => {
    if (Object.entries(preSignedURLState.data).length > 0) {
      getPresignedURL(preSignedURLState.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preSignedURLState]);

  useEffect(() => {
    if (preSignedURLSuccess) {
      const documentsFileState = Object.assign(
        preSignedURLState.file,
        preSignedURLData
      );
      addDocumentFiles(documentsFileState)
        .unwrap()
        .then(() => {
          const isLowRiskAvailable = checkLowRiskCountryAvailability(
            currentFileList,
            countries
          );
          if (isLowRiskAvailable) {
            if (onDocumentUploadSuccess) onDocumentUploadSuccess();
          } else {
            if (isRegulatoryInformationDone) {
              if (
                regulatoryDetails?.licenses.length !== currentFileList.length &&
                currentFileList[0].licenseType !== "no_licence"
              ) {
                const restructuredValues = {
                  ...regulatoryDetails
                };
                restructuredValues.licenses = currentFileList.map(
                  (fileItem: any) => {
                    const formatedLicenses = {
                      id: fileItem.uid,
                      documentId: fileItem.uid,
                      licenseType: fileItem.licenseType,
                      regulatedCountry: fileItem.regulatedCountry,
                      licenseHolderName: fileItem.licenseHolderName,
                      reason: fileItem.reason,
                      comments: fileItem.reason,
                      fileName: fileItem.fileName
                    };
                    return formatedLicenses;
                  }
                );
                updateClientLicenses(restructuredValues);
              }
            }
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preSignedURLSuccess]);
  return (
    <Tooltip text="If you have stated 'Pending licence application' above then upload proof here">
      <Upload
        beforeUpload={onBeforeUpload}
        onChange={(info: any) => uploadHandler(info)}
        listSize="standard"
        listType="text"
        fileList={fileList}
        maxCount={1}
        disabled={isLicenceLocationDuplicate || isLicenseTypeCountryUpdated}
      >
        <p>
          Drag-n-drop here or <b style={{ color: "blueviolet" }}>Upload</b> file
          from your PC
        </p>
      </Upload>
    </Tooltip>
  );
};
export default UploadLicense;
