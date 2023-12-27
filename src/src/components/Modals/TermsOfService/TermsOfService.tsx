import React from "react";
import { useIntl } from "react-intl";
import { useState, useEffect } from "react";
import { pdfjs } from "react-pdf";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/store";
import {
  Modal as DSModal,
  Checkbox,
  Spin,
  Button
} from "@payconstruct/design-system";
import { useUpdateTermsOfServiceMutation } from "../../../services/authService";
import {
  updateLegalAgreementRecord,
  resetToInitialState,
  updateShowAccountReadyModal
} from "../../../config/auth/termsOfServiceDocumentSlice";
import { useGetPresignedURLForDownloadMutation } from "../../../services/termsOfServiceDocumentService";
import { BookMeeting } from "../../../config/plugins/BookMeeting";
import { DocumentView } from "./DocumentView";
import { fileDownloader } from "../../../config/transformer";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import styles from "./TermsOfService.module.css";

interface TermsOfServiceProps {
  show: boolean;
  legalAgreements: any;
  toggleShow?: (value: boolean) => void;
  checked?: (value: boolean) => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({
  legalAgreements,
  show
  // toggleShow
}) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [isBookMeetingEnabled, setBookMeetingEnabled] =
    useState<boolean>(false);
  const [UpdateTermsOfService, { isLoading: isTermsAcceptedLoader }] =
    useUpdateTermsOfServiceMutation();
  const [acceptedVersion, setAcceptedVersion] = useState({
    versionId: "",
    versionNo: "",
    authorizedPersonId: ""
  });

  const {
    legalAgreementFileName,
    legalAgreementVersionId,
    preSignedDownloadURL,
    showNewTermsOfService
  } = useAppSelector((state) => state.termsOfServiceDocument);
  const versionNo = useAppSelector(
    (state) => state.termsOfServiceDocument.legalAgreementVersionNo
  );

  const email = useAppSelector((state) => state.auth.email);
  const listOfPeoples = useAppSelector((state) => state.people.listOfPeoples);

  // const {refetch, isFetching: isFetchingTerms, isSuccess: getAllTermsSuccess} = useGetLegalAgreementsQuery("termsOfService", {
  //   skip: legalAgreements?.length>0 || versionId !== undefined || kycStatus !== "pass",
  //   refetchOnMountOrArgChange: true
  // });

  const [getPresignedURLForDownload, { isLoading: isFetchingUrl }] =
    useGetPresignedURLForDownloadMutation();

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  useEffect(() => {
    if (show && legalAgreements?.length > 0) {
      const sortedLegalAgreements = legalAgreements.reduce((a: any, b: any) =>
        a.updatedAt > b.updatedAt ? a : b
      );

      if (!legalAgreementFileName || !legalAgreementVersionId) {
        dispatch(updateLegalAgreementRecord(sortedLegalAgreements));
      }
      if (legalAgreementFileName) {
        const data = {
          fileName: legalAgreementFileName
        };
        getPresignedURLForDownload(data)
          .unwrap()
          .then(() => {
            // setPresignedUrlFetched(true);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, legalAgreements, legalAgreementFileName]);

  useEffect(() => {
    const person = listOfPeoples?.find(
      (el: any) => el?.email === email && el.isAuthorisedToAcceptTerms === true
    );
    if (legalAgreementVersionId !== "")
      setAcceptedVersion({
        versionId: legalAgreementVersionId,
        versionNo: versionNo,
        authorizedPersonId: person?.id
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    legalAgreementVersionId,
    listOfPeoples,
    showNewTermsOfService,
    versionNo
  ]);

  const bookAMeeting = () => {
    setBookMeetingEnabled(!isBookMeetingEnabled);
    isBookMeetingEnabled && setButtonDisabled(true);
  };

  const handleChange = (item: any) => {
    const { value } = item.target;
    if (value) setButtonDisabled(false);
    if (!value) setButtonDisabled(true);
  };

  const updateTermsAcceptance = () => {
    UpdateTermsOfService(acceptedVersion)
      .unwrap()
      .then(() => {
        dispatch(updateShowAccountReadyModal(true));
        resetToInitialState();
      });
  };

  const handleDownloadFile = () => {
    fileDownloader(preSignedDownloadURL, legalAgreementFileName, "pdf");
  };

  return (
    <>
      <DSModal
        title={
          !isBookMeetingEnabled
            ? showNewTermsOfService
              ? intl.formatMessage({ id: "newTermsOfService" })
              : intl.formatMessage({ id: "termsOfService" })
            : intl.formatMessage({ id: "bookMeeting" })
        }
        onOkText={
          !isBookMeetingEnabled ? intl.formatMessage({ id: "accept" }) : ""
        }
        onCancelText={
          !isBookMeetingEnabled
            ? intl.formatMessage({ id: "decline" })
            : intl.formatMessage({ id: "back" })
        }
        buttonOkDisabled={buttonDisabled}
        onClickCancel={bookAMeeting}
        onClickOk={updateTermsAcceptance}
        modalView={show}
        modalWidth={750}
        btnLoading={isTermsAcceptedLoader}
        description={
          <>
            {!isBookMeetingEnabled ? (
              <Spin label="loading Pdf" loading={isFetchingUrl} size={24}>
                <div className={styles["terms-services-title"]} />
                <div
                  style={{
                    height: "50vh",
                    overflowY: "scroll",
                    margin: "15px 0px",
                    borderRadius: "10px",
                    padding: "0 5px"
                  }}
                >
                  <div className="all-page-container">
                    <DocumentView url={preSignedDownloadURL} />
                    <div
                      style={{
                        bottom: "0px"
                      }}
                    >
                      <Checkbox
                        name="isChecked"
                        label={intl.formatMessage({
                          id: "agreeToAcceptTermsOfService"
                        })}
                        disabled={preSignedDownloadURL ? false : true}
                        onChange={(e: any) => {
                          e.target.value = e.target.checked;
                          handleChange(e);
                        }}
                      />
                      <br />
                      {preSignedDownloadURL && (
                        <Button
                          type="link"
                          label="Download file"
                          onClick={handleDownloadFile}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Spin>
            ) : (
              <BookMeeting loadBookMeeting />
            )}
          </>
        }
      />
    </>
  );
};
