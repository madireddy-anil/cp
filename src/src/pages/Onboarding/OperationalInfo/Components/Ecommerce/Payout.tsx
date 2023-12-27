import React, { useEffect, useState } from "react";
import {
  Form,
  Spin,
  Cards,
  Modal,
  Button,
  DynamicForm
} from "@payconstruct/design-system";
import {
  useAppDispatch,
  useAppSelector
} from "../../../../../redux/hooks/store";
import {
  useCreateClientInfoMutation,
  useUpdateClientInfoMutation,
  useDeleteClientInfoMutation
} from "../../../../../services/companyService";
import {
  updateSelectedProduct,
  updateInitialFormValues
} from "../../../../../config/company/operationalInformationSlice";
import { getCurrencyName } from "../../Transformer";
import { selectEntityId } from "../../../../../config/auth/authSlice";
import { toAmountFormat } from "../../../../../config/transformer";

const EcommercePayout: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const {
    ecommercePaymentsQuestions,
    ecommercePayment,

    productType,
    initialFormValues
  } = useAppSelector((state) => state.operationalInformation);
  const entityId = useAppSelector(selectEntityId);
  const [modalView, setModalView] = useState(false);
  const [formData, setFormData] = useState<any>([]);
  const [modalMode, setModalMode] = useState("CREATE");
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
        category_key: "ecommercePayments.payouts",
        category_id: initialFormValues.id,
        data: values
      }).unwrap();
    modalMode === "CREATE" &&
      createCustomerInfo({
        clientId: entityId,
        category: "operation-details",
        category_key: "ecommercePayments.payouts",
        data: values
      }).unwrap();
  };

  const onClickModalCancel = () => {
    setModalView(false);
  };

  const addPayoutCurrency = () => {
    setModalView(true);
    setDepositType({
      title: "New Payout Currency",
      subTitle: "Enter all details required to add a new Payout currency."
    });
    dispatch(updateSelectedProduct("ecommerce"));
    setFormData([ecommercePaymentsQuestions?.payouts[0]]);

    form.setFieldsValue({
      currency: "",
      monthlyNumberOfTransactions: "",
      monthlyValueOfTransactions: "",
      averageSingleTransactionValue: ""
    });
  };

  const onEdit = (values: any) => {
    setModalView(true);
    setDepositType({
      title: "Ecommerce Payout Payment",
      subTitle: "Edit details"
    });
    setModalMode("EDIT");
    dispatch(updateInitialFormValues(values.record));
    dispatch(updateSelectedProduct("ecommerce"));
    setFormData(ecommercePaymentsQuestions?.payouts);
  };

  const onRemove = (values: any) => {
    deleteCustomerInfo({
      clientId: entityId,
      category: "operation-details",
      category_key: "ecommercePayments.payouts",
      category_id: values?.record?.id
    }).unwrap();
  };

  const onFieldValueChange = (value: any) => {
    const questions = ecommercePaymentsQuestions?.payouts;
    const changelabelForQues = addCurrencyTagToQues(questions, value?.currency);
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

  const formatViewContent = (data: any) => {
    let returnResp: any[] = [];
    (data || []).map((item: any) => {
      const formatObj = {
        record: item,
        currencyCode: item?.currency,
        currencyName: getCurrencyName(item?.currency),
        paymentTypes: [],
        content: [
          {
            label: `Est. total monthly payout value in ${item?.currency}`,
            value: toAmountFormat(item.monthlyValueOfTransactions)
          },
          {
            label: `Est. av. single txn. value in ${item?.currency}`,
            value: toAmountFormat(item.averageSingleTransactionValue)
          },
          {
            label: `Est. no. of txn. per month in ${item?.currency}`,
            value: item.monthlyNumberOfTransactions
          }
        ]
      };
      return returnResp.push(formatObj);
    });
    return returnResp;
  };

  return (
    <Spin label="loading..." loading={deleteLoader}>
      {productType === "ecommerce" && (
        <Modal
          key="Ecommerce"
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
      <Cards.LinkCard
        title="Payout"
        description="Tell us about at least 1 or more crypto currency for payouts that you estimate you will use with us."
        cardType="link"
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
              label="Add Payout Currency"
              icon={{ name: "plus" }}
              onClick={addPayoutCurrency}
            />
          </div>
        }
        contentList={formatViewContent(ecommercePayment?.payouts)}
        onEdit={(value) => onEdit(value)}
        onRemove={(value) => onRemove(value)}
      />
    </Spin>
  );
};

export { EcommercePayout as default };
