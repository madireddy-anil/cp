import { all, takeLatest, put, call, select, delay } from "redux-saga/effects";
import axiosMethod from "../../utilities/apiCaller";

import actions from "./actions";
import { Currency } from "../currencies";

const { cmsPrivateGet } = axiosMethod;

const getCurrencies = (token: string) => {
  const api = {
    endpoint: "currencies",
    token: token
  };
  return cmsPrivateGet(api).then((response) => response.data);
};

export function* getAllCurrencies(values: any) {
  const { token } = values;
  try {
    const response: Currency = yield call(getCurrencies, token);
    yield put({
      type: actions.GET_CURRENCIES_SUCCESS,
      payload: response
    });
  } catch (err) {
    yield put({
      type: actions.GET_CURRENCIES_FAILURE,
      payload: JSON.stringify(err)
    });
  }
}

const getCountries = (token: string) => {
  const api = {
    endpoint: "currencies",
    token: token
  };
  return cmsPrivateGet(api).then((response) => response.data);
};

export function* getAllCountries(values: any) {
  const { token } = values;
  try {
    const response: Currency = yield call(getCountries, token);
    yield put({
      type: actions.GET_COUNTRIES_SUCCESS,
      payload: response
    });
  } catch (err) {
    yield put({
      type: actions.GET_COUNTRIES_FAILURE,
      payload: JSON.stringify(err)
    });
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.GET_CURRENCIES, getAllCurrencies)]);
  yield all([takeLatest(actions.GET_COUNTRIES, getAllCountries)]);
}
