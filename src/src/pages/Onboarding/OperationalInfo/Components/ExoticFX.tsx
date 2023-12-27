import React, { useEffect, useState } from "react";
import {
  Form,
  Cards,
  Button,
  Spin,
  Modal,
  DynamicForm
} from "@payconstruct/design-system";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/store";
import {
  useCreateClientInfoMutation,
  useDeleteClientInfoMutation,
  useUpdateClientInfoMutation
} from "../../../../services/companyService";
import {
  updateSelectedProduct,
  updateInitialFormValues
} from "../../../../config/company/operationalInformationSlice";
import OperationalInfoHeader from "../Header";
import { getSplitCurrencies, getCountriesList } from "../Transformer";
import { selectEntityId } from "../../../../config/auth/authSlice";
import { toAmountFormat } from "../../../../config/transformer";

const ExoticFX: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    exoticFXQuestions,
    exoticFX,

    productType,
    initialFormValues
  } = useAppSelector((state) => state.operationalInformation);
  const [form] = Form.useForm();
  const entityId = useAppSelector(selectEntityId);
  const [modalView, setModalView] = useState(false);
  // const [editView, setEditView] = useState(false);

  const [formData, setFormData] = useState<any>([]);
  const [modalMode, setModalMode] = useState("CREATE");

  const [
    createCustomerInfo,
    { isSuccess: isCustomerInfoCreated, isLoading: createLoader }
  ] = useCreateClientInfoMutation();

  const [deleteCustomerInfo, { isLoading: deleteLoader }] =
    useDeleteClientInfoMutation();
  const [
    updateCustomerInfo,
    { isSuccess: isCustomerInfoUpdated, isLoading: updateLoader }
  ] = useUpdateClientInfoMutation();

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
        category_key: "exoticFx.exoticFxCurrencyPairs",
        category_id: initialFormValues.id,
        data: values
      }).unwrap();
    modalMode === "CREATE" &&
      createCustomerInfo({
        clientId: entityId,
        category: "operation-details",
        category_key: "exoticFx.exoticFxCurrencyPairs",
        data: values
      }).unwrap();
  };

  const resetFormFields = () => {
    form.setFieldsValue({
      exoticCurrencyPair: "",
      monthlyNumberOfTransactions: "",
      averageSingleTransactionVolume: "",
      monthlyVolumeTransactions: "",
      countriesSendingFunds: [],
      countriesReceivingFunds: []
    });
  };

  const addExoticCurrency = () => {
    resetFormFields();
    setModalView(true);
    setModalMode("CREATE");
    dispatch(updateSelectedProduct("exotic"));
    setFormData([exoticFXQuestions[0]]);
  };

  const onClickModalCancel = () => {
    setModalView(false);
  };

  const onRemove = (value: any) => {
    deleteCustomerInfo({
      clientId: entityId,
      category: "operation-details",
      category_key: "exoticFx.exoticFxCurrencyPairs",
      category_id: value.id
    }).unwrap();
  };

  const onEdit = (values: any) => {
    setModalMode("EDIT");
    dispatch(updateInitialFormValues(values));
    dispatch(updateSelectedProduct("exotic"));
    setFormData(exoticFXQuestions);
    setModalView(true);
  };

  const onFieldValueChange = (value: any) => {
    setFormData(exoticFXQuestions);
  };

  const getExoticFXList = () => {
    return (
      exoticFX?.length > 0 &&
      (exoticFX || []).map((item: any) => {
        const currencies: any =
          item?.exoticCurrencyPair &&
          getSplitCurrencies(item?.exoticCurrencyPair);
        return (
          <div key={item?.exoticCurrencyPair} style={{ marginBottom: "30px" }}>
            <Cards.ListCard
              size={"small"}
              contentList={[
                {
                  label: "Est. total monthly value of transactions in USD",
                  value: toAmountFormat(item.monthlyVolumeTransactions)
                },
                {
                  label: "Est. average single value of transactions in USD",
                  value: toAmountFormat(item.averageSingleTransactionVolume)
                },
                {
                  label: "Est. number of transactions per month in USD",
                  value: toAmountFormat(item.monthlyNumberOfTransactions)
                },
                {
                  label: "From which countries will you be sending the funds",
                  value: getCountriesList(item?.countriesSendingFunds)
                },
                {
                  label:
                    "From which countries will you be receiving these funds",
                  value: getCountriesList(item?.countriesReceivingFunds)
                }
              ]}
              currency={currencies}
              onEdit={() => onEdit(item)}
              onRemove={() => onRemove(item)}
            />
          </div>
        );
      })
    );
  };

  const exoticList: any = getExoticFXList();
  return (
    <div>
      {productType === "exotic" && (
        <Modal
          key="Exotic"
          type="default"
          title="Exotic currencies"
          subTitle="Tell us about at least 1 or more exotic currencies"
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
      <OperationalInfoHeader
        title="Exotic Foreign Exchange"
        isFilterEnabled={false}
      />
      {/* <Spacer size={20} /> */}

      <Spin label="loading..." loading={deleteLoader}>
        <Cards.LinkCard
          title="Exotic currencies"
          description="Tell us about at least 1 or more exotic currency"
          cardType="link"
          customCard={exoticList}
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
                label="Add Exotic Currency"
                icon={{ name: "plus" }}
                onClick={addExoticCurrency}
              />
            </div>
          }
          paymentTypes={[]}
          contentList={[]}
        />
      </Spin>
    </div>
  );
};

export { ExoticFX as default };
