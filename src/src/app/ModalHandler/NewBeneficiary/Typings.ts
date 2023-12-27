export const BeneficiaryType = {
  COMPANY: "business",
  INDIVIDUAL: "individual"
} as const;

export interface TypeOfBeneficiary {
  currency: string;
}

export interface NewBeneficiaryModalProps {
  type?: "business" | "individual";
  currency?: string;
  country?: string;
}

export type BeneType = NonNullable<NewBeneficiaryModalProps["type"]>;

export type FormFields = FormField[];
export type FormField = {
  isRequired: boolean;
  labelName: string;
  message: string;
  regex: RegExp;
  schemaName: string;
  type: "input" | "select";
};

export type MemoizedFormFields = {
  [key in BeneType]: {
    [key: string]: FormFields;
  };
};

export const accountTypeOptions = (
  Object.keys(BeneficiaryType) as Array<keyof typeof BeneficiaryType>
).map((key) => ({
  label: key,
  value: BeneficiaryType[key]
}));

export type NewBeneForm = {
  requestedAccountType: string;
  country: string;
  bankCountry: string;
  currency: string;
  nameOnAccount: string;
  accountNumber: string;
  iban: string;
  bic: string;
  branchCode: string;
  buildingNumber: string;
  zipOrPostalCode: string;
  stateOrProvince: string;
  street: string;
  city: string;
  bankName: string;
  intermediaryBank: string;
  mainCurrency: string;
};
