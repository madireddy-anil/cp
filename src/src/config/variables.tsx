const environment = process.env.REACT_APP_ENV || "tst";
const authDomain = process.env.REACT_APP_AUTH0_DOMAIN;
const authApiUrl = process.env.REACT_APP_AUTH_API_URL;
const tradeApiUrl = process.env.REACT_APP_TRADES_API_URL;
const routesApiUrl = process.env.REACT_APP_ROUTES_API_URL;
const paymentUrl = process.env.REACT_APP_PAYMENT_API_URL;
const cmsServiceUrl = process.env.REACT_APP_CMS_API_URL;
const gppUrl = process.env.REACT_APP_GPP_API_URL;
const beneficiaryApiUrl = process.env.REACT_APP_BENEFICIARY_API_URL;
const financeApiUrl = process.env.REACT_APP_FINANCE_API_URL;
const termsOfServiceDocumentUrl = process.env.REACT_APP_TERMS_SERVICES_DOC_URL;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || "";
const audience = process.env.REACT_APP_AUTH0_AUDIENCE || "";
const domain = process.env.REACT_APP_AUTH0_DOMAIN || "";
const redirectionUrl =
  process.env.REACT_APP_AUTH0_REDIRECTION_URL ||
  "http://localhost:3000/verify-authorization";
const auth0Scope =
  process.env.REACT_APP_AUTH0_SCOPE ||
  "openid profile email address phone offline_access enroll read:authenticators remove:authenticators";
const logoutUrl =
  process.env.REACT_APP_LOGOUT_URL || "http://localhost:3000/login";
const revokeTokenUrl = process.env.REACT_APP_REVOKE_TOKEN_API_URL;

const chatSupportUrl = process.env.REACT_APP_CHAT_API_URL;
const pusherAppId = process.env.REACT_APP_PUSHER_APP_ID || "";
const pusherCluster = process.env.REACT_APP_PUSHER_CLUSTER;
const chatChannel =
  process.env.REACT_APP_CHAT_CHANNEL || "orbital_chat_support_channel";
const userMetaData = "https://app.eu.payconstruct.com";
const approvalUrl = process.env.REACT_APP_APPROVAL_API_URL;
const persistEncryptKey =
  process.env.REACT_PERSIST_ENCRYPT_KEY || "orbital_client_connect_platform";

const uploadFilesApiUrl = process.env.REACT_APP_UPLOAD_FILES_API_URL;

const manualAccessedEntityIds = [
  "cccc5da0-ef44-429c-abad-eaf5ad00e8e1",
  "7ddaa4da-d52b-49a2-a236-5b099466ee09", // test RMZ pvt ltd in TST environment
  "25d30388-2979-4f34-ad31-42b950b1763e" // Test Company Limited in PRD environment
];

const launchDarklyKey = process.env.REACT_APP_LAUNCH_DARKLY_KEY || "";
const authProviderKey = process.env.REACT_APP_AUTH_KEY || "";

const featureFlagUrl =
  process.env.REACT_APP_FEATURE_FLAG_URL || "https://flags.tst.paymero.io";

const flags = {
  showCryptoCommerceUI: "PMCR-730",
  showNewPaymentFlow: "PTPFX-99",
  showPayments: "PTPFX-114",
  showUploadFiles: "PTCRUP-1",
  showConversionsUI: "conversion-ui",
  showConversionsDashboardUI: "conversions-dashboard",
  showReceivables: "PMCR-1394",
  showAPIKeys: "PMCR-1382",
  showApprovalQueue: "PMCR-1519"
};

const mixPanelsKey = process.env.REACT_APP_MIX_PANELS || "";

export {
  environment,
  authDomain,
  authApiUrl,
  cmsServiceUrl,
  tradeApiUrl,
  routesApiUrl,
  gppUrl,
  beneficiaryApiUrl,
  financeApiUrl,
  termsOfServiceDocumentUrl,
  clientId,
  audience,
  domain,
  redirectionUrl,
  auth0Scope,
  logoutUrl,
  revokeTokenUrl,
  chatSupportUrl,
  pusherAppId,
  pusherCluster,
  chatChannel,
  userMetaData,
  approvalUrl,
  manualAccessedEntityIds,
  paymentUrl,
  persistEncryptKey,
  uploadFilesApiUrl,
  featureFlagUrl,
  flags,
  launchDarklyKey,
  authProviderKey,
  mixPanelsKey
};
