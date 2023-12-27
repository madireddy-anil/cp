import React, { useState, useEffect } from "react";
import { message } from "antd";
import {
  Spin,
  Colors,
  Modal,
  Upload,
  Button,
  Input,
  Form,
  Text,
  Tooltip,
  Notification
} from "@payconstruct/design-system";

import { useAppSelector, useAppDispatch } from "../../../../redux/hooks/store";

import {
  GetPreSignedURLReq,
  useGetPresignedURLMutation,
  useDeleteDocumentFileMutation,
  // useGetDocumentFileQuery,
  DocumentListProps,
  ModalFormProps,
  useGetDocumentQuestionsQuery,
  useGetPresignedURLForDownloadMutation
} from "../../../../services/documentService";
import { useGetDocumentFileQuery } from "../../../../services/filesService";
import { useUpdateClientInfoMutation } from "../../../../services/companyService";
import {
  useAddDocumentFileMutation,
  FileProgressStatusProps
} from "../../../../services/documentUploadService";
import {
  updateSelectedStep,
  updateDocs
} from "../../../../config/document/documentSlice";
// import { updateProgressLogOnDocumentsUpload } from "../../../../config/transformer";
import { Buttons } from "../../Components/Buttons";
import { HeaderRow } from "../../Components/Header";
import { Spinner } from "../../../../components/Spinner/Spinner";
import { FileProgressCard } from "../../../../components/FileProgressCard/FileProgressCard";
import {
  formatDocumentForInitialData,
  validationOnData,
  generateRandomName,
  fileDownloader,
  filePreview
} from "../../../../config/transformer";

import style from "./style.module.css";
import { selectEntityId } from "../../../../config/auth/authSlice";

const DocumentUpload: React.FC = () => {
  const dispatch = useAppDispatch();
  // Get from State
  const entityId = useAppSelector(selectEntityId);

  // const token = useAppSelector((state) => state.auth.token);
  // const clientId = useAppSelector((state) => state.auth.clientId);
  const regulatoryDetails = useAppSelector(
    (state) => state.regulatoryInformation.regulatoryDetails
  );
  const preSignedURLData = useAppSelector(
    (state) => state.documentUpload.preSignedURLData
  );

  // const companyDocuments = useAppSelector(
  //   (state) => state.documentUpload.companyDocuments
  // );

  // * Replaced for direct API data consume.
  // const as = useAppSelector(
  //   (state) => state.documentUpload.selectedDocumentFiles
  // );

  const { progressLogs } = useAppSelector((state) => state.company);
  const isDocumentsUploadedDone = useAppSelector(
    (state) => state.company.progressLogs.isDocumentsUploadedDone
  );

  // const [documentFiles] = useState<any>(selectedDocumentFiles);
  const [modalView, setModalView] = useState(false);
  const [progressFile, setProgressFile] = useState<any>({});
  const [buttonType, setButtonType] = useState<string>();
  const [randomName] = useState(generateRandomName);
  const [fileProgressStatus, setFileProgressStatus] =
    useState<FileProgressStatusProps>({
      percent: 20,
      status: "normal"
    });
  const [isErrorInFile, setErrorInFile] = useState(false);
  const [unUsed] = useState(false);

  const [selectedDocument, setSelectedDocument] = useState<DocumentListProps>({
    limit: 0,
    label: "",
    name: ""
  });

  const [formState, setFormState] = useState<GetPreSignedURLReq>({
    data: {},
    file: {}
  });

  const [formModalState, setModalFormState] = useState<ModalFormProps>({
    documentType: "",
    reason: "",
    comment: ""
  });

  const { requiredDocumentsList, isFetching, isLoading } =
    useGetDocumentQuestionsQuery("getDocuments", {
      selectFromResult: ({ data, isFetching, isLoading }) => ({
        requiredDocumentsList: data?.data,
        isFetching,
        isLoading
      }),
      refetchOnMountOrArgChange: 10
    });

  const {
    refetch,
    documentFiles,
    isFetchingUploadedDocs,
    isGetAllDocumentsSuccess,
    isGetAllFileerror
  } = useGetDocumentFileQuery(randomName, {
    selectFromResult: ({
      data,
      isSuccess,
      isFetching,
      isLoading,
      isError
    }) => ({
      documentFiles: formatDocumentForInitialData(
        validationOnData(data?.fileData, "array")
      ),
      isGetAllDocumentsSuccess: isSuccess,
      isFetchingUploadedDocs: isFetching,
      isLoadingUploadedDocs: isLoading,
      isGetAllFileerror: isError
    }),
    refetchOnMountOrArgChange: 5
  });

  const [
    getPresignedURL,
    { isSuccess: preSignedURLSuccess, isLoading: isPreSignedURLLoading }
  ] = useGetPresignedURLMutation();

  const [addDocumentFiles] = useAddDocumentFileMutation();

  const [removeDocumentFiles] = useDeleteDocumentFileMutation();
  const [getPresignedURLForDownload, { isLoading: isPresignedURLFetched }] =
    useGetPresignedURLForDownloadMutation();

  // const { refetch: getAllDocuments, isLoading: getAllDocsLoader } =
  //   useGetDocumentFileQuery({}, { refetchOnMountOrArgChange: true });

  const [updateCustomerInfo, { isLoading: loader }] =
    useUpdateClientInfoMutation();

  useEffect(() => {
    if (Object.entries(formState.data).length > 0) {
      getPresignedURL(formState.data).unwrap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);

  useEffect(() => {
    if (preSignedURLSuccess) {
      const documentsFileState = Object.assign(
        formState.file,
        preSignedURLData
      );
      setFileProgressStatus({
        percent: 60,
        status: "normal"
      });
      addDocumentFiles(documentsFileState).unwrap().then(refetch); // Refetch after upload
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preSignedURLSuccess]);

  useEffect(() => {
    if (isFetchingUploadedDocs) {
      setFileProgressStatus({
        percent: 80
      });
    }
    if (isGetAllDocumentsSuccess) {
      dispatch(updateDocs(documentFiles));
      // getDocumentsStatus();
      setProgressFile({});
      setFileProgressStatus({
        percent: 100,
        status: "success"
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingUploadedDocs, isGetAllDocumentsSuccess]);

  const updateProgressLog = (docStatus: boolean) => {
    const status = {
      ...progressLogs,
      isDocumentsUploadedDone: docStatus
    };
    const data = {
      clientId: entityId,
      data: { progressLogs: status }
    };
    updateCustomerInfo(data)
      .unwrap()
      .then((res) => {
        res !== undefined &&
          (buttonType === "skip" ||
            res?.data?.progressLogs?.isDocumentsUploadedDone) &&
          dispatch(updateSelectedStep(1));
      });
  };

  const handleDocumentUnavailableBtnClick = (document: any) => {
    setSelectedDocument(document);
    setModalView(true);
  };

  const onClickOkHandler = async () => {
    try {
      setModalView(false);
      const data = {
        clientId: entityId,
        data: { documentsComment: [formModalState] }
      };
      await updateCustomerInfo(data).unwrap();
    } catch (err) {
      setModalView(false);
    }
  };

  const onClickCancelHandler = () => {
    setModalView(false);
  };

  // const handleBeforeUpload = () => {
  //   return false;
  // };

  const handleChange = (info: any, docType: string) => {
    const { file } = info;
    file.documentType = docType;
    setProgressFile(file);
    const isFileExits = documentFiles?.find(
      (files: any) => (file?.friendlyName || file?.name) === files?.friendlyName
    );
    /* 
      Upload document function
    */
    if (
      (file.status !== "error" &&
        file?.status !== "removed" &&
        !isFileExits &&
        file.status === "done") ||
      file.status === undefined
    ) {
      file.documentType = docType;
      setFormState((prev) => ({
        ...prev,
        data: {
          fileName: file?.name,
          uid: file?.uid,
          documentType: docType
        },
        file: file
      }));
      setFileProgressStatus({
        percent: 40,
        status: "normal"
      });
    }
    if (file?.status === "uploading" || file?.status === "error") {
      delete file.response;
    }
    /* 
      Delete document function
    */
    if (file?.status === "removed" && isFileExits) {
      const payload = {
        fileName: isFileExits?.name,
        uid: file?.uid,
        documentType: docType
      };
      setFileProgressStatus({
        percent: 40,
        status: "exception"
      });
      removeDocumentFiles(payload).unwrap().then(refetch);
    }
  };

  const handleRemove = (file: any, docType: any) => {
    console.log("FILE DELETE ACTION");
  };

  const onChangeModalInput = (item: any) => {
    const name = item.target.id;
    const value = item.target.value;
    setModalFormState((prev) => ({
      ...prev,
      [name]: value,
      documentType: selectedDocument.name
    }));
  };

  // unused functions and console
  if (unUsed) {
    console.log(handleDocumentUnavailableBtnClick(""));
  }

  const handleSkip = () => {
    setButtonType("skip");
    validationOnDocs("skip_message");

    setTimeout(() => {
      dispatch(updateSelectedStep(1));
    }, 3000);
  };

  const handleSave = () => {
    setButtonType("");
    validationOnDocs("");
  };

  const validationOnDocs = (message: string) => {
    const validateRegulatoryLicence =
      regulatoryDetails?.licenses?.length === 1 && regulatoryDetails?.licenses;
    const returnResp: any[] = [];
    requiredDocumentsList?.forEach((fileCategory) => {
      const filterFiles = (documentFiles || []).filter(
        (file: any) => file.documentType === fileCategory.name
      );
      returnResp.push(filterFiles?.length < fileCategory?.minLimit);
    });
    if (returnResp?.length === 0 || returnResp.includes(true)) {
      if (validateRegulatoryLicence[0]?.licenseType !== "no_licence") {
        !message &&
          Notification({
            type: "warning",
            message: "",
            description:
              "Some documents are missing. Please upload all required documents!"
          });
        updateProgressLog(false);
      } else updateProgressLog(true);
    } else {
      updateProgressLog(true);
    }
  };

  // const getDocumentsStatus = () => {
  //   const validateRegulatoryLicence =
  //     regulatoryDetails?.licenses?.length === 1 && regulatoryDetails?.licenses;
  //   const returnResp: any[] = [];
  //   requiredDocumentsList?.forEach((fileCategory) => {
  //     const filterFiles = (documentFiles || []).filter(
  //       (file: any) => file.documentType === fileCategory.name
  //     );
  //     returnResp.push(filterFiles?.length < fileCategory?.minLimit);
  //   });
  //   if (returnResp?.length === 0 || returnResp.includes(true)) {
  //     if (validateRegulatoryLicence[0]?.licenseType !== "no_licence") {
  //       dispatch(
  //         updateProgressLogAction({
  //           ...progressLogs,
  //           isDocumentsUploadedDone: false
  //         })
  //       );
  //     } else {
  //       dispatch(
  //         updateProgressLogAction({
  //           ...progressLogs,
  //           isDocumentsUploadedDone: true
  //         })
  //       );
  //     }
  //   } else {
  //     dispatch(
  //       updateProgressLogAction({
  //         ...progressLogs,
  //         isDocumentsUploadedDone: true
  //       })
  //     );
  //   }
  // };

  // Loading List of Required documents
  if (isLoading || isFetching)
    return (
      <main>
        <Spinner />
      </main>
    );

  const handleDownload = (file: any, documentType: string) => {
    const data = {
      entityId,
      payload: {
        fileName: file.name,
        documentType: file.documentType,
        isDownload: true
      }
    };

    getPresignedURLForDownload(data)
      .unwrap()
      .then((value) => {
        const { url } = value;
        fileDownloader(url, file?.name, file?.type);
      });
  };

  const handlePreview = (file: any, documentType: string) => {
    const data = {
      entityId,
      payload: {
        fileName: file.name,
        documentType: file.documentType,
        isDownload: false
      }
    };

    getPresignedURLForDownload(data)
      .unwrap()
      .then((value) => {
        const { url } = value;
        filePreview(url, file?.name, file?.type);
      });
  };

  return (
    <main>
      <Spin
        label="loading wait..."
        loading={
          isFetchingUploadedDocs ||
          isPreSignedURLLoading ||
          isPresignedURLFetched
        }
      >
        <HeaderRow
          headerText="Upload Documents"
          subHeaderText="Please upload all documents related to your company"
          status={isDocumentsUploadedDone}
        />
        <div className="upload-wrapper">
          {requiredDocumentsList?.map((item: any, idx: number) => {
            const documentType = documentFiles?.filter(
              (files: any) => files.documentType === item.name
            );
            return (
              <div key={item.name}>
                <h6>Upload {item?.label}</h6>
                <div className="upload-body">
                  {documentType?.length > 0 &&
                  documentType?.length >= item?.maxLimit ? (
                    <div style={{ marginBottom: "10px" }}>
                      <Text
                        weight="bold"
                        size="xsmall"
                        label={`Maximum limit has been exceeded and max is ${item?.maxLimit}`}
                      />
                    </div>
                  ) : (
                    <div style={{ marginBottom: "10px" }}>
                      <Text
                        weight="bold"
                        size="xsmall"
                        label={`Minimum file upload limit is ${item?.minLimit}`}
                      />
                    </div>
                  )}

                  <div className={style["custom-upload--wrapper"]}>
                    <Tooltip
                      text={
                        item?.toolTip +
                        `. And upload file size limits min ${item?.minLimit} and max ${item?.maxLimit}`
                      }
                    >
                      <Upload
                        // name={"file"}
                        listSize={"standard"}
                        listType={"text"}
                        disabled={
                          isFetchingUploadedDocs ||
                          (documentType?.length > 0 &&
                            documentType?.length >= item?.maxLimit)
                        }
                        // @ts-ignore
                        isDownloadEnabled={true}
                        onChange={(info) => handleChange(info, item?.name)}
                        beforeUpload={(file: any) => {
                          const fileValidation =
                            file.type === "image/png" ||
                            file.type === "image/jpg" ||
                            file.type === "image/jpeg" ||
                            file.type === "application/pdf" ||
                            file.type === "jpg" ||
                            file.type === "jpeg" ||
                            file.type === "png" ||
                            file.type === "pdf" ||
                            file.type === "xls" ||
                            file.type === "xlsx" ||
                            file.type === "application/vnd.ms-excel" ||
                            file.type ===
                              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

                          if (
                            !fileValidation ||
                            documentType?.length >= item?.maxLimit
                          ) {
                            if (documentType?.length >= item?.maxLimit) {
                              message.error("File limit has exceeded!");
                            } else
                              message.error(
                                "You can only upload jpg,jpeg,png,xls and xlsx files!"
                              );
                            setErrorInFile(true);
                            return true;
                          } else {
                            const isFileExits = (documentFiles || []).filter(
                              (files: any) => file?.name === files?.friendlyName
                            );
                            if (isFileExits?.length > 0) {
                              message.error(
                                "File already exists! Please upload with unique file name"
                              );
                              setErrorInFile(true);
                            } else {
                              setErrorInFile(false);
                            }
                            return isFileExits?.length > 0 ? true : false;
                          }
                        }}
                      >
                        <p>
                          Drag-n-drop here or{" "}
                          <b style={{ color: Colors.blue.blue500 }}>Upload</b>{" "}
                          file from your PC
                        </p>
                      </Upload>
                    </Tooltip>
                  </div>
                  <div className={style["custom-uploadlist--wrapper"]}>
                    {documentType?.map((fileD: any, idx: boolean) => {
                      fileD.status = "done";
                      return (
                        <Upload
                          key={fileD?.friendlyName}
                          name={"file"}
                          listSize={"standard"}
                          listType={"text"}
                          disabled={isFetchingUploadedDocs}
                          onChange={(info) => handleChange(info, item?.name)}
                          onRemove={(info) => handleRemove(info, documentType)}
                          defaultFileList={[fileD]}
                          // @ts-ignore
                          isDownloadEnabled
                          onDownload={() => handleDownload(fileD, documentType)}
                          onPreview={() => handlePreview(fileD, documentType)}
                        ></Upload>
                      );
                    })}
                    {progressFile?.documentType === item?.name &&
                      !isGetAllFileerror &&
                      !isErrorInFile && (
                        <FileProgressCard
                          loading={true}
                          fileName={progressFile?.name}
                          percent={fileProgressStatus.percent}
                          fileStatus={fileProgressStatus.status}
                        />
                      )}
                    <Tooltip text="Please access the live chat window for support">
                      <Button
                        type={"link"}
                        label={"I am not able to provide this document"}
                        size={"large"}
                        disabled={false}
                        // onClick={() => handleDocumentUnavailableBtnClick(item)}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: "35px" }}>
            <Buttons
              onBackText="Save &amp; come back later"
              onSaveText="Save &amp; submit"
              btnLeftIcon="rightArrow"
              aIconPosition="right"
              bIconPosition="right"
              btnLoaderOnBack={buttonType === "skip" ? loader : false}
              btnLoader={buttonType !== "skip" ? loader : false}
              onBack={handleSkip}
              onSave={handleSave}
            />
          </div>
        </div>
      </Spin>
      <Modal
        title={selectedDocument.label}
        subTitle="I am not able to provide these documents"
        onOkText="Submit to Onboarding Team"
        modalView={modalView}
        onCancelText="Cancel"
        onClickOk={onClickOkHandler}
        onClickCancel={onClickCancelHandler}
        description={
          <Form>
            <Input
              name="reason"
              type="text"
              size="large"
              label="Reason"
              required
              style={{ width: "100%" }}
              onChange={onChangeModalInput}
            />
            <Input
              name="comment"
              type="textarea"
              size="large"
              label="Please tell us why"
              required
              style={{ width: "100%" }}
              onChange={onChangeModalInput}
            />
          </Form>
        }
      />
    </main>
  );
};

// Export need to be default for code Splitting
// https://reactjs.org/docs/code-splitting.html#route-based-code-splitting
export { DocumentUpload as default };
