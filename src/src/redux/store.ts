import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers
} from "@reduxjs/toolkit";

import { setupListeners } from "@reduxjs/toolkit/query";
import localeReducer from "../config/i18n/localeSlice";
import createSagaMiddleware from "redux-saga";

import sagas from "./sagas";

/**
 *
 *  Service imports
 *
 */
import { api } from "../services/authService";
import { accountApi } from "../services/accountService";
import { countriesApi } from "../services/countriesService";
import { currenciesApi } from "../services/currencies";
import { gppApi } from "../services/gppService";
import { documentUploadApi } from "../services/documentUploadService";
import { routesApi } from "../services/routesService";
import { newPaymentApi } from "../services/newPaymentService";
import { termsOfServiceDocumentApi } from "../services/termsOfServiceDocumentService";
import { orgApi } from "../services/orgService";
import { paymentApi } from "../services/paymentService";
import uploadReducer from "../config/upload/uploadSlice";

/**
 *
 *  Slice imports
 *
 */
import authReducer from "../config/auth/authSlice";
import generalReducer from "../config/general/generalSlice";
import companyReducer from "../config/company/companySlice";
import accountReducer from "../config/account/accountSlice";
import idvScreeningReducer from "../config/idvScreening/idvScreeningSlice";
import rememberReducer from "../config/auth/rememberMeSlice";

import companyInformationReducer from "../config/company/companyInformationSlice";
import companyRequirementsReducer from "../config/company/companyRequirementsSlice";
import operationalInformationReducer from "../config/company/operationalInformationSlice";
import regulatoryInformationReducer from "../config/company/regulatoryInformationSlice";
import countriesReducer from "../config/countries/countriesSlice";
import currenciesReducer from "../config/currencies/currenciesSlice";
import tradeReducer from "../config/trades/tradeSlice";
import beneficiaryReducer from "../pages/Components/Beneficiary/BeneficiarySlice";
import depositAmountReducer from "../pages/Components/DepositAmount/DepositAmountSlice";
import selectAccountReducer from "../pages/Components/AccountSelection/AccountSelectionSlice";
import documentUploadReducer from "../config/document/documentSlice";
import peopleReducer from "../config/people/peopleSlice";
import paymentReducer from "../pages/Payments/PaymentSlice";
import pricingReducer from "../config/pricing/pricingSlice";
import termsOfServiceDocumentReducer from "../config/auth/termsOfServiceDocumentSlice";
import accountSettingReducer from "../config/accountSetting/accountSettingSlice";
import onBoardingSliceReducer from "../config/onBoarding/onBoardingSlice";
import userManagementSliceReducer from "../config/userManagement/userManagementSlice";
import orgReducer from "../config/organisation/organisationSlice";
import approvalReducer from "../config/approval/approvalSlice";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";
import { tradeApi } from "../services/tradesService";
import { beneficiaryApi } from "../services/beneficiaryService";

// persistor configuration

import {
  authPersistConfig,
  tradesPersistConfig,
  persistConfig,
  peoplePersistConfig,
  CompanyInfoPersistConfig,
  documentsPersistConfig
} from "./persistorConfiguration";
import { revokeTokenApi } from "../services/tokenService";
import storage from "redux-persist/lib/storage";
import { userLogoutAction } from "../config/general/actions";
import indicativeRateReducer from "../config/rate/indicativeRateSlice";
import { orgTokenApi } from "../services/orgTokenService";

const sagaMiddleware = createSagaMiddleware();

const appReducer = combineReducers({
  // reducers and persistor
  auth: persistReducer(authPersistConfig, authReducer),
  trades: persistReducer(tradesPersistConfig, tradeReducer),
  indicativeRate: persistReducer(tradesPersistConfig, indicativeRateReducer),
  people: persistReducer(peoplePersistConfig, peopleReducer),
  documentUpload: persistReducer(documentsPersistConfig, documentUploadReducer),
  companyInformation: persistReducer(
    CompanyInfoPersistConfig,
    companyInformationReducer
  ),

  // reducers apis
  [api.reducerPath]: api.reducer,
  [countriesApi.reducerPath]: countriesApi.reducer,
  [currenciesApi.reducerPath]: currenciesApi.reducer,
  [tradeApi.reducerPath]: tradeApi.reducer,
  [revokeTokenApi.reducerPath]: revokeTokenApi.reducer,
  [gppApi.reducerPath]: gppApi.reducer,
  [beneficiaryApi.reducerPath]: beneficiaryApi.reducer,
  [accountApi.reducerPath]: accountApi.reducer,
  [documentUploadApi.reducerPath]: documentUploadApi.reducer,
  [routesApi.reducerPath]: routesApi.reducer,
  [newPaymentApi.reducerPath]: newPaymentApi.reducer,
  [termsOfServiceDocumentApi.reducerPath]: termsOfServiceDocumentApi.reducer,
  [orgTokenApi.reducerPath]: orgTokenApi.reducer,
  [orgApi.reducerPath]: orgApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  // reducers
  remember: rememberReducer,
  locale: localeReducer,
  beneficiary: beneficiaryReducer,
  depositAmount: depositAmountReducer,
  selectAccount: selectAccountReducer,
  general: generalReducer,
  company: companyReducer,
  countries: countriesReducer,
  idvScreening: idvScreeningReducer,
  companyRequirements: companyRequirementsReducer,
  operationalInformation: operationalInformationReducer,
  regulatoryInformation: regulatoryInformationReducer,
  account: accountReducer,
  payment: paymentReducer,
  pricing: pricingReducer,
  currencies: currenciesReducer,
  termsOfServiceDocument: termsOfServiceDocumentReducer,
  accountSetting: accountSettingReducer,
  onBoarding: onBoardingSliceReducer,
  userManagement: userManagementSliceReducer,
  organisation: orgReducer,
  approval: approvalReducer,
  upload: uploadReducer
});

// const middleware = [getDefaultMiddleware({ thunk: false }), sagaMiddleware];

//* Reset the local storage items
const rootReducer = (state: any, action: any) => {
  if (action.type === userLogoutAction) {
    // this applies to all keys defined in persistConfig(s)
    storage.removeItem(`persist:${persistConfig.key}`);
    storage.removeItem(`persist:${authPersistConfig.key}`);
    storage.removeItem(`persist:${tradesPersistConfig.key}`);
    storage.removeItem(`persist:${peoplePersistConfig.key}`);
    storage.removeItem(`persist:${documentsPersistConfig.key}`);
    storage.removeItem(`persist:${CompanyInfoPersistConfig.key}`);

    state = {} as RootState;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      ...sagaMiddleware,
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          "CREATE_PRESIGNED_URL",
          "CREATE_PRESIGNED_URL_SUCCESS",
          "UPLOAD_FILE",
          "UPLOAD_FILE_SUCCESS"
        ]
      }
    }).concat(
      api.middleware,
      countriesApi.middleware,
      currenciesApi.middleware,
      accountApi.middleware,
      tradeApi.middleware,
      gppApi.middleware,
      documentUploadApi.middleware,
      beneficiaryApi.middleware,
      routesApi.middleware,
      revokeTokenApi.middleware,
      paymentApi.middleware,
      orgApi.middleware,
      sagaMiddleware
    ),
  devTools: process.env.REACT_ENV !== "prd"
});

sagaMiddleware.run(sagas);

//Setup Listeners https://redux-toolkit.js.org/rtk-query/api/setupListeners
// To be able to have onFocusRefetch

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
