import React, { useState, useEffect } from "react";
import { Company } from "@payconstruct/design-system";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks/store";
import { CompanyReqPost } from "../../../services/companyService";
import {
  useUpdateClientInfoMutation,
  ClientRequestProps
} from "../../../services/companyService";

import { nextStepAction } from "../../../config/company/companySlice";
import {
  addressFields,
  formData,
  otherFields,
  industries,
  forexIndustries,
  gamingIndustries
} from "./CompanyInformationForm";
import { getClient } from "../../../services/termsOfService/actions";
import { HeaderRow } from "../Components/Header";

const CompanyInformation: React.FC = () => {
  const dispatch = useAppDispatch();
  const entityId = useAppSelector((state) => state.auth.selectedEntityId);
  const token = useAppSelector((state) => state.auth.token);
  const { progressLogs } = useAppSelector((state) => state.company);
  const isCompanyInformationDone = useAppSelector(
    (state) => state.company.progressLogs.isCompanyInformationDone
  );
  const { countries } = useAppSelector((state) => state.countries);
  const { address, initialCompanyInfoFormData, websiteAddress } =
    useAppSelector((state) => state.companyInformation);

  const [isBtnEnabled, setBtnEnabled] = React.useState(
    !initialCompanyInfoFormData?.industry
  );
  const [formState, setFormState] = useState<CompanyReqPost>({
    clientId: entityId,
    data: {}
  });

  const [clientFrom] = useState<ClientRequestProps>({
    clientId: entityId,
    token: token,
    selectedEntityId: entityId
  });

  const [updateCustomerInfo, { isLoading }] = useUpdateClientInfoMutation();

  useEffect(() => {
    if (Object.entries(formState.data).length > 0) {
      updateCustomerInfo(formState)
        .unwrap()
        .then(() => {
          dispatch(getClient(clientFrom));
          dispatch(nextStepAction());
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);

  // useEffect(() => {
  //   console.log("isSuccess", isSuccess);
  //   if (isSuccess) {
  //     // dispatch(updateSelectedCompanyStep(1));
  //     dispatch(nextStepAction());
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isSuccess]);

  const onFinish = (values: any) => {
    const address: any[] = [];
    address.push(getAddressOnType(values, "", "registered"));
    !values.principalAddress &&
      address.push(
        getAddressOnType(
          values,
          "principalAddress",
          "principal_place_of_business"
        )
      );
    !values.postalAddress &&
      address.push(getAddressOnType(values, "postalAddress", "postal"));
    const otherCompanyFields = getAddressOnType(values, "", "");
    const genericInformation = {
      ...otherCompanyFields,
      addresses: address,
      websiteAddress: values?.websiteAddress ? values?.websiteAddress : [],
      industries: getIndustries(values, values.industry)
    };

    // update progresslog
    const status = { ...progressLogs, isCompanyInformationDone: true };
    setFormState((prev) => ({
      ...prev,
      data: {
        genericInformation,
        progressLogs: status
      }
    }));
  };

  const getAddressOnType = (formValues: any, type: string, label: string) => {
    const addressObj: any = {};
    const formSubmitValues = label ? addressFields : otherFields;
    const getValue = (keyString: string, addressObj: object) =>
      Object.entries(addressObj).find(([k, v]) => k.startsWith(keyString))?.[1];

    formSubmitValues.forEach((item: any) => {
      addressObj[item] = getValue(type + item, formValues);
      addressObj.type = label;
      addressObj.status = "active";
    });
    addressObj.countryCode =
      addressObj?.country && countryCode(addressObj.country);
    // !type && delete addressObj.type;
    return addressObj;
  };

  const countryCode = (countryName: string) => {
    let selectedCountry;
    selectedCountry = countries.find(
      (country: any) => country.name === countryName
    );
    return selectedCountry ? selectedCountry.alpha2Code : "";
  };

  const getIndustries = (formValues: any, type: string) => {
    console.log(formValues, "ONSUBMIT-----VALUES");
    const filterIndustrySubTypes =
      type !== "other" &&
      formValues?.industryGroup?.filter((item: string) => item !== "empty");

    const formatIndustries = {
      comment: formValues.otherComment,
      industryType: type,
      subType: filterIndustrySubTypes
    };
    type === "other" && delete formatIndustries.subType;
    (type === "forex" || type === "gambling") &&
      formValues?.otherComment &&
      formatIndustries.subType.push("other");
    return [formatIndustries];
  };

  const isPrincipalAddressAdded = (address: any) => {
    return (address || [])
      .filter((item: any) => item?.type && item.type !== "registered")
      .map((address: any) => {
        if (address?.type && address.type === "principal_place_of_business")
          return "principalAddress";
        else return "postalAddress";
      });
  };

  const onFieldsChange = (values: any, data: any) => {
    const isErrorExists = validationOnFieldError(data);
    const industries =
      data.length > 0 &&
      data.find((item: any) => item.name[0] === "industryGroup");
    const industryOther =
      data.length > 0 &&
      data.find((item: any) => item.name[0] === "otherComment");

    if (
      (industries && Object.entries(industries).length > 0) ||
      (industryOther && Object.entries(industryOther).length > 0)
    ) {
      if (
        (industries?.value &&
          industries?.value?.length > 0 &&
          !industries.value.includes("empty")) ||
        (industryOther && industryOther.value)
      ) {
        setBtnEnabled(!isErrorExists ? false : true);
      } else setBtnEnabled(true);
    }
  };

  const validationOnFieldError = (data: any[]) => {
    let returnResp;
    const isErroExists = (data || []).filter(
      (el: any) => el?.errors && el?.errors?.length > 0
    );
    if (isErroExists !== undefined && isErroExists.length > 0) {
      returnResp = true;
    } else {
      returnResp = false;
    }
    return returnResp;
  };

  const formatCountriesListForOptionSet = (countries: any) => {
    return (countries || []).map((item: any) => {
      return [item.name, item.name];
    });
  };

  const headerblock: any = (
    <HeaderRow
      headerText="Company Information"
      subHeaderText="Tell us some basics about your business"
      status={isCompanyInformationDone}
    />
  );

  const selectedAddress: any = isPrincipalAddressAdded(address);
  return (
    <>
      <Company.CompanyInformation
        onSubmitLabel={"Save & Continue"}
        header={headerblock}
        subHeader=""
        initialValues={{
          ...initialCompanyInfoFormData,
          principalAddress: !selectedAddress.includes("principalAddress"),
          postalAddress: !selectedAddress.includes("postalAddress"),
          websiteAddress:
            websiteAddress !== undefined && websiteAddress.length > 0
              ? websiteAddress
              : [""]
        }}
        selectedIndustry={
          initialCompanyInfoFormData?.industry
            ? initialCompanyInfoFormData.industry
            : ""
        }
        selectedAddress={selectedAddress}
        formData={formData}
        industries={industries}
        forexIndustries={forexIndustries}
        gamingIndustries={gamingIndustries}
        btnLoading={isLoading}
        btnEnabled={isBtnEnabled}
        countries={formatCountriesListForOptionSet(countries)}
        onFieldsChange={onFieldsChange}
        onFinish={onFinish}
      />
    </>
  );
};

// Export need to be default for code Splitting
// https://reactjs.org/docs/code-splitting.html#route-based-code-splitting
export { CompanyInformation as default };
