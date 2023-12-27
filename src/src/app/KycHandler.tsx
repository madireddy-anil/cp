import React, { useMemo } from "react";
import { AuthContext } from "@payconstruct/orbital-auth-provider";
import { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks/store";
import { getClient } from "../services/termsOfService/actions";
import {
  showApplicationApproved,
  updateNewVersionExist
} from "../config/auth/termsOfServiceDocumentSlice";
import { TermsOfService } from "../components/Modals/TermsOfService/TermsOfService";
import { AccountReady } from "../components/Modals/AccountReady/AccountReady";
import { OnboardNewEntity } from "../components/Modals/OnboardNewEntity/OnboardNewEntityModal";
import { Spin } from "@payconstruct/design-system";
import { useLocation, useNavigate } from "react-router-dom";

const KYCHandler: React.FC = ({ children }) => {
  const { token, orgId, listOfOrganizations } = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  //! KYC logic
  const appLoading = useAppSelector((state) => state.auth.isLoading);
  const email = useAppSelector((state) => state.auth.email);
  const kycStatus = useAppSelector((state) => state.company.kycStatus);
  const termsOfService = useAppSelector((state) => state.auth.termsOfService);
  const prevLocation = useAppSelector((state) => state.auth.prevLocation);

  // console.log(
  //   "%c Loading App ",
  //   "background-color: purple; color: white;",
  //   appLoading
  // );

  const showAccountReadyModal = useAppSelector(
    (state) => state.termsOfServiceDocument.showAccountReadyModal
  );
  const allTermsOfService = useAppSelector(
    (state) => state.termsOfServiceDocument?.legalAgreements
  );

  const [showTermsOfServiceModal, setShowTermsOfServiceModal] = useState(false);

  const showOnboardModal = useAppSelector(
    (state) => state.onBoarding.showModal
  );

  const versionId = useMemo(() => {
    return termsOfService?.find((version: any) => version?.versionId);
  }, [termsOfService]);

  const listOfPeoples = useAppSelector((state) => state.people.listOfPeoples);
  const person = listOfPeoples.find((people: any) => people?.email === email);

  useEffect(() => {
    if (kycStatus === "pass") {
      navigate(prevLocation || "/");
      if (
        person &&
        kycStatus !== null &&
        kycStatus === "pass" &&
        person?.isAuthorisedToAcceptTerms &&
        !versionId
      ) {
        // ** setShowTermsOfServiceModal(true);

        setShowTermsOfServiceModal(false);
      }
      if (!person && kycStatus !== null && kycStatus === "pass" && !versionId) {
        // ** dispatch(showApplicationApproved(true));

        dispatch(showApplicationApproved(false));
      }
      if (kycStatus !== null && kycStatus === "pass" && versionId) {
        // ** dispatch(showApplicationApproved(false));
        // ** setShowTermsOfServiceModal(false);

        dispatch(showApplicationApproved(false));
        setShowTermsOfServiceModal(false);
      }
      if (
        person &&
        kycStatus !== null &&
        kycStatus === "pass" &&
        !person?.isAuthorisedToAcceptTerms &&
        !versionId
      ) {
        // ** dispatch(showApplicationApproved(true));

        dispatch(showApplicationApproved(false));
      }
    }
  }, [kycStatus, versionId, person, dispatch]);

  useEffect(() => {
    kycStatus && kycStatus !== "pass" && navigate("/account-setup");
  }, [location, kycStatus]);

  useEffect(() => {
    if (termsOfService || allTermsOfService || person) {
      const existingVersion =
        termsOfService?.length > 0 &&
        termsOfService?.reduce((a: any, b: any) =>
          a.timeAccepted > b.timeAccepted ? a : b
        );
      const allVersions =
        allTermsOfService.length > 0 &&
        allTermsOfService.reduce((a: any, b: any) =>
          a.updatedAt > b.updatedAt ? a : b
        );
      if (
        // when new version updated show new terms--
        kycStatus !== null &&
        kycStatus === "pass" &&
        versionId &&
        allVersions?.versionNo > existingVersion?.versionNo
      ) {
        person?.isAuthorisedToAcceptTerms &&
          // ** setShowTermsOfServiceModal(true);
          // ** dispatch(showApplicationApproved(false));
          // ** dispatch(updateNewVersionExist(true));

          setShowTermsOfServiceModal(false);
        dispatch(showApplicationApproved(false));
        dispatch(updateNewVersionExist(false));
      } else {
        // **  dispatch(updateNewVersionExist(false));
        dispatch(updateNewVersionExist(false));
      }
    }
  }, [
    termsOfService,
    allTermsOfService,
    person,
    kycStatus,
    dispatch,
    versionId
  ]);

  useEffect(() => {
    if (token) {
      const entityId = listOfOrganizations?.find(
        (org) => org.organisationId === orgId
      );

      if (entityId)
        dispatch(
          getClient(
            {
              clientId: entityId?.entityId,
              token: token
            },
            location.pathname === "/account-setup"
              ? undefined
              : location.pathname
          )
        );
    }
  }, [token, orgId, listOfOrganizations, dispatch]);

  if (appLoading)
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Spin />
      </div>
    );

  return (
    <div style={{ width: "100%" }}>
      {showTermsOfServiceModal && (
        <TermsOfService
          legalAgreements={allTermsOfService}
          show={showTermsOfServiceModal}
        />
      )}
      <AccountReady show={showAccountReadyModal} />

      {showOnboardModal && <OnboardNewEntity show={showOnboardModal} />}
      {children}
    </div>
  );
};

export { KYCHandler };
