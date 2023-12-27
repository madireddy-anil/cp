import React, { useEffect, useState } from "react";
import {
  Form,
  Cards,
  Spin,
  Modal,
  Button,
  DynamicForm
} from "@payconstruct/design-system";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/store";
import { Spacer } from "../../../../components/Spacer/Spacer";
import {
  useCreateClientInfoMutation,
  useUpdateClientInfoMutation,
  useDeleteClientInfoMutation
} from "../../../../services/companyService";
import {
  updateSelectedProduct,
  updateInitialFormValues
} from "../../../../config/company/operationalInformationSlice";
import { getCurrencyName, getCountriesList } from "../Transformer";

import OperationalInfoHeader from "../Header";
import { selectEntityId } from "../../../../config/auth/authSlice";
import { toAmountFormat } from "../../../../config/transformer";

const GlobalAccounts: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const {
    globalAccountsQuestions,
    globalAccounts,

    productType,
    initialFormValues
  } = useAppSelector((state) => state.operationalInformation);
  const entityId = useAppSelector(selectEntityId);
  const [modalView, setModalView] = useState(false);
  const [modalMode, setModalMode] = useState("CREATE");
  const [formData, setFormData] = useState<any>([]);
  const [depositType, setDepositType] = useState({
    title: "",
    subTitle: ""
  });

  const [
    createCustomerInfo,
    { isSuccess: isCustomerInfoCreated, isLoading: createLoader }
  ] = useCreateClientInfoMutation();

  const [
    updateCustomerInfo,
    { isSuccess: isCustomerInfoUpdated, isLoading: updateLoader }
  ] = useUpdateClientInfoMutation();

  const [deleteCustomerInfo, { isLoading: deleteLoader }] =
    useDeleteClientInfoMutation();

  useEffect(() => {
    if (isCustomerInfoUpdated) {
      setModalView(false);
    }
  }, [isCustomerInfoUpdated]);

  useEffect(() => {
    if (isCustomerInfoCreated) {
      setModalView(false);
    }
  }, [isCustomerInfoCreated]);

  useEffect(() => {
    if (initialFormValues) {
      form.setFieldsValue(initialFormValues);
    }
  }, [initialFormValues, form]);

  const onFinish = (values: any) => {
    modalMode === "EDIT" &&
      updateCustomerInfo({
        clientId: entityId,
        category: "operation-details",
        category_key:
          depositType.title === "New Inbound Payment Currency" ||
          depositType.title === "Inbound Payments"
            ? "globalAccounts.inbound"
            : "globalAccounts.outbound",
        category_id: initialFormValues.id,
        data: values
      }).unwrap();
    modalMode === "CREATE" &&
      createCustomerInfo({
        clientId: entityId,
        category: "operation-details",
        category_key:
          depositType.title === "New Inbound Payment Currency" ||
          depositType.title === "Inbound Payments"
            ? "globalAccounts.inbound"
            : "globalAccounts.outbound",
        data: values
      }).unwrap();
  };

  const onClickModalCancel = () => {
    setModalView(false);
  };

  const addDepositCurrency = () => {
    setModalView(true);
    setDepositType({
      title: "New Inbound Payment Currency",
      subTitle:
        "Enter all details required to add a new inbound payment currency.."
    });
    dispatch(updateSelectedProduct("global_accounts"));
    setFormData([globalAccountsQuestions?.inbound[0]]);
    form.setFieldsValue({
      currency: "",
      monthlyNumberOfTransactions: "",
      monthlyValueOfTransactions: "",
      averageSingleTransactionValue: "",
      paymentTypesRequired: [],
      countriesSendingFunds: []
    });
  };

  const addPayoutCurrency = () => {
    setModalView(true);
    setDepositType({
      title: "New Outbound Currency",
      subTitle: "Enter all details required to add a new outbound currency."
    });
    dispatch(updateSelectedProduct("global_accounts"));
    setFormData([globalAccountsQuestions?.outbound[0]]);

    form.setFieldsValue({
      currency: "",
      monthlyNumberOfTransactions: "",
      monthlyValueOfTransactions: "",
      averageSingleTransactionValue: "",
      paymentTypesRequired: [],
      countriesReceivingFunds: []
    });
  };

  const onFieldValueChange = (value: any) => {
    const questions =
      depositType.title === "New Inbound Payment Currency"
        ? globalAccountsQuestions?.inbound
        : globalAccountsQuestions?.outbound;
    const changelabelForQues = addCurrencyTagToQues(questions, value.currency);
    // const formatedQues = changelabelForQues?.filter((item:any)=> item.label !== "Currency")
    modalMode !== "EDIT" && value?.currency && setFormData(changelabelForQues);
  };

  const addCurrencyTagToQues = (ques: any, currency: string) => {
    return (ques || []).map((questions: any) => {
      if (questions.label.startsWith("Est.")) {
        return Object.assign({
          ...questions,
          label: questions.label + ` in ${currency}`
        });
      } else {
        return Object.assign({ ...questions });
      }
    });
  };

  const formatViewContent = (data: any, productType: string) => {
    let returnResp: any[] = [];
    (data || []).map((item: any) => {
      const formatObj = {
        record: item,
        currencyCode: item?.currency,
        currencyName: getCurrencyName(item?.currency),
        paymentTypes: item?.paymentTypesRequired,
        content: [
          {
            label: `Est. total monthly payment value in ${item?.currency}`,
            value: toAmountFormat(item.monthlyValueOfTransactions)
          },
          {
            label: `Est. average single payment value in ${item?.currency}`,
            value: toAmountFormat(item.averageSingleTransactionValue)
          },
          {
            label: `Est. number of transactions per month in ${item?.currency}`,
            value: toAmountFormat(item.monthlyNumberOfTransactions)
          },
          {
            label:
              productType === "inbound"
                ? `Countries sending the funds in ${item?.currency}`
                : `Countries receiving the funds in ${item?.currency}`,
            value:
              productType === "inbound"
                ? getCountriesList(item?.countriesSendingFunds)
                : getCountriesList(item?.countriesReceivingFunds)
          }
        ]
      };
      return returnResp.push(formatObj);
    });
    return returnResp;
  };

  const onEditInboundPayment = (values: any) => {
    setModalView(true);
    setDepositType({
      title: "Inbound Payments",
      subTitle: "Edit details"
    });
    setModalMode("EDIT");
    dispatch(updateInitialFormValues(values.record));
    dispatch(updateSelectedProduct("global_accounts"));
    setFormData(globalAccountsQuestions?.inbound);
  };

  const onEditOutboundPayment = (values: any) => {
    setModalView(true);
    setDepositType({
      title: "Outbound Payments",
      subTitle: "Edit details"
    });
    setModalMode("EDIT");
    dispatch(updateInitialFormValues(values.record));
    dispatch(updateSelectedProduct("global_accounts"));
    setFormData(globalAccountsQuestions?.outbound);
  };

  const onRemoveInboundPayment = (values: any) => {
    deleteCustomerInfo({
      clientId: entityId,
      category: "operation-details",
      category_key: "globalAccounts.inbound",
      category_id: values.record.id
    }).unwrap();
  };

  const onRemoveOutboundPayment = (values: any) => {
    deleteCustomerInfo({
      clientId: entityId,
      category: "operation-details",
      category_key: "globalAccounts.outbound",
      category_id: values.record.id
    }).unwrap();
  };

  return (
    <Spin label="loading..." loading={deleteLoader}>
      {productType === "global_accounts" && (
        <Modal
          key="Global Accounts"
          type="default"
          title={depositType.title}
          subTitle={depositType.subTitle}
          description={
            <div
              style={{ background: "#F5F6F8", padding: "44px 28px 24px 28px" }}
            >
              <DynamicForm
                form={form}
                formData={formData?.length > 0 ? formData : []}
                initialValues={initialFormValues}
                onValuesChange={onFieldValueChange}
                onFinish={onFinish}
              />
            </div>
          }
          onClickCancel={onClickModalCancel}
          modalView={modalView}
          btnLoading={createLoader || updateLoader}
          btnType="submit"
          onCancelText="Cancel"
          onOkText="Save Details"
        />
      )}
      <OperationalInfoHeader title="Global Accounts" isFilterEnabled={false} />
      <Cards.LinkCard
        title="Inbound Payments"
        description="Tell us about at least 1 or more (fiat or crypto currency)."
        cardType="link"
        // customCard={customCard}
        isLinkCardEnabled
        link={
          <div
            style={{
              marginLeft: "-25px",
              marginBottom: "-11px",
              marginTop: "-23px"
            }}
          >
            <Button
              type="link"
              label="Add Inbound Payment Currency"
              icon={{ name: "plus" }}
              onClick={addDepositCurrency}
            />
          </div>
        }
        contentList={formatViewContent(globalAccounts?.inbound, "inbound")}
        onEdit={(value) => onEditInboundPayment(value)}
        onRemove={(value) => onRemoveInboundPayment(value)}
      />
      <Spacer size={20} />
      <Cards.LinkCard
        title="Outbound Payments"
        description="Tell us about at least 1 or more (fiat or crypto currency) that you estimate you will use with us."
        cardType="link"
        // customCard={customCard}
        isLinkCardEnabled
        link={
          <div
            style={{
              marginLeft: "-25px",
              marginBottom: "-11px",
              marginTop: "-14px"
            }}
          >
            <Button
              type="link"
              label="Add Outbound Payment Currency"
              icon={{ name: "plus" }}
              onClick={addPayoutCurrency}
            />
          </div>
        }
        contentList={formatViewContent(globalAccounts?.outbound, "outbound")}
        onEdit={(value) => onEditOutboundPayment(value)}
        onRemove={(value) => onRemoveOutboundPayment(value)}
      />
    </Spin>
  );
};

export { GlobalAccounts as default };
