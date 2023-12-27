import { Notification } from "@payconstruct/design-system";
import { NewBeneForm } from "./Typings";

export const addNewBeneForm = async (
  formData: NewBeneForm,
  entityId: string
) => {
  const {
    requestedAccountType,
    country,
    bankCountry,
    currency,
    nameOnAccount,
    accountNumber,
    iban,
    bic,
    branchCode,
    buildingNumber,
    zipOrPostalCode,
    stateOrProvince,
    street,
    city,
    bankName,
    intermediaryBank,
    mainCurrency
  } = formData;

  return {
    entityId,
    beneficiaryDetails: {
      type: requestedAccountType,
      nameOnAccount,
      address: {
        country,
        buildingNumber,
        zipOrPostalCode,
        stateOrProvince,
        city,
        street
      }
    },
    currency,
    mainCurrency,
    status: "new",
    accountDetails: {
      branchCode,
      bankName,
      nameOnAccount,
      accountNumber,
      bic,
      iban,
      bankCountry,
      intermediaryBank
    },
    isDeleted: false
  };
};

export const onSuccessAddNewBeneMsg = () =>
  Notification({
    message: "New Beneficiary",
    description: "New Beneficiary Created Successfully!",
    type: "success"
  });

export const onFailAddNewBeneMsg = (err: string) =>
  Notification({
    message: "New Beneficiary Rejected",
    description: err ?? "Create new beneficiary error",
    type: "error"
  });
