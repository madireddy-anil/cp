import moment from "moment-timezone";

export const fileDownloader = (
  url: string,
  fileName: string,
  fileType: string
) => {
  const link: HTMLAnchorElement = document.createElement("a");
  link.download = fileName;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const filePreview = (
  url: string,
  fileName: string,
  fileType: string
) => {
  const link: HTMLAnchorElement = document.createElement("a");
  link.download = fileName;
  link.href = url;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const validationOnData = (data: any, label: string) => {
  let returnResp;
  if (label === "array") {
    returnResp =
      data !== undefined && data !== null && data?.length > 0 ? data : [];
  }
  if (label === "string") {
    returnResp = data !== undefined && data !== null && data;
  }
  if (label === "object") {
    returnResp =
      data !== undefined && data !== null && Object.entries(data)?.length > 0
        ? data
        : {};
  }
  return returnResp;
};

export const formatProductsData = (data: any[]) => {
  return data
    .filter((item: any) => item.isActive === true)
    .map((product: any) => {
      return product.productCode;
    });
};

// Question response format
export const getFormatedResponse = (
  questions: any,
  headerRequired: boolean
) => {
  return questions?.map((question: any) => {
    const formatedQuestion = {
      ...question,
      header: question.label,
      type: question.type,
      name: question.schemaFieldName,
      required: question.isMandatory,
      message: question.description,
      options: question.options,
      tooltip: question.toolTip,
      mode: question?.isMultipleSelect ? "multiple" : "single"
    };
    // omitting some properties
    const {
      label,
      isDisabled,
      isMandatory,
      schemaFieldName,
      dbSchema,
      createdAt,
      updatedAt,
      isExternal,
      isHidden,
      linkedCompany,
      toolTip,
      ...rest
    } = formatedQuestion;
    !headerRequired && delete rest?.header;
    !headerRequired && (rest.label = question.label);
    return rest;
  });
};

// update fileName from S3 in currentFileList
export const updateFileNameInCurrentList = (
  fileList: any,
  file: any,
  payloadData: any
) => {
  return fileList.map((fileItem: any) => {
    if (fileItem.uid === file.uid) {
      return {
        ...fileItem,
        fileName: payloadData.fileName
      };
    }
    return fileItem;
  });
};

export const formatGenericInfoForInitialData = (genericInfo: any) => {
  const newObj: any = {};
  genericInfo &&
    (genericInfo?.addresses || []).forEach((item: any) => {
      Object.entries(item).forEach(([key, value]): any => {
        if (item.type === "registered" || !item.type) {
          newObj[key] = value;
        }
        if (item.type === "principal_place_of_business") {
          newObj["principalAddress" + key] = value;
        }
        if (item.type === "postal") {
          newObj["postalAddress" + key] = value;
        }
      });
    });

  const isIndustryExist =
    genericInfo?.industries &&
    genericInfo?.industries[0] &&
    genericInfo.industries[0];

  const returnResp = {
    ...newObj,
    ...genericInfo,
    industry: isIndustryExist?.industryType,
    industryGroup: isIndustryExist?.subType,
    otherComment: isIndustryExist?.comment
  };
  return returnResp;
};

export const formatCountriesListForOptionSet = (countries: any) => {
  return (countries || []).map((item: any) => {
    return [item.alpha2Code, item.name];
  });
};

export const sortData = (a: any, b: any) => {
  const letterA = a.code || a.label || a.name || a.createdAt;
  const letterB = b.code || b.label || b.name || b.createdAt;

  let comparison = 0;
  if (letterA > letterB) {
    comparison = 1;
  } else if (letterA < letterB) {
    comparison = -1;
  }
  return comparison;
};

export const formatDocumentForInitialData = (allFiles: any) => {
  if (allFiles.length > 0 && allFiles !== undefined && allFiles !== null) {
    return (allFiles || []).map((file: any) => {
      const test = Object.assign({}, file, { name: file?.fileName });
      delete test?.fileName;
      return test;
    });
  }
};

export const updateProgressLogOnDocumentsUpload = (
  documents: any[],
  requiredDocuments: any[]
) => {
  const uploadedDocs = (documents || []).filter(
    (doc, index) =>
      documents.findIndex((obj) => obj.documentType === doc.documentType) ===
      index
  );
  let overAllUploadStatus = false;
  if (
    uploadedDocs.length > 0 &&
    uploadedDocs.length === requiredDocuments.length &&
    requiredDocuments.length > 0
  ) {
    overAllUploadStatus = true;
  } else {
    overAllUploadStatus = false;
  }
  return overAllUploadStatus;
};

export const totalSharePercentOfPeople = (people: any[]) => {
  let arrSum;
  const addedSharePercenatge: any[] = [];
  if (people?.length > 0) {
    people.forEach((element) => {
      const checkNumber = element.percentageOfShares
        ? element.percentageOfShares
        : 0;
      addedSharePercenatge.push(parseFloat(checkNumber));
    });
    arrSum = addedSharePercenatge.reduce((a, b) => a + b, 0);
  } else {
    arrSum = 0;
  }
  return arrSum;
};

export const checkLowRiskCountryAvailability = (
  currentFileList: any,
  countries: any,
  value?: string
) => {
  const selectedCountriesCodes = currentFileList.map((license: any) => {
    return license.regulatedCountry;
  });
  if (value) selectedCountriesCodes.push(value);
  const selectedCountries = countries.filter((country: any) =>
    selectedCountriesCodes.includes(country.alpha2Code)
  );
  const riskCategories = selectedCountries.map(
    (country: any) => country.riskCategory
  );
  return riskCategories.includes("low");
};

export const capitalize = (label: string) => {
  if (typeof label !== "string") return "";
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export const capitalizeString = (string: string) => {
  const sentence = typeof string === "string" ? string : "";
  const words = sentence.split(" ");
  return words
    .map((word) => {
      return word[0]?.toUpperCase() + word?.substring(1);
    })
    .join(" ");
};

export const toAmountFormat = (amount: number) => {
  const value = typeof amount === "number" ? amount.toFixed(2) : amount;
  return toStringAmountCommaSeparated(value);
};

const toStringAmountCommaSeparated = (amount: string) => {
  if (!amount) {
    return "0";
  }
  return amount.toString().replace(/^[+-]?\d+/, function (int) {
    return int.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  });
};

export const generateRandomName = Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, "")
  .substr(0, 5);

export const fieldValidation = (fieldName: string, value: string) => {
  if (fieldName === "email") {
    const validEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return validEmail.test(value);
  }
  if (fieldName === "password") {
    const validPassword = new RegExp(
      "^^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{8,16}$"
    );
    return validPassword.test(value);
  }
  if (fieldName === "phoneNumber") {
    const validPhone = new RegExp("^[0-9]*$");
    return validPhone.test(value);
  }
};

export const formatDateAndTime = (date: any, tz: string) => {
  const dateTime = moment(date);
  const formatedDateTime = dateTime.tz(tz).format("DD/MM/YYYY hh:mm:ss A");
  return formatedDateTime;
};

export const formatDate = (date: any, tz: string) => {
  const dateTime = moment(date);
  const formatedDate = dateTime.tz(tz).format("DD/MM/YYYY");
  return formatedDate;
};

export const getFormattedAddress = (itemsObject: any): any => {
  const sortingArr = [
    "buildingName",
    "floor",
    "room",
    "buildingNumber",
    "street",
    "city",
    "state",
    "country",
    "postCode",
    "postalCode",
    "postBox",
    "countryCode"
  ];
  let str = "";
  if (itemsObject !== null) {
    for (let i = 0; i < sortingArr.length; i++) {
      if (sortingArr[i]) {
        if (itemsObject[sortingArr[i]]) {
          if (i === 0) {
            str += itemsObject[sortingArr[i]];
          } else {
            str += ", " + itemsObject[sortingArr[i]];
          }
        }
      }
    }
  }

  return str.charAt(0) === "," ? str.slice(1) : str;
};

export const getAllTaggedEntities = (entity: any, taggedEntities: any) => {
  // this commented code are related to onbaord new entity option which is temporarily disabled now

  // const onBoardNewEntity: any = {
  //   id: "0001",
  //   genericInformation: { registeredCompanyName: " + Onboard new entity" }
  // };
  // const isKycStatusNew = entity?.kycInformation?.kycStatus === "new" || "pass";
  // const isOnboardNewEntityExist = taggedEntities.find(
  //   (newBoard: any) => newBoard?.id === "0001"
  // );
  let entities = [];
  if (taggedEntities?.length) {
    entities = taggedEntities;
    const isParentEntityExist = taggedEntities.find(
      (entityID: any) => entityID.id === entity.id
    );
    !isParentEntityExist && entities.unshift(entity);
    // isKycStatusNew &&
    //   !isOnboardNewEntityExist &&
    //   entities.push(onBoardNewEntity);
  } else {
    entities.push(entity);
    // isKycStatusNew &&
    //   !isOnboardNewEntityExist &&
    //   entities.push(onBoardNewEntity);
  }
  return entities;
};
export const camelize = (str: string) => {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return "";
};

export const getCamelCase = (statusArr: any, N: number) => {
  let result = "";
  for (let i = 0; i < N; i++) {
    //if the current word is not 1st insert a space
    if (result.length > 0) {
      result += " ";
    }
    // put the first character of statusArr[i]
    result += statusArr[i][0].toUpperCase();
    for (let j = 1; j < statusArr[i].length; j++) {
      // if a space is found, the next character should be in upper case
      if (statusArr[i][j] === " ") {
        result += " ";
        result += statusArr[i][j + 1].toUpperCase();
        j++;
      }
      // otherwise the characters must be in the lower case
      else {
        result += statusArr[i][j].toLowerCase();
      }
    }
  }
  return result;
};

export const getOrderStatusWithCamelCase = (orderStatus: string) => {
  if (!orderStatus) {
    return "";
  }

  const statusArray = orderStatus.split("_");
  const convertedStatus = getCamelCase(statusArray, statusArray.length);
  return convertedStatus;
};

export const getCurrencyName = (
  mainCurrencyName: string | undefined,
  currencyName: string | undefined,
  currenciesList: any
) => {
  if (mainCurrencyName) {
    const mainCurrencyObj = currenciesList.find(
      (currency: any) => currency.code === mainCurrencyName
    );
    if (mainCurrencyObj?.mainCurrency)
      return `${currencyName && currencyName} (${mainCurrencyObj?.name})`;
  }
  return currencyName;
};

export const getStatusIcons = (status: string) => {
  switch (status) {
    case "accepted_by_client":
    case "deposit_accepted_by_client":
    case "complete":
    case "deposit_ready_to_trade":
    case "payment_initiated":
    case "auto_accepted":
      return "checkCircle";

    case "new_client_order":
    case "warehouse":
    case "route_pending":
    case "overnight_route_pending":
    case "deposit_pending_approval":
    case "pending_approval_client":
    case "pending_deposit":
    case "pending_remittance":
    case "await_final_settlement":
      return "pendingColored";

    case "rejected_by_client":
    case "rejected":
    case "cancelled":
    case "payment_rejected":
      return "fallColored";

    default:
      return "fallColored";
  }
};
