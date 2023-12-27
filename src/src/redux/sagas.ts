import { all } from "redux-saga/effects";
import termsOfService from "../services/termsOfService/saga";
import approvalService from "../services/approvalService/saga";
import uploadService from "../services/Upload/saga";

export default function* rootSaga() {
  yield all([termsOfService(), approvalService(), uploadService()]);
}
