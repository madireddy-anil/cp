import { api as apiUrl } from "./authService";

export interface CompanyReqPost {
  category?: string;
  category_key?: string;
  category_id?: string;
  clientId: string | null;
  data: any;
}

export interface ProductResponse {
  data: {
    brands: { [key: string]: any };
  };
}

export interface CustomerInfoResponse {
  data: {
    id: string;
    termsOfService: any[];
    brands: [
      {
        products: any[];
      }
    ];
    requiredProduct: any[];
    documentsComment: any[];
    entityType: string;
    externalScreeningResult: string;
    genericInformation: {
      registeredCompanyName: string;
      tradingName: string;
      companyNumber: string;
      companyType: string;
      tier: string;
      parentId: string;
      countryOfIncorporation: string;
      isParent: string;
      hasPartnerCompanies: string;
      addresses: any[];
      websiteAddress: any[];
      linkedCompanyIds: any[];
      industries: any[];
    };
    kycInformation: {
      kycRefreshInformation: {
        questions: {
          isExpectedChanges: boolean;
        };
      };
      kycStatus: string;
    };
    profile: { [key: string]: any };
    progressLogs: { [key: string]: boolean };
    regulatoryDetails: {
      licenses: [
        {
          id: string;
          documentId: string;
          licenseType: string;
          licenseHolderName: string;
          licenseNumber: string;
          regulatedCountry: string;
          regulatoryLicenseShared: boolean;
          reason: string;
          comments: string;
        }
      ];
      licenseHolderName: string;
      transactionMonitor: boolean;
      amlPolicyDetails: {
        amlPolicyShared: boolean;
        comments: string;
      };
      isOperatingInRiskCountries: boolean;
      subjectToRegulatoryEnforcement: boolean;
      flowOfFundsComment: string;
      reasonForUsingOurServices: string;
      majorityClientBase: string;
      majorityClientJurisdiction: any[];
    };
    operationsDetails: {
      ecommercePayments: {
        deposits_payins: [
          {
            id: string;
            currency: string;
            monthlyNumberOfTransactions: string | number;
            monthlyValueOfTransactions: string | number;
            averageSingleTransactionValue: string | number;
          }
        ];
        payouts: [
          {
            id: string;
            currency: string;
            monthlyNumberOfTransactions: string | number;
            monthlyValueOfTransactions: string | number;
            averageSingleTransactionValue: string | number;
          }
        ];
      };
      exoticFx: { exoticFxCurrencyPairs: any[] };
      fx: { fxCurrencyPairs: any[] };
      globalAccounts: {
        inbound: any[];
        outbound: any[];
      };
    };
    riskCategory: string;
  };
}

export interface QuestionsRequest {
  category: string;
  holdLicense: boolean | undefined;
}
export interface QuestionsResponse {
  status: string;
  data: { [key: string]: any };
  message: string;
}

export interface OperationQusReq {
  category: string;
  // product: string;
}
export interface OperationQusRes {
  status: string;
  data: {
    ecommerce_payments: {
      deposits: any[];
      payouts: any[];
    };
    exotix_fx: any[];
    foreign_exchange: any[];
    global_accounts: {
      inbound: any[];
      outbound: any[];
    };
  };
  message: string;
}

export interface CompaniesRsponse {
  data: {
    entities: any[];
    total: number;
  };
}

export interface ClientRequestProps {
  clientId: string;
  selectedEntityId: string;
  token: string | null;
}

export const api = apiUrl.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductResponse, any>({
      query: () => {
        return {
          url: `brands?limit=0`,
          method: "GET"
        };
      }
    }),
    createClientInfo: builder.mutation<
      CustomerInfoResponse,
      Pick<CompanyReqPost, "clientId"> & Partial<CompanyReqPost>
    >({
      query: ({ clientId, category, category_key, ...patch }) => {
        const categoryName = category ? `/${category}` : "";
        const categoryKey = category_key ? `/${category_key}` : "";
        return {
          url: `entities/clients/${clientId}${categoryName}${categoryKey}`,
          method: "POST",
          body: patch.data
        };
      }
    }),
    updateClientInfo: builder.mutation<
      CustomerInfoResponse,
      Pick<CompanyReqPost, "clientId"> & Partial<CompanyReqPost>
    >({
      query: ({ clientId, category, category_key, category_id, ...patch }) => {
        const categoryName = category ? `/${category}` : "";
        const categoryId = category_id ? `/${category_id}` : "";
        const categoryKey = category_key ? `/${category_key}` : "";
        return {
          url: `entities/clients/${clientId}${categoryName}${categoryKey}${categoryId}`,
          method: "PUT",
          body: patch.data
        };
      }
    }),
    deleteClientInfo: builder.mutation<
      CustomerInfoResponse,
      Pick<CompanyReqPost, "clientId"> & Partial<CompanyReqPost>
    >({
      query: ({ clientId, category, category_key, category_id }) => {
        const categoryName = category ? `/${category}` : "";
        const categoryId = category_id ? `/${category_id}` : "";
        const categoryKey = category_key ? `/${category_key}` : "";
        return {
          url: `entities/clients/${clientId}${categoryName}${categoryKey}${categoryId}`,
          method: "DELETE"
        };
      }
    }),
    getCustomerInfo: builder.query<
      CustomerInfoResponse,
      { clientId: string; key?: any }
    >({
      query: (arg) => {
        const { clientId } = arg;
        return {
          url: `entities/clients/${clientId}`,
          method: "GET"
        };
      },
      keepUnusedDataFor: 2
    }),
    getQuestionsByCategory: builder.query({
      query: (params) => {
        return {
          url: `questions?category=${params.category}&holdLicense=${params.holdLicense}`,
          method: "GET"
        };
      }
    }),
    getOperationQuestionsByCategory: builder.query<
      OperationQusRes,
      OperationQusReq
    >({
      query: (params) => {
        return {
          url: `questions?category=${params.category}`,
          method: "GET"
        };
      }
    }),
    getAllCompanies: builder.query<CompaniesRsponse, any>({
      query: () => {
        return {
          url: `entities/companies?limit=0`,
          method: "GET"
        };
      }
    })
  }),
  overrideExisting: true
});

export const {
  useGetProductsQuery,
  useUpdateClientInfoMutation,
  useGetCustomerInfoQuery,
  useGetQuestionsByCategoryQuery,
  useGetOperationQuestionsByCategoryQuery,

  useCreateClientInfoMutation,
  useDeleteClientInfoMutation,
  useGetAllCompaniesQuery
} = api;
