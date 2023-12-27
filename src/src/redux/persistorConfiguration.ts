import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import { persistEncryptKey } from "../config/variables";

// CP stands for Client Portal, use CP before any persist key
// to not persist data from Control Center(CC) by mistake

const encryptor = encryptTransform({
  secretKey: persistEncryptKey
});

export const persistConfig = {
  key: "cp",
  version: 1,
  storage,
  blacklist: ["auth", "account", "accountApi", "featureFlag"],
  transforms: [encryptor]
};

// Don't Persist MFA Token after Refresh
export const authPersistConfig = {
  key: "cp-auth",
  storage,
  blacklist: ["showMFAModal", "mfa_token", "portal"],
  transforms: [encryptor]
};

// Don't Persist Deposit data
export const tradesPersistConfig = {
  key: "cp-trades",
  storage,
  blacklist: ["deposit", "list", "something", "currentPageList"],
  transforms: [encryptor]
};

// Don't Persist People data
export const peoplePersistConfig = {
  key: "cp-people",
  storage,
  blacklist: ["people"],
  transforms: [encryptor]
};

// Don't Persist Documents data
export const documentsPersistConfig = {
  key: "cp-documents",
  storage,
  blacklist: ["documentUpload"],
  transforms: [encryptor]
};

// Don't Persist Company Information data
export const CompanyInfoPersistConfig = {
  key: "cp-company",
  storage,
  blacklist: ["companyInformation"],
  transforms: [encryptor]
};
