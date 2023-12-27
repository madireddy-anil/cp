/* eslint-disable */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { store } from "../../../../redux/store";
import { useUpdateScreeningInfoMutation } from "../../../../services/gppService";
import { useAppDispatch } from "../../../../redux/hooks/store";
import { updateScreeningResponse } from "../../../../config/idvScreening/idvScreeningSlice";

import { selfiePublisherEvents } from "../ConfirmOwnerShipForm";
import { getFormattedDocType } from "../Transformer";

declare const window: any;

const Selfie: React.FC = () => {
  let navigate = useNavigate();
  const state = store.getState();
  const dispatch = useAppDispatch();
  const {
    userId,
    onSubmitOwnerShipValues,
    frontPageDocument,
    backPageDocument
  } = state.idvScreening;
  const { selectedDoc } = onSubmitOwnerShipValues;

  const [unUsed] = useState(false);

  const [updateScreeningData] = useUpdateScreeningInfoMutation();

  useEffect(() => {
    const Module = {
      onRuntimeInitialized: function () {
        if (window.cv instanceof Promise) {
          window.cv.then((target: any) => {
            window.cv = target;
            sdkStart();
          });
        } else {
          sdkStart();
        }
      }
    };
    Module.onRuntimeInitialized();
  }, []);

  const sdkStart = () => {
    const target = document.querySelector("#target");
    if (unUsed) target;
    // @ts-ignore . A // @ts-
    const VDAlive = makeVDAliveWidget();
    VDAlive({
      targetSelector: "#target",
      pathModels: "js/public/models",
      infoUserInitShow: true,
      reviewImage: true,
      closeButton: true,
      logEventsToConsole: false
    });

    const selefie = (event: any) => {
      if (event) {
        navigate("/screening-response");
        const base64Result = event.detail.image.split(",")[1];
        updateUserInfromation(base64Result);
      }
    };

    document.addEventListener(
      selfiePublisherEvents.faceDetection,
      selefie,
      false
    );
  };

  const updateUserInfromation = async (selfieImage: string) => {
    const userData: any =
      Object.entries(onSubmitOwnerShipValues)?.length > 0 &&
      onSubmitOwnerShipValues;
    const selectedDocType =
      selectedDoc !== undefined && getFormattedDocType(selectedDoc?.type);
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
        documentType: selectedDocType,
        frontPageOfDocument: frontPageDocument,
        backPageOfDocument: backPageDocument,
        selfie: selfieImage,
        documentsSubmissionType: "sdk"
      },
      userId
    };
    try {
      await updateScreeningData(data).unwrap();
    } catch (err) {
      dispatch(updateScreeningResponse(false));
    }
  };

  return (
    <main>
      <div id="target">take a selfie</div>
    </main>
  );
};

export { Selfie as default };
