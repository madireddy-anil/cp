import React from "react";

import DocumentUpload from "./components/DocumentUpload";
import People from "../People/People";
import VerificationStatus from "../People/Components/VerificationStatus";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks/store";
import { updateSelectedStep } from "../../../config/document/documentSlice";
// import {
//   useGetDocumentQuestionsQuery,
//   useGetDocumentFileQuery
// } from "../../../services/documentService";

import "./Documents.css";
import { Steps } from "../../../components/Steps/Steps";
import { Spin } from "@payconstruct/design-system";

const Documents: React.FC = () => {
  const dispatch = useAppDispatch();

  const currentStepOfUploadDocs = useAppSelector(
    (state) => state.documentUpload.currentStepOfUploadDocs
  );

  const { disableStep } = useAppSelector((state) => state.people);

  const isDocumentsUploadedDone = useAppSelector(
    (state) => state.company.progressLogs.isDocumentsUploadedDone
  );

  const handleComponentsShow = (selectedStep: number) => {
    dispatch(updateSelectedStep(selectedStep));
  };

  // const { refetch: getRequiredDocumentsList } =
  //   useGetDocumentQuestionsQuery("UploadDocuments");
  // const { refetch: getAllDocuments } =
  //   useGetDocumentFileQuery("GetDocumentFile");

  // useEffect(() => {
  //   getRequiredDocumentsList();
  //   getAllDocuments();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const steps = [
    {
      key: 0,
      title: "Upload Documents",
      content: <DocumentUpload />
    },
    {
      key: 1,
      title: "People",
      content: <People />
    },
    {
      key: 2,
      title: "Verification Status",
      content: <VerificationStatus />
    }
  ];

  return (
    <main>
      <div style={{ padding: "40px" }}>
        <Spin loading={disableStep}>
          <Steps
            steps={steps}
            currentStep={currentStepOfUploadDocs}
            onChange={
              currentStepOfUploadDocs !== 0 || isDocumentsUploadedDone
                ? handleComponentsShow
                : undefined
            }
          />
        </Spin>
      </div>
    </main>
  );
};

export { Documents as default };
