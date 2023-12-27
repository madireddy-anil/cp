import { all, takeLatest, put, call } from "redux-saga/effects";

import axiosMethod from "../../utilities/apiCaller";
import { setClientInfoSuccess } from "../../config/auth/authSlice";
import { setLegalAgreementsSuccess } from "../../config/auth/termsOfServiceDocumentSlice";
import { setPeopleSuccess } from "../../config/people/peopleSlice";
import { CustomerInfoResponse } from "../../services/companyService";
import { TermsOfServicesResponse } from "../../services/authService";
import { verificationPeoplesRes } from "../../services/peopleService";

import actions from "./actions";

const { authPrivateGet } = axiosMethod;

const getClientInfoById = (values: any) => {
  const { clientId, token, selectedEntityId } = values;
  const api = {
    endpoint: `entities/clients/${clientId}`,
    token: token,
    selectedEntityId: selectedEntityId
  };
  return authPrivateGet(api).then((response) => {
    return response.data.data;
  });
};

export function* getClientInfo(values: any) {
  try {
    const response: CustomerInfoResponse = yield call(
      getClientInfoById,
      values.values
    );
    yield put(setClientInfoSuccess({ ...response }));
    yield put({
      type: actions.GET_CLIENT_BY_ID_SUCCESS,
      payload: response
    });
  } catch (err) {
    yield put({
      type: actions.GET_CLIENT_BY_ID_FAILURE,
      payload: err
    });
  }
}

const getPeople = (values: any) => {
  const { token, selectedEntityId } = values;
  const api = {
    endpoint: `people`,
    token: token,
    selectedEntityId: selectedEntityId
  };
  try {
    return authPrivateGet(api).then((response) => {
      return response.data.data;
    });
  } catch (err) {
    console.log(err);
  }
};

export function* getAllPeople(values: any) {
  try {
    const response: verificationPeoplesRes = yield call(
      getPeople,
      values.values
    );
    yield put(setPeopleSuccess({ ...response }));
  } catch (err) {
    yield put({
      type: actions.GET_PEOPLE_SUCCESS_FAILURE,
      payload: err
    });
  }
}

const getTermsOfService = (values: any) => {
  const { token, selectedEntityId } = values;
  const api = {
    endpoint: `terms-of-service?limit=0`,
    token: token,
    selectedEntityId: selectedEntityId
  };
  try {
    return authPrivateGet(api).then((response) => {
      return response.data.data;
    });
  } catch (err) {
    console.log(err);
  }
};

export function* getLegalAgreements(values: any) {
  try {
    const response: TermsOfServicesResponse = yield call(
      getTermsOfService,
      values.values
    );
    yield put(setLegalAgreementsSuccess({ ...response }));
  } catch (err) {
    yield put({
      type: actions.GET_ALL_TERMS_OF_SERVICE_FAILURE,
      payload: err
    });
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.GET_CLIENT_BY_ID, getClientInfo),
    takeLatest(actions.GET_PEOPLE, getAllPeople),
    takeLatest(actions.GET_ALL_TERMS_OF_SERVICE, getLegalAgreements)
  ]);
}
