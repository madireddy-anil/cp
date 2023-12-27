import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { store } from "../../../../redux/store";
import { useAppDispatch } from "../../../../redux/hooks/store";

import {
  updateFrontPageOfScannedDoc,
  updateBackPageOfScannedDoc
} from "../../../../config/idvScreening/idvScreeningSlice";

import { documentsPublisherEvents } from "../ConfirmOwnerShipForm";

declare const window: any;

const ScanDocuments: React.FC = () => {
  const state = store.getState();
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { onSubmitOwnerShipValues } = state.idvScreening;
  const { selectedDoc } = onSubmitOwnerShipValues;

  const [unUsed] = useState(false);

  useEffect(() => {
    const onRuntimeInitialized = () => {
      if (window.cv instanceof Promise) {
        window.cv.then((target: any) => {
          window.cv = target;
          window.history.forward();
          sdkStart(window);
        });
      } else {
        sdkStart(window);
      }
    };
    onRuntimeInitialized();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sdkStart = async (window: any) => {
    const VDDocument = window.makeVDDocumentWidget();
    if (selectedDoc.type !== "Passport") {
      const result = await VDDocument({
        targetSelector: "#target",
        infoAlertShow: true,
        reviewImage: true,
        documents: [selectedDoc.code],
        logEventsToConsole: false,
        obverseDetection: "VDDocument_reverseDetection",
        reverseDetection: "VDDocument_reverseDetection",
        manualCaptureTextMobile: "yes",
        fontSize: 11
      });
      if (unUsed) console.log(result);
    } else {
      const result = await VDDocument({
        targetSelector: "#target",
        infoAlertShow: true,
        reviewImage: true,
        passport: [selectedDoc.code],
        logEventsToConsole: false,
        obverseDetection: "VDDocument_reverseDetection",
        reverseDetection: "VDDocument_reverseDetection",
        manualCaptureTextMobile: "yes",
        fontSize: 11
      });
      if (unUsed) console.log(result);
    }

    const documentFrontPage = (event: any) => {
      if (event) {
        const base64Result = event.detail.split(",")[1];
        dispatch(updateFrontPageOfScannedDoc(base64Result));
      }
      if (selectedDoc.type !== undefined && selectedDoc.type === "Passport") {
        navigate("/screening-verify-selfie");
      }
    };

    const documentBackPage = (event: any) => {
      if (event) {
        const base64Result = event.detail.split(",")[1];
        dispatch(updateBackPageOfScannedDoc(base64Result));
        navigate("/screening-verify-selfie");
      }
    };

    document.addEventListener(
      documentsPublisherEvents.obverseDetection,
      documentFrontPage,
      false
    );
    document.addEventListener(
      documentsPublisherEvents.reverseDetection,
      documentBackPage,
      false
    );
  };

  return (
    <main>
      <div id="target">ID</div>
    </main>
  );
};

export { ScanDocuments as default };
