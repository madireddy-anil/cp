import React, { useState, useEffect } from "react";
import { Form } from "antd";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Radio,
  RadioGroup,
  Select,
  Upload,
  Modal,
  DynamicForm,
  Text,
  Spin,
  Row,
  Col,
  Notification
} from "@payconstruct/design-system";

import {
  QuestionsRequest,
  CompanyReqPost
} from "../../../services/companyService";

import {
  useGetQuestionsByCategoryQuery,
  useUpdateClientInfoMutation,
  ClientRequestProps
} from "../../../services/companyService";

import {
  useGetDocumentFilesByEntityIdQuery,
  useDeleteDocumentFileMutation
} from "../../../services/documentService";
import { getClient } from "../../../services/termsOfService/actions";

import { checkLowRiskCountryAvailability } from "../../../config/transformer";

import { Buttons } from "../Components/Buttons";

import { previousStepAction } from "../../../config/company/companySlice";

import {
  updateRegulatoryInformationQuestions,
  updateCanCloseAddLicenseCardBoolean,
  updateCanFetchQuestionsBoolean,
  updateCurrentFileList,
  updateIsLicenceDuplicate
} from "../../../config/company/regulatoryInformationSlice";

import { useAppSelector, useAppDispatch } from "../../../redux/hooks/store";
import LicenseCard from "./components/licenseCard";
import "./RegulatoryInformation.css";
import { selectEntityId } from "../../../config/auth/authSlice";
import { HeaderRow } from "../Components/Header";

const optionsSet = [
  [true, "Yes"],
  [false, "No"]
];

const RegulatoryInformation: React.FC = ({ ...props }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  let navigate = useNavigate();

  const entityId = useAppSelector(selectEntityId);
  const token = useAppSelector((state) => state.auth.token);

  const {
    regulatoryInformationQuestions,
    licenseTypeOptions,
    countriesOptions,
    regulatoryDetails,
    currentFileList,
    canFetchQuestions,
    canCloseAddLicenseCard,
    isProfileUpdated
  } = useAppSelector((state) => state.regulatoryInformation);
  const { countries } = useAppSelector((state) => state.countries);
  const {
    progressLogs,
    progressLogs: { isRegulatoryInformationDone }
  } = useAppSelector((state) => state.company);
  const { preSignedURLData } = useAppSelector((state) => state.documentUpload);

  const [clientFrom] = useState<ClientRequestProps>({
    clientId: entityId,
    token: token,
    selectedEntityId: entityId
  });

  // Request for Getting Questions
  const [requestParams, setRequestParams] = useState<QuestionsRequest>({
    category: "regulatory_information",
    holdLicense: undefined
  });

  // Request for Update Client
  const [formState, setFormState] = useState<CompanyReqPost>({
    clientId: entityId,
    data: {}
  });

  // Request for delete
  const [
    removeDocumentFiles,
    { isSuccess: isDocumentRemoved, isLoading: removeDocumentLoader }
  ] = useDeleteDocumentFileMutation();

  // call for getting documents
  const {
    refetch: refetchLicenseDocs,
    licenseDocumentFiles,
    documentrsFetchSuccess,
    getFilesLoader
  } = useGetDocumentFilesByEntityIdQuery(
    {
      entityId,
      documentType: "regulatory_license"
    },
    {
      selectFromResult: ({ data, isSuccess, isLoading }) => ({
        licenseDocumentFiles: data?.fileData,
        documentrsFetchSuccess: isSuccess,
        getFilesLoader: isLoading
      }),
      refetchOnMountOrArgChange: 5
    }
  );

  // Response
  const { isFetching, refetch } = useGetQuestionsByCategoryQuery(
    requestParams,
    {
      refetchOnMountOrArgChange: 2,
      skip:
        token === undefined ||
        requestParams.holdLicense === undefined ||
        !canFetchQuestions
    }
  );
  const [updateCustomerInfo, { isLoading: isSubmitBtnLoading }] =
    useUpdateClientInfoMutation();

  const [isBtnEnabled, setBtnEnabled] = useState(true);
  const [canBtnEnabled, setCanBtnEnabled] = useState(true);
  const [isSubmitBtnPressed, setIsSubmitBtnPressed] = useState(false);
  const [isAddLicenseEnabled, setAddlicenseEnabled] = useState<boolean>(true);
  const [isHoldLicense, setIsHoldLicense] = useState<boolean | undefined>(
    undefined
  );
  const [isDocFetching, setIsDocFetching] = useState<boolean>(false);
  // checking as a obj
  const [licenseCardData, setLicenseCardData] = useState({
    licenseType: [],
    regulatoryCountry: [],
    licenseHolderName: "",
    reason: "",
    comments: "",
    fileList: []
  });
  const [allLicenseForUI, setAllLicenseDataForUI] = useState<any>([]);
  const [licenses, setlicenses] = useState<any>([]);
  const [modalView, setModalView] = useState(false);
  const [isLowRiskCategorySaveBtnEnabled, setIsLowRiskCategorySaveBtnEnabled] =
    useState(false);
  const [notProvideLicenseData, setNotProvideLicenseData] = useState({
    reason: "",
    comments: ""
  });
  const [regulatoryQuestions, setRegulatoryQuestions] = useState<any>(
    regulatoryInformationQuestions
  );
  const [currentQuestionNameWithLink, setCurrentQuestionNameWithLink] =
    useState("");

  // on change first question handler
  const onChangeHoldLicenceHandler = (e: any) => {
    const { value } = e.target;
    setIsHoldLicense(value);
    const isLowRiskAvailable = checkLowRiskCountryAvailability(
      currentFileList,
      countries
    );
    Promise.resolve(
      setRequestParams((prev) => ({
        ...prev,
        holdLicense: value
      }))
    )
      .then(() => {
        dispatch(
          updateCanFetchQuestionsBoolean(
            isLowRiskAvailable && value ? false : true
          )
        );
      })
      .then(() => {
        refetch();
      });
    if (!value) {
      const licenses = [
        {
          id: "000-fail",
          documentId: "000-fail",
          licenseType: "no_licence",
          regulatedCountry: null
        }
      ];
      setlicenses(licenses);
    }
  };

  // add Licence
  const handleAddLicense = () => {
    setAddlicenseEnabled(true);
    setIsLowRiskCategorySaveBtnEnabled(true);
  };

  const onClickOkHandler = () => {
    const newLicenceData = {
      uid: Math.random(),
      licenseType: licenseCardData.licenseType[1],
      regulatedCountry: licenseCardData.regulatoryCountry[0],
      licenseHolderName: licenseCardData.licenseHolderName,
      reason: notProvideLicenseData.reason,
      comments: notProvideLicenseData.comments
    };
    const notAbleToProvideLicenseList = [...currentFileList, newLicenceData];
    if (notProvideLicenseData.reason) {
      setModalView(false);
      Promise.resolve(
        dispatch(updateCurrentFileList(notAbleToProvideLicenseList))
      ).then(() => {
        createUploadedLicenceUI(notAbleToProvideLicenseList);
      });
    } else {
      Notification({
        message: "Please add Reason",
        description: "Reason is required",
        type: "error"
      });
    }
  };

  const onClickCancelHandler = () => {
    setModalView(false);
    setNotProvideLicenseData({
      reason: "",
      comments: ""
    });
  };

  // handle Licence type, country and upload info
  const onChangelicenseTypeHandler = (value: string) => {
    const selectedlicenseType = licenseTypeOptions.find(
      (el: any) => el[0] === value
    );
    setLicenseCardData((prev) => ({
      ...prev,
      licenseType: selectedlicenseType
    }));
  };

  const updateQuestionsBasedOnRiskCategory = (value?: string) => {
    const isLowRiskAvailable = checkLowRiskCountryAvailability(
      currentFileList,
      countries,
      value
    );
    if (isLowRiskAvailable) {
      dispatch(updateCanFetchQuestionsBoolean(false));
      dispatch(updateCanCloseAddLicenseCardBoolean(false));
    } else {
      dispatch(updateCanFetchQuestionsBoolean(true));
      dispatch(updateCanCloseAddLicenseCardBoolean(value ? false : true));
    }
  };

  const onChangeLicenceCountryHandler = (value: string) => {
    const selectedLicenceCountry = countriesOptions.find(
      (el: any) => el[0] === value
    );
    setLicenseCardData((prev) => ({
      ...prev,
      regulatoryCountry: selectedLicenceCountry
    }));
    updateQuestionsBasedOnRiskCategory(value);
    const isCountryAlreadyExists = currentFileList?.find(
      (country: any) => country?.regulatedCountry === value
    );
    if (isCountryAlreadyExists) {
      dispatch(updateIsLicenceDuplicate(true));
      Notification({
        type: "warning",
        message: "Warning",
        description: "Duplicate licence location can't be created!"
      });
    } else {
      dispatch(updateIsLicenceDuplicate(false));
    }
  };

  const onLicenseHolderNameChange = (event: any) => {
    const { value } = event.target;
    setLicenseCardData((prev) => ({
      ...prev,
      licenseHolderName: value
    }));
  };

  const getLicenseType = (licenseTypes: any, typeValue: string) => {
    let licenseType = "";
    if (typeValue) {
      if (licenseTypes.length > 0) {
        licenseType = licenseTypes.find((el: any) => el[0] === typeValue)[1];
        return licenseType;
      }
    }
    return typeValue;
  };

  const getCountryName = (countries: any, code: string) => {
    let regulatedCountry = "";
    if (code) {
      regulatedCountry = countries.find(
        (el: any) => el.alpha2Code === code
      ).name;
      return regulatedCountry;
    }
    return code;
  };

  // uploader card / box
  const onBeforeUploadHandler = (file: any, fileList: any) => {
    return false;
  };
  const createUploadedLicenceUI = (updatedFileList: any) => {
    const updatedLicenceData = updatedFileList.map(
      (updatedFile: any, index: number) => {
        return {
          key: updatedFile.uid,
          header: `${getLicenseType(
            licenseTypeOptions,
            updatedFile.licenseType
          )} - ${getCountryName(countries, updatedFile.regulatedCountry)}`,
          text: (
            <Form initialValues={updatedFile}>
              <div key={updatedFile.uid}>
                <div style={{ marginBottom: "20px" }}>
                  <Select
                    showSearch
                    label={"License type"}
                    placeholder={"Select Options"}
                    optionlist={licenseTypeOptions}
                    onChange={onChangelicenseTypeHandler}
                    defaultValue={updatedFile.licenseType}
                    disabled
                  />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <Select
                    showSearch
                    label="Country"
                    optionlist={countriesOptions}
                    onChange={onChangeLicenceCountryHandler}
                    defaultValue={updatedFile.regulatedCountry}
                    disabled
                    optionFilterProp="children"
                    filterOption={(input: any, option: any | undefined) =>
                      option?.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  />
                </div>
                {updatedFile.licenseType === "sub_license" && (
                  <div style={{ marginBottom: "20px" }}>
                    <Input
                      name="licenseHolderName"
                      type="text"
                      size="large"
                      label="Principal license holder legal name"
                      //required
                      disabled
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
                <div>
                  {updatedFile.name && (
                    <Upload
                      beforeUpload={onBeforeUploadHandler}
                      // onChange={uploadHandler}
                      listSize="standard"
                      listType="text"
                      multiple={false}
                      maxCount={1}
                      fileList={[updatedFileList[index]]}
                      disabled
                    >
                      <p>
                        Drag-n-drop here or{" "}
                        <b style={{ color: "blueviolet" }}>Upload</b> file from
                        your PC
                      </p>
                    </Upload>
                  )}
                </div>
                <div>
                  {(updatedFile.reason || updatedFile.comments) && (
                    <div className="reason-list">
                      {updatedFile.reason && (
                        <>
                          <Text
                            weight="bold"
                            size="small"
                            label="Reason for not providing license:"
                          />
                          <div style={{ marginBottom: "10px" }}>
                            {updatedFile.reason}
                          </div>
                        </>
                      )}
                      {updatedFile.comments && (
                        <>
                          <Text weight="bold" size="small" label="Comments:" />
                          <div>{updatedFile.comments}</div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Form>
          )
        };
      }
    );
    if (updatedFileList.length > 0) {
      if (canCloseAddLicenseCard) setAddlicenseEnabled(false);
      setAllLicenseDataForUI(updatedLicenceData);
      setlicenses([licenses, ...updatedFileList]);
    } else {
      setAddlicenseEnabled(true);
    }
  };

  // Unable to Provide Account
  const unableToProvideAccountHandler = () => {
    if (
      licenseCardData.licenseType[1] &&
      licenseCardData.regulatoryCountry[0]
    ) {
      setModalView(true);
    } else if (
      !licenseCardData.licenseType[1] &&
      licenseCardData.regulatoryCountry[0]
    ) {
      Notification({
        message: "Please select license type",
        description: "License type is required",
        type: "error"
      });
    } else if (
      licenseCardData.licenseType[1] &&
      !licenseCardData.regulatoryCountry[0]
    ) {
      Notification({
        message: "Please select license country",
        description: "License country is required",
        type: "error"
      });
    } else {
      Notification({
        message: "Please select license type and country",
        description: "License type and country are required",
        type: "error"
      });
    }
  };

  const onChangeNotProvideLicenseReason = (event: any) => {
    const { value } = event.target;
    setNotProvideLicenseData((prev) => ({
      ...prev,
      reason: value
    }));
  };
  const onChangeNotProvideLicenseComments = (event: any) => {
    const { value } = event.target;
    setNotProvideLicenseData((prev) => ({
      ...prev,
      comments: value
    }));
  };

  const onClickCardDeleteHandler = (license: {
    header: string;
    key: string;
  }) => {
    const remainingFileList = (currentFileList || []).filter(
      (ele: { [key: string]: string }) => ele.uid !== license.key
    );

    const deletedFile = (currentFileList || []).filter(
      (ele: { [key: string]: string }) => ele.uid === license.key
    );

    dispatch(updateCurrentFileList(remainingFileList));

    const payload = {
      uid: deletedFile[0].uid,
      fileName: deletedFile[0].fileName,
      documentType: "regulatory_license"
    };

    removeDocumentFiles(payload)
      .unwrap()
      .then(() => {
        const restructuredValues = {
          ...regulatoryDetails
        };
        restructuredValues.licenses = remainingFileList.map((fileItem: any) => {
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
        });
        updateClientLicenses(restructuredValues);
      });
  };

  const onClickNewCardDeleteHandler = () => {
    setAddlicenseEnabled(false);
  };

  // on file changes in dynamic form
  const onFieldChangeHandler = (changedFields: any, allFields: any) => {
    // moved the disable button logic to onValuesChangeHandler.
    // Bcz, this fn triggering two times.
  };
  const onValuesChangeHandler = (changesValue: any, allValues: any) => {
    const dataValidation = allValues !== undefined && allValues;
    const filterErr = Object.entries(dataValidation).find((item: any) => {
      const [, itemValue] = item;
      return (
        itemValue === undefined || itemValue === "" || itemValue.length === 0
      );
    });
    if (isHoldLicense) {
      if (filterErr || currentFileList.length === 0) {
        setBtnEnabled(true);
        setCanBtnEnabled(true);
      } else {
        setBtnEnabled(false);
        setCanBtnEnabled(false);
      }
    } else {
      if (filterErr) {
        setBtnEnabled(true);
      } else setBtnEnabled(false);
    }
  };

  // Question link Modal
  const modalHandler = (name: string, isView: boolean) => {
    const updatedQuestions = regulatoryQuestions.map((question: any) => {
      if (question.name === name) {
        return {
          ...question,
          modalView: isView
        };
      }
      return question;
    });
    setRegulatoryQuestions(updatedQuestions);
  };
  const onQuestionLinkClickHandler = (question: any) => {
    Promise.resolve(setCurrentQuestionNameWithLink(question.name)).then(() => {
      modalHandler(question.name, true);
    });
  };
  const onClickLinkModalOkHandler = () => {
    modalHandler(currentQuestionNameWithLink, false);
  };
  const onClickLinkModalCancelHandler = () => {
    modalHandler(currentQuestionNameWithLink, false);
  };

  //Question Link modal content
  const getLinkModalContent = (lists: any) => {
    return lists.map((list: [string, string]) => {
      const [value, text] = list;
      return (
        <div key={value} className="modal-list">
          {text}
        </div>
      );
    });
  };

  // Single Question with link restructure for modal
  // this is mainly for Prohibited Countries
  // hard coded
  const restructureQuestionByName = (questions: any, name: string) => {
    return questions.map((question: any) => {
      if (question.name === name) {
        return {
          ...question,
          isLinkAvailable: true,
          linkText: "See our list of prohibited jurisdictions",
          modalTitle: "Prohibited Countries",
          modalContent: (
            <div className="modal-lists">
              {getLinkModalContent(question.options)}
            </div>
          ),
          options: optionsSet
        };
      }
      return question;
    });
  };

  // When submits the form
  const onFinishHandler = (values: any) => {
    // update progresslog
    const status = { ...progressLogs, isRegulatoryInformationDone: true };
    const restructuredValues = {
      ...values,
      amlPolicyDetails: {
        amlPolicyShared: values.amlPolicyShared
      }
    };
    if (isHoldLicense) {
      restructuredValues.licenses = currentFileList.map((fileItem: any) => {
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
      });
    } else {
      restructuredValues.licenses = [
        {
          id: "000-fail",
          documentId: "000-fail",
          licenseType: "no_licence",
          regulatedCountry: null
        }
      ];
      dispatch(updateCurrentFileList([]));
    }
    setFormState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        regulatoryDetails: restructuredValues,
        progressLogs: status,
        formSubmitted: true
      }
    }));
    setIsSubmitBtnPressed(true);
  };

  const updateClientLicenses = (values: any) => {
    setFormState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        regulatoryDetails: values
      }
    }));
  };

  const updateRequlatoryInformationWithoutQuestions = () => {
    const status = { ...progressLogs, isRegulatoryInformationDone: true };
    const restructuredValues: any = {};
    if (isHoldLicense) {
      restructuredValues.licenses = currentFileList.map((fileItem: any) => {
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
      });
    } else {
      restructuredValues.licenses = [
        {
          id: "000-fail",
          documentId: "000-fail",
          licenseType: "no_licence",
          regulatedCountry: null
        }
      ];
      dispatch(updateCurrentFileList([]));
    }
    setFormState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        regulatoryDetails: restructuredValues,
        progressLogs: status
      }
    }));
  };

  // based on fileName both arrays should merge and return
  const mergeLicenseData = (reugulatoryLicense: any, uploadedDocs: any) => {
    let mergedArray: any = [];
    for (const license of reugulatoryLicense) {
      for (const doc of uploadedDocs) {
        if (license.documentId === doc.uid) {
          mergedArray.push({ ...license, ...doc });
        }
      }
    }
    return mergedArray.map((file: any) => {
      return {
        ...file,
        name: file.fileName
      };
    });
  };

  // Use Effects

  useEffect(() => {
    updateQuestionsBasedOnRiskCategory();
    dispatch(updateCanCloseAddLicenseCardBoolean(true));

    if (currentFileList.length === 0) {
      setAddlicenseEnabled(true);
      setAllLicenseDataForUI([]);
      setCanBtnEnabled(true);
    } else {
      setCanBtnEnabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFileList]);

  useEffect(() => {
    if (canFetchQuestions) {
      if (regulatoryQuestions.length === 0) {
        refetch();
      }
    } else {
      Promise.resolve(setRegulatoryQuestions([])).then(() =>
        dispatch(updateRegulatoryInformationQuestions([]))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canFetchQuestions]);

  useEffect(() => {
    if (isProfileUpdated && isSubmitBtnPressed) {
      navigate("/account-setup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProfileUpdated, isSubmitBtnPressed]);

  // when ever documents fetched, check with
  // current entity data and merge based on
  // fileName
  useEffect(() => {
    if (isRegulatoryInformationDone) {
      if (regulatoryDetails?.licenses?.length > 0) {
        if (
          regulatoryDetails?.licenses?.length === 1 &&
          regulatoryDetails?.licenses[0].licenseType === "no_licence"
        ) {
          setIsHoldLicense(false);
          Promise.resolve(
            setRequestParams((prev) => ({
              ...prev,
              holdLicense: false
            }))
          ).then(() => {
            refetch();
          });
        } else {
          if (licenseDocumentFiles?.length > 0) {
            const updatedFileList = mergeLicenseData(
              regulatoryDetails?.licenses,
              licenseDocumentFiles
            );
            setIsHoldLicense(true);
            Promise.resolve(
              setRequestParams((prev) => ({
                ...prev,
                holdLicense: true
              }))
            ).then(() => {
              refetch();
            });
            Promise.resolve(
              dispatch(updateCurrentFileList(updatedFileList))
            ).then(() => {
              createUploadedLicenceUI(updatedFileList);
            });
          }
        }
      } else {
        setIsHoldLicense(isHoldLicense ? true : false);
        Promise.resolve(
          setRequestParams((prev) => ({
            ...prev,
            holdLicense: false
          }))
        ).then(() => {
          refetch();
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentrsFetchSuccess, licenseDocumentFiles]);

  // once uploaded, ui have to change accordingly
  useEffect(() => {
    if (!!preSignedURLData?.fileName) {
      createUploadedLicenceUI(currentFileList);
      setIsLowRiskCategorySaveBtnEnabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preSignedURLData]);

  useEffect(() => {
    const restructuredQuestions = restructureQuestionByName(
      regulatoryInformationQuestions,
      "isOperatingInRiskCountries"
    );
    setRegulatoryQuestions(restructuredQuestions);
    createUploadedLicenceUI(currentFileList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regulatoryInformationQuestions]);

  useEffect(() => {
    if (Object.entries(formState.data).length > 0) {
      updateCustomerInfo(formState)
        .unwrap()
        .then(() => {
          if (formState?.data?.formSubmitted) {
            dispatch(getClient(clientFrom));
            setFormState((prev) => ({
              ...prev,
              data: {
                ...prev.data,
                formSubmitted: false
              }
            }));
            navigate("/account-setup");
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);

  useEffect(() => {
    if (isDocumentRemoved || isRegulatoryInformationDone) {
      setIsDocFetching(true);
      setTimeout(() => {
        refetchLicenseDocs();
        setIsDocFetching(false);
      }, 3000);
    }
    // eslint-disable-next-line
  }, [isDocumentRemoved, isRegulatoryInformationDone]);

  return (
    <div className="regulatory_info--wrapper">
      <Modal
        title="Articles of Association"
        subTitle="I am not able to provide these documents"
        onOkText="Submit to OnBoarding Team"
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
              onChange={onChangeNotProvideLicenseReason}
            />
            <Input
              name="comments"
              type="textarea"
              size="large"
              label="Please tell us why"
              required
              style={{ width: "100%" }}
              onChange={onChangeNotProvideLicenseComments}
            />
          </Form>
        }
      />
      <Spin loading={isDocFetching}>
        <HeaderRow
          headerText="Regulatory Information"
          subHeaderText="Please provide us with information regarding your regulatory license, this helps us speed up the process of activating your account"
          status={isRegulatoryInformationDone}
        />

        <div style={{ marginTop: "40px" }}>
          <div className="form__label--radioGp">
            <Text
              weight="regular"
              size="medium"
              label="Do you hold a license?"
            />
          </div>
          {isRegulatoryInformationDone ? (
            isRegulatoryInformationDone &&
            isHoldLicense !== undefined && (
              <RadioGroup
                name="isHoldLicense"
                onChange={onChangeHoldLicenceHandler}
                style={{ marginBottom: "35px" }}
                value={isHoldLicense}
                children={optionsSet.map((option: any) => {
                  const [optionValue, optionText] = option;
                  const disabled = optionValue !== 0 ? false : !!optionValue;
                  return (
                    <Radio
                      key={optionValue}
                      value={optionValue}
                      disabled={disabled}
                    >
                      {optionText}
                    </Radio>
                  );
                })}
              />
            )
          ) : (
            <RadioGroup
              name="isHoldLicense"
              onChange={onChangeHoldLicenceHandler}
              style={{ marginBottom: "35px" }}
              value={isHoldLicense}
              children={optionsSet.map((option: any) => {
                const [optionValue, optionText] = option;
                const disabled = optionValue !== 0 ? false : !!optionValue;
                return (
                  <Radio
                    key={optionValue}
                    value={optionValue}
                    disabled={disabled}
                  >
                    {optionText}
                  </Radio>
                );
              })}
            />
          )}
          {isHoldLicense !== undefined && (
            <>
              {isHoldLicense && (
                <Row>
                  <Col lg={{ span: 14 }} md={{ span: 18 }} sm={{ span: 24 }}>
                    <Spin loading={removeDocumentLoader || getFilesLoader}>
                      <LicenseCard
                        // addLicenseForUI={addLicenseForUI}
                        allLicenseForUI={allLicenseForUI}
                        isAddLicenseEnabled={isAddLicenseEnabled}
                        licenseCardData={licenseCardData}
                        handleAddLicense={handleAddLicense}
                        onClickCardDeleteHandler={onClickCardDeleteHandler}
                        onClickNewCardDeleteHandler={
                          onClickNewCardDeleteHandler
                        }
                        onChangelicenseTypeHandler={onChangelicenseTypeHandler}
                        onChangeLicenceCountryHandler={
                          onChangeLicenceCountryHandler
                        }
                        onLicenseHolderNameChange={onLicenseHolderNameChange}
                        unableToProvideLicense={unableToProvideAccountHandler}
                        updateClientLicenses={updateClientLicenses}
                        onUpload={() =>
                          dispatch(updateCanCloseAddLicenseCardBoolean(true))
                        }
                        onDocumentUploadSuccess={() =>
                          updateRequlatoryInformationWithoutQuestions()
                        }
                      />
                    </Spin>
                  </Col>
                </Row>
              )}
              <Row>
                <Col lg={{ span: 12 }} md={{ span: 18 }} sm={{ span: 24 }}>
                  <Spin loading={isFetching}>
                    {regulatoryQuestions.length > 0 && canFetchQuestions && (
                      <DynamicForm
                        form={form}
                        formData={regulatoryQuestions}
                        initialValues={regulatoryDetails}
                        onFieldsChange={onFieldChangeHandler}
                        onValuesChange={onValuesChangeHandler}
                        onQuestionLinkClick={(value: any) =>
                          onQuestionLinkClickHandler(value)
                        }
                        onClickLinkModalOkHandler={onClickLinkModalOkHandler}
                        onClickLinkModalCancelHandler={
                          onClickLinkModalCancelHandler
                        }
                        onFinish={onFinishHandler}
                        customButtons={
                          <Buttons
                            onSaveText="Save &amp; Continue"
                            onBackText="Back"
                            formType="submit"
                            btnLoader={isSubmitBtnLoading}
                            isBtnEnabled={
                              isHoldLicense
                                ? isBtnEnabled || canBtnEnabled
                                : isBtnEnabled
                            }
                            onBack={() => dispatch(previousStepAction())}
                          />
                        }
                      />
                    )}
                    {!canFetchQuestions && (
                      <Buttons
                        onSaveText="Save &amp; Continue"
                        onBackText="Back"
                        isBtnEnabled={isLowRiskCategorySaveBtnEnabled}
                        formType="button"
                        onBack={() => dispatch(previousStepAction())}
                        onSave={() => {
                          updateRequlatoryInformationWithoutQuestions();
                          setIsSubmitBtnPressed(true);
                        }}
                      />
                    )}
                  </Spin>
                </Col>
              </Row>
            </>
          )}
        </div>
      </Spin>
    </div>
  );
};
export { RegulatoryInformation as default };
