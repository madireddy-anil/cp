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
import { getSplitCurrencies } from "../Transformer";
import { selectEntityId } from "../../../../config/auth/authSlice";
import { toAmountFormat } from "../../../../config/transformer";

const ForeignExchange: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    foreignExchangeQuestions,
    foreignExchange,

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
        category_key: "fx.fxCurrencyPairs",
        category_id: initialFormValues.id,
        data: values
      }).unwrap();
    modalMode === "CREATE" &&
      createCustomerInfo({
        clientId: entityId,
        category: "operation-details",
        category_key: "fx.fxCurrencyPairs",
        data: values
      }).unwrap();
  };

  const resetFormFields = () => {
    form.setFieldsValue({
      fxCurrencyPair: "",
      monthlyNumberOfTransactions: "",
      averageSingleTransactionValue: "",
      monthlyValueOfTransactions: ""
    });
  };

  const addNewCurrency = () => {
    resetFormFields();
    setModalView(true);
    setModalMode("CREATE");
    dispatch(updateSelectedProduct("foreign_exchange"));
    setFormData([foreignExchangeQuestions[0]]);
  };

  const onClickModalCancel = () => {
    setModalView(false);
  };

  const onRemove = (value: any) => {
    deleteCustomerInfo({
      clientId: entityId,
      category: "operation-details",
      category_key: "fx.fxCurrencyPairs",
      category_id: value.id
    }).unwrap();
  };

  const onEdit = (values: any) => {
    setModalMode("EDIT");
    setModalView(true);
    dispatch(updateInitialFormValues(values));
    dispatch(updateSelectedProduct("foreign_exchange"));
    setFormData(foreignExchangeQuestions);
  };

  const onFieldValueChange = (value: any) => {
    setFormData(foreignExchangeQuestions);
  };

  const getExoticFXList = () => {
    return (
      foreignExchange?.length > 0 &&
      (foreignExchange || []).map((item: any) => {
        const currencies: any =
          item?.fxCurrencyPair && getSplitCurrencies(item?.fxCurrencyPair);
        return (
          <div key={item?.fxCurrencyPair} style={{ marginBottom: "30px" }}>
            <Cards.ListCard
              size={"small"}
              contentList={[
                {
                  label: "Est. total monthly transaction value in USD",
                  value: toAmountFormat(item.monthlyValueOfTransactions)
                },
                {
                  label: "Est. average single transaction value in USD",
                  value: toAmountFormat(item.averageSingleTransactionValue)
                },
                {
                  label: "Est. number of transactions per month in USD",
                  value: toAmountFormat(item.monthlyNumberOfTransactions)
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

  const fxList: any = getExoticFXList();
  return (
    <div>
      {productType === "foreign_exchange" && (
        <Modal
          key="Foreign"
          type="default"
          title="Foreign Exchange"
          subTitle="Tell us about at least 1 or more foreign exchange currency pair"
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
      <OperationalInfoHeader title="Foreign Exchange" isFilterEnabled={false} />
      {/* <Spacer size={20} /> */}

      <Spin label="loading..." loading={deleteLoader}>
        <Cards.LinkCard
          title="Foreign Exchange Currency Pairs"
          description="Tell us about at least 1 or more exotic currency"
          cardType="link"
          customCard={fxList}
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
                label="New Currency Pair"
                icon={{ name: "plus" }}
                onClick={addNewCurrency}
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

export { ForeignExchange as default };

// After testing once all good the commented code will be deleted.............

// import React, { useEffect, useState } from "react";
// import {
//   Form,
//   Cards,
//   Modal,
//   DynamicForm,
//   Spin
// } from "@payconstruct/design-system";
// import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/store";
// import { Spacer } from "../../../../components/Spacer/Spacer";
// import {
//   useCreateClientInfoMutation,
//   useUpdateClientInfoMutation,
//   useDeleteClientInfoMutation
// } from "../../../../services/companyService";
// import {
//   updateSelectedProduct,
//   updateInitialFormValues
// } from "../../../../config/company/operationalInformationSlice";

// import OperationalInfoHeader from "../Header";
// import { getSplitCurrencies } from "../Transformer";

// const ForeignExchange: React.FC = () => {
//   const [form] = Form.useForm();
//   const dispatch = useAppDispatch();
//   const { clientId } = useAppSelector((state) => state.auth);
//   const {
//     foreignExchangeQuestions,
//     foreignExchange,

//     productType,
//     initialFormValues
//   } = useAppSelector((state) => state.operationalInformation);
//   const [modalView, setModalView] = useState(false);
//   const [formData, setFormData] = useState<any>([]);
//   const [modalMode, setModalMode] = useState("CREATE");

//   const [
//     createCustomerInfo,
//     { isSuccess: isCustomerInfoCreated, isLoading: createLoader }
//   ] = useCreateClientInfoMutation();

//   const [deleteCustomerInfo, { isLoading: deleteLoader }] =
//     useDeleteClientInfoMutation();
//   const [
//     updateCustomerInfo,
//     { isSuccess: isCustomerInfoUpdated, isLoading: updateLoader }
//   ] = useUpdateClientInfoMutation();

//   useEffect(() => {
//     if (isCustomerInfoUpdated) {
//       setModalView(false);
//     }
//     if (isCustomerInfoCreated) {
//       setModalView(false);
//     }
//     if (initialFormValues) {
//       form.setFieldsValue(initialFormValues);
//     }
//   }, [isCustomerInfoUpdated, isCustomerInfoCreated, initialFormValues, form]);

//   const setShowModal = () => {
//     dispatch(updateSelectedProduct("foreign_exchange"));
//     setModalView(true);
//     setModalMode("CREATE");

//     setFormData([foreignExchangeQuestions[0]]);

//     // form.setFieldsValue({
//     //   fxCurrencyPair: "",
//     //   monthlyNumberOfTransactions: "",
//     //   monthlyValueOfTransactions: "",
//     //   averageSingleTransactionValue: ""
//     // });
//   };

//   const onClickModalCancel = () => {
//     setModalView(false);
//   };

//   const onFinish = (values: any) => {
//     modalMode === "EDIT" &&
//       updateCustomerInfo({
//         clientId,
//         category: "operation-details",
//         category_key: "fx.fxCurrencyPairs",
//         category_id: initialFormValues.id,
//         data: values
//       }).unwrap();
//     modalMode === "CREATE" &&
//       createCustomerInfo({
//         clientId,
//         category: "operation-details",
//         category_key: "fx.fxCurrencyPairs",
//         data: values
//       }).unwrap();
//   };

//   const onRemove = (value: any) => {
//     deleteCustomerInfo({
//       clientId,
//       category: "operation-details",
//       category_key: "fx.fxCurrencyPairs",
//       category_id: value.id
//     }).unwrap();
//   };

//   const onEdit = (values: any) => {
//     setModalView(true);
//     setModalMode("EDIT");
//     setFormData(foreignExchangeQuestions);
//     dispatch(updateInitialFormValues(values));
//     dispatch(updateSelectedProduct("foreign_exchange"));
//   };

//   const formatViewContent = (data: any) => {
//     return (data || []).map((item: any) => {
//       const currencies: any =
//         item?.fxCurrencyPair && getSplitCurrencies(item?.fxCurrencyPair);
//       return (
//         <div key={item?.fxCurrencyPair} style={{ marginBottom: "20px" }}>
//           <Cards.ListCard
//             size={"small"}
//             contentList={[
//               {
//                 label: "Est. total monthly transaction value",
//                 value: item.monthlyNumberOfTransactions
//               },
//               {
//                 label: "Est. average single transaction value",
//                 value: item.averageSingleTransactionValue
//               },
//               {
//                 label: "Est. number of transactions per month",
//                 value: item.monthlyValueOfTransactions
//               }
//             ]}
//             currency={currencies}
//             onEdit={() => onEdit(item)}
//             onRemove={() => onRemove(item)}
//           />
//         </div>
//       );
//     });
//   };

//   return (
//     <Spin label="loading..." loading={deleteLoader}>
//       {productType === "foreign_exchange" && (
//         <Modal
//           key="Foreign Exchange"
//           type="default"
//           title="New Currency Pair"
//           subTitle="Enter all details required to add a new currency pair."
//           description={
//             <div
//               style={{ background: "#F5F6F8", padding: "44px 28px 24px 28px" }}
//             >
//               <DynamicForm
//                 formData={formData?.length > 0 ? formData : []}
//                 onFinish={onFinish}
//               />
//             </div>
//           }
//           onClickCancel={onClickModalCancel}
//           modalView={modalView}
//           btnLoading={createLoader || updateLoader}
//           btnType="submit"
//           onCancelText="Cancel"
//           onOkText="Save Details"
//         />
//       )}
//       <Spacer size={15} />
//       <OperationalInfoHeader
//         title="Foreign Exchange - Majors"
//         isFilterEnabled={false}
//         btnLabel="New Currency Pair"
//         setShowModal={setShowModal}
//       />
//       <div style={{ marginTop: "-20px" }} />
//       {foreignExchange?.length > 0 && formatViewContent(foreignExchange)}
//     </Spin>
//   );
// };

// export { ForeignExchange as default };
