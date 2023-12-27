import React, { useEffect, useState } from "react";
import { Notification } from "@payconstruct/design-system";
import {
  useGetOperationQuestionsByCategoryQuery,
  useUpdateClientInfoMutation,
  ClientRequestProps
} from "../../../services/companyService";
import { OperationQusReq } from "../../../services/companyService";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks/store";
import {
  previousStepAction,
  nextStepAction
} from "../../../config/company/companySlice";
import { Buttons } from "../Components/Buttons";
import { Spacer } from "../../../components/Spacer/Spacer";

import EcommercePayment from "./Components/Ecommerce/Ecommerce";
import ExoticFX from "./Components/ExoticFX";
import ForeignExchange from "./Components/ForeignExchange";
import GlobalAccounts from "./Components/GlobalAccounts";
import { selectEntityId } from "../../../config/auth/authSlice";
import { getClient } from "../../../services/termsOfService/actions";
import { HeaderRow } from "../Components/Header";

const OperationalInfo: React.FC = () => {
  const dispatch = useAppDispatch();
  // Request
  const entityId = useAppSelector(selectEntityId);
  const token = useAppSelector((state) => state.auth.token);
  const { selectedProducts, progressLogs } = useAppSelector(
    (state) => state.company
  );
  const isOperationInformationDone = useAppSelector(
    (state) => state.company.progressLogs.isOperationInformationDone
  );

  const { globalAccounts, ecommercePayment, foreignExchange, exoticFX } =
    useAppSelector((state) => state.operationalInformation);

  const [clientFrom] = useState<ClientRequestProps>({
    clientId: entityId,
    token: token,
    selectedEntityId: entityId
  });

  const [requestParams] = useState<OperationQusReq>({
    category: "operation_information"
  });

  // Response
  const { refetch: getAllQuestions } =
    useGetOperationQuestionsByCategoryQuery(requestParams);

  const [updateCustomerInfo, { isLoading: updateLoader }] =
    useUpdateClientInfoMutation();

  // useGetCustomerInfoQuery(clientForm);

  useEffect(() => {
    getAllQuestions();
    const validationCheckOnData = operationInfoDataValidation();
    if (validationCheckOnData?.includes(false)) {
      updateOperationalProgressStatus(false, "");
    } else updateOperationalProgressStatus(true, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (isOperationalInfoCompleted) {
  //     dispatch(nextStepAction());
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isOperationalInfoCompleted]);

  const operationInfoDataValidation = () => {
    const returnResp: any[] = [];
    (selectedProducts || []).forEach((product: string) => {
      if (product === "global_payments") {
        returnResp.push(globalAccounts?.inbound?.length > 0);
        returnResp.push(globalAccounts?.outbound?.length > 0);
      }
      if (product === "efx") {
        returnResp.push(exoticFX?.length > 0);
      }
      if (product === "crypto_commerce") {
        returnResp.push(ecommercePayment?.deposits_payins?.length > 0);
        returnResp.push(ecommercePayment?.payouts?.length > 0);
      }
      if (product === "foreign_exchange" || product === "global_payments") {
        returnResp.push(foreignExchange?.length > 0);
      }
    });
    return returnResp;
  };

  const handlerSave = () => {
    const validationCheckOnData = operationInfoDataValidation();
    if (validationCheckOnData.includes(false)) {
      Notification({
        type: "warning",
        message: "",
        description: "Please update the information, to proceed with next step!"
      });
      updateOperationalProgressStatus(false, "");
    } else {
      updateOperationalProgressStatus(true, "submit");
    }
  };

  const handleBack = () => {
    const validationCheckOnData = operationInfoDataValidation();
    if (validationCheckOnData.includes(false)) {
      updateOperationalProgressStatus(false, "");
    }
  };

  const updateOperationalProgressStatus = (status: boolean, type: string) => {
    const statusDetail = {
      ...progressLogs,
      isOperationInformationDone: status
    };
    const data = {
      clientId: entityId,
      data: { progressLogs: statusDetail }
    };
    updateCustomerInfo(data)
      .unwrap()
      .then(() => {
        dispatch(getClient(clientFrom));
        type === "submit" && dispatch(nextStepAction());
      });
  };

  return (
    <div>
      <HeaderRow
        headerText="Operational Information"
        subHeaderText=""
        status={isOperationInformationDone}
      />

      {selectedProducts.includes("crypto_commerce") && <EcommercePayment />}
      {selectedProducts.includes("efx") && <ExoticFX />}
      {selectedProducts.includes("foreign_exchange") ||
        (selectedProducts.includes("global_payments") && <ForeignExchange />)}
      {selectedProducts.includes("global_payments") && <GlobalAccounts />}
      {<Spacer size={40} />}
      <Buttons
        onSaveText="Save &amp; Continue"
        onBackText="Back"
        btnLoader={updateLoader}
        formType="button"
        onBack={() => {
          dispatch(previousStepAction());
          handleBack();
        }}
        onSave={handlerSave}
      />
    </div>
  );
};

export { OperationalInfo as default };
