import React, { useState, useEffect } from "react";
import { Company } from "@payconstruct/design-system";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks/store";

import { useUpdateClientInfoMutation } from "../../../services/companyService";

import {
  previousStepAction,
  nextStepAction
} from "../../../config/company/companySlice";

import {
  CompanyReqPost,
  ClientRequestProps
} from "../../../services/companyService";
import { Buttons } from "../Components/Buttons";
import { selectEntityId } from "../../../config/auth/authSlice";
import { getClient } from "../../../services/termsOfService/actions";
import { HeaderRow } from "../Components/Header";

const CompanyRequirements: React.FC = () => {
  const dispatch = useAppDispatch();
  const entityId = useAppSelector(selectEntityId);
  const token = useAppSelector((state) => state.auth.token);
  const { brands, selectedProducts, progressLogs } = useAppSelector(
    (state) => state.company
  );
  const isCompanyRequirementsDone = useAppSelector(
    (state) => state.company.progressLogs.isCompanyRequirementsDone
  );

  const [isBtnEnabled, setBtnEnabled] = React.useState(
    selectedProducts.length === 0
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
  // const [isUpdated] = useState(progressLogs.isCompanyInformationDone);

  const [updateCustomerInfo, { isLoading }] = useUpdateClientInfoMutation();

  // const { data: getCustomerData } = useGetCustomerInfoQuery({
  //   clientId: entityId
  // });

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

  // unUsedContent && console.log(getCustomerData, "CUSTOMER_DATA");
  // useEffect(() => {
  //   isUpdateCustomerSuccess && refetch();
  //   // if (isClientInfoUpdated) {
  //   //   // dispatch(updateSelectedCompanyStep(2));
  //   //   dispatch(nextStepAction());
  //   // }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isUpdateCustomerSuccess]);

  // const onFinish = (formResp: any) => {
  //   const selectedProducts: any[] = [];
  //   formResp["company-products"].forEach((product: string) => {
  //     const filterObj = brands.products.find(
  //       (products: any) => products.productCode === product
  //     );
  //     selectedProducts.push(filterObj);
  //   });
  //   const brand: any = [];
  //   const data = {
  //     id: brands.id,
  //     brand: "payconstruct",
  //     brandCode: "PAY",
  //     products: selectedProducts
  //   };
  //   brand.push(data);

  //   // update progresslog
  //   const status = { ...progressLogs, isCompanyRequirementsDone: true };
  //   setFormState((prev) => ({
  //     ...prev,
  //     data: {
  //       brands: brand,
  //       progressLogs: status
  //     }
  //   }));
  //   // dispatch(updateSelectedCompanyStep(2));
  // };

  // const showCompanyProducts = () => {
  //   const formatPrducts: any[] = [];
  //   if (brands.products !== undefined) {
  //     brands.products.map((item: any) => {
  //       const obj = {
  //         label: item.label,
  //         value: item.productCode,
  //         moreInfo: false
  //       };
  //       return formatPrducts.push(obj);
  //     });
  //   }
  //   return formatPrducts;
  // };

  const onFinish = (formResp: any) => {
    const selectedProducts: any[] = [];
    formResp["company-products"].forEach((product: string) => {
      const filterObj = brands.find(
        (products: any) => products.productCode === product
      );
      selectedProducts.push(filterObj["_id"]);
    });

    // update progresslog
    const status = { ...progressLogs, isCompanyRequirementsDone: true };
    setFormState((prev) => ({
      ...prev,
      data: {
        requiredProduct: selectedProducts,
        progressLogs: status
      }
    }));
  };

  // const showCompanyProducts = () => {
  //   const formatPrducts: any[] = [];
  //   const showProducts = ["crypto_commerce", "efx", "global_payments"];
  //   if (brands !== undefined && brands?.length > 0) {
  //     (brands || []).forEach((item: any) => {
  //       if (showProducts.includes(item.productCode)) {
  //         const obj = {
  //           label: item.label,
  //           value: item.productCode,
  //           tooltip: item.toolTip,
  //           moreInfo: true
  //         };
  //         return formatPrducts.push(obj);
  //       }
  //     });
  //   }
  //   return formatPrducts;
  // };

  const showCompanyProducts = () => {
    const formatPrducts: any[] = [];
    const showProducts = ["crypto_commerce", "efx", "global_payments"];
    if (brands !== undefined && brands?.length > 0) {
      (brands || []).forEach((item: any) => {
        if (showProducts.includes(item.productCode)) {
          const obj = {
            label: item.label,
            value: item.productCode,
            tooltip: item.toolTip,
            moreInfo: true
          };
          return formatPrducts.push(obj);
        }
      });
    }
    return formatPrducts;
  };

  const onFieldsChange = (values: any, data: any) => {
    if (data?.length > 0 && data[0]?.value.length > 0) {
      setBtnEnabled(false);
    } else setBtnEnabled(true);
  };

  const headerblock: any = (
    <HeaderRow
      headerText="As a company we require to"
      subHeaderText="Tell us about your needs. Tick all that apply to your business"
      status={isCompanyRequirementsDone}
    />
  );

  return (
    <>
      <Company.CompanyRequirements
        header={headerblock}
        subHeader=""
        formInitialValues={selectedProducts}
        companyProducts={showCompanyProducts()}
        onFieldsChange={onFieldsChange}
        onFinish={onFinish}
        customButtons={
          <Buttons
            onSaveText="Save &amp; Continue"
            onBackText="Back"
            formType="submit"
            btnLoader={isLoading}
            isBtnEnabled={isBtnEnabled}
            onBack={() => dispatch(previousStepAction())}
          />
        }
      />
    </>
  );
};

// Export need to be default for code Splitting
// https://reactjs.org/docs/code-splitting.html#route-based-code-splitting
export { CompanyRequirements as default };
