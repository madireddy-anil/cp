import {
  Authorizer,
  LoginWithRedirect
} from "@payconstruct/orbital-auth-provider";
import { lazy } from "react";
import PageNotFound from "../../pages/4xx/404";

// const Authorization = lazy(
//   () => import("../../pages/Authorization/Authorization")
// );

const ConfirmOwnerShipIdentity = lazy(
  () => import("../../pages/Onboarding/IdvScreening/ConfirmOwnerShip")
);
const ScanDocuments = lazy(
  () => import("../../pages/Onboarding/IdvScreening/Documents/ScanDocuments")
);
const Selfie = lazy(
  () => import("../../pages/Onboarding/IdvScreening/Documents/Selfie")
);
const IdvScreeningResponse = lazy(
  () => import("../../pages/Onboarding/IdvScreening/ScreeningResponse")
);
const IdvUploadDocuments = lazy(
  () => import("../../pages/Onboarding/IdvScreening/Documents/UploadDocuments")
);

export const PublicRoute = [
  {
    path: "*",
    exact: false,
    element: () => <PageNotFound />
  },
  {
    path: "/login",
    exact: true,
    element: () => <LoginWithRedirect portal="cms" prompt="login" />
  },
  {
    path: "/signup",
    exact: true,
    element: () => <LoginWithRedirect portal="cms" prompt="login" />
  },
  {
    path: "/password_reset",
    exact: true,
    element: () => <LoginWithRedirect portal="cms" prompt="login" />
  },
  {
    path: "/verify-authorization",
    exact: true,
    // element: () => <Authorization />
    element: () => <Authorizer />
  },
  {
    path: "/screening-confirm-ownership-identity",
    exact: true,
    element: () => <ConfirmOwnerShipIdentity />
  },
  {
    path: "/screening-scan-documents",
    exact: true,
    element: () => <ScanDocuments />
  },
  {
    path: "/screening-verify-selfie",
    exact: true,
    element: () => <Selfie />
  },
  {
    path: "/screening-response",
    exact: true,
    element: () => <IdvScreeningResponse />
  },
  {
    path: "/screening-upload-documents",
    exact: true,
    element: () => <IdvUploadDocuments />
  }
] as RouteProps[];
