import {
  SwitchName,
  Form,
  Select,
  Input,
  Spacer,
  Spin,
  Modal,
  Icon
} from "@payconstruct/design-system";
import { useMemo, useState } from "react";
import style from "./NewBeneficiaryModal.module.css";
import {
  accountTypeOptions,
  BeneType,
  FormField,
  NewBeneficiaryModalProps,
  NewBeneForm
} from "./Typings";
import {
  selectShowAddNewBene,
  toggleModalAction
} from "../../../pages/Components/Beneficiary/BeneficiarySlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/store";
import { selectCountries } from "../../../config/countries/countriesSlice";
import { selectCurrencies } from "../../../config/currencies/currenciesSlice";
import { Currency } from "../../../services/currencies";
import { Country } from "../../../services/countriesService";
import { useCreateBeneficiaryMutation } from "../../../services/beneficiaryService";
import { selectEntityId } from "../../../config/auth/authSlice";
import { useGetBeneficiaryValidationFieldsQuery } from "../../../services/beneficiaryService";
import {
  addNewBeneForm,
  onFailAddNewBeneMsg,
  onSuccessAddNewBeneMsg
} from "./BeneHelper";
import { sortData } from "../../../config/transformer";

const NewBeneficiaryModal: React.FC<NewBeneficiaryModalProps> = ({
  currency: beneCurrency,
  country: beneCountry,
  type = "individual"
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const entityId = useAppSelector(selectEntityId);
  const showModal = useAppSelector(selectShowAddNewBene);
  const currencies = useAppSelector(selectCurrencies);
  const countries = useAppSelector(selectCountries);
  const [beneficiaryType, setBeneficiaryType] = useState(type);
  const [currency, setCurrency] = useState(beneCurrency);
  const [country, setCountry] = useState(beneCountry);
  const [isCurrencyCrypto, setCurrencyCrypto] = useState<boolean | undefined>(
    undefined
  );
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [newBeneficiary, { isLoading: isBeneficiaryCreationLoading }] =
    useCreateBeneficiaryMutation();

  const { beneficiaryFormFields, isFetching: isBeneValidationFieldsFetching } =
    useGetBeneficiaryValidationFieldsQuery(
      { currency, country, type: beneficiaryType },
      {
        selectFromResult: ({ data, isFetching }) => ({
          beneficiaryFormFields:
            data?.data?.beneficiaryValidation?.fields || [],
          isFetching
        }),
        refetchOnMountOrArgChange: true,
        skip:
          (!isCurrencyCrypto && currency && country) ||
          (isCurrencyCrypto && currency)
            ? false
            : true
      }
    );

  const submitNewBeneficiary = (formData: NewBeneForm) =>
    addNewBeneForm(formData, entityId).then((response) => {
      newBeneficiary(response)
        .unwrap()
        .then(() => {
          modalResetOnClose();
          onSuccessAddNewBeneMsg();
        })
        .catch((err: any) => onFailAddNewBeneMsg(err?.data?.message));
    });

  const modalResetOnClose = () => {
    dispatch(toggleModalAction());
    form.resetFields();
    setCurrency(undefined);
    setCountry(undefined);
    setCurrencyCrypto(undefined);
  };

  const requiredFields = useMemo(() => {
    if (beneficiaryFormFields) {
      return beneficiaryFormFields.filter(
        (field: FormField) => field.isRequired
      );
    }
    return [];
  }, [beneficiaryFormFields]);

  const onFormChange = (
    _changedValues: { [key: string]: string },
    allValues: { [key: string]: string }
  ) => {
    const fieldsFilled = requiredFields.filter(
      (field: FormField) => !allValues[field.schemaName]
    );
    if (fieldsFilled.length === 0 && beneficiaryFormFields.length) {
      setSubmitButtonDisabled(false);
      return;
    }
    setSubmitButtonDisabled(true);
  };

  const selectedBeneficiaryType = useMemo(() => {
    return accountTypeOptions.findIndex(
      (option) => option.value === beneficiaryType
    );
  }, [beneficiaryType]);

  const countriesAsOptions: Array<[string, string]> = useMemo(() => {
    if (countries) {
      return countries
        .filter((country: Country) => country?.payments === "Y")
        .map((country: Country) => [country.alpha2Code, country.name]);
    }
    return [];
  }, [countries]);

  const currenciesAsOptions: Array<[string, string]> = useMemo(() => {
    if (currencies) {
      return currencies
        ?.slice()
        ?.sort(sortData)
        .filter(
          (currency: Currency) =>
            !currency.mainCurrency && currency?.payments === "Y"
        )

        .map((currency: Currency) => [currency.code, currency.code]);
    }
    return [];
  }, [currencies]);

  //! Use Main Currency List
  const mainCurrenciesAsOptions: Array<[string, string]> = useMemo(() => {
    if (currencies) {
      return currencies
        .filter((currency: Currency) => currency.mainCurrency)
        .map((currency: Currency) => [currency.code, currency.code]);
    }
    return [];
  }, [currencies]);

  const DynamicFormItem = useMemo(() => {
    if (!beneficiaryFormFields) return [];

    return beneficiaryFormFields.map(
      ({
        isRequired,
        labelName,
        message,
        regex,
        schemaName,
        type
      }: FormField) => {
        return (
          <Form.Item
            key={schemaName}
            name={schemaName}
            rules={[{ required: isRequired, message, pattern: regex }]}
          >
            {type === "input" ? (
              <Input
                label={labelName}
                placeholder={labelName}
                rules={[{ required: isRequired, message, pattern: regex }]}
                required={isRequired}
                message={message}
              />
            ) : (
              <Select
                label={labelName}
                disabled={false}
                onChange={(value) => {
                  form.setFieldsValue({ [schemaName]: value });
                }}
                optionlist={
                  schemaName === "country"
                    ? countriesAsOptions
                    : mainCurrenciesAsOptions
                }
                placeholder={labelName}
                required={isRequired}
              />
            )}
          </Form.Item>
        );
      }
    );
  }, [beneficiaryFormFields, countriesAsOptions]);

  return (
    <Modal
      type="default"
      btnType="submit"
      className={style["NewBeneficiaryModal"]}
      description={
        <>
          <div className={style["NewBeneficiaryModal__info"]}>
            <Icon name="info" />
            <p className={style["NewBeneficiaryModal__text"]}>
              Payments to new beneficiaries may take longer than normal as we
              perform routine checks.
            </p>
          </div>
          <Spacer size={20} />
          <Form
            id="myForm"
            form={form}
            onValuesChange={onFormChange}
            onFinish={submitNewBeneficiary}
          >
            <Form.Item
              name="requestedAccountType"
              initialValue={beneficiaryType}
            >
              <div className={style["NewBeneficiaryModal__switchName"]}>
                <SwitchName
                  name={"requestedAccountType"}
                  selectedOption={selectedBeneficiaryType}
                  options={accountTypeOptions}
                  onChange={(selected) => {
                    const value = Object.values(selected)[0] as BeneType;
                    form.setFieldsValue({ requestedAccountType: value });
                    setBeneficiaryType(value);
                  }}
                />
              </div>
            </Form.Item>
            <Spacer size={24} />
            <Form.Item
              name="currency"
              initialValue={beneCurrency}
              rules={[{ required: true }]}
            >
              <Select
                label="Currency"
                onChange={(value) => {
                  setCurrency(value);
                  form.setFieldsValue({ currency: value });
                  const isCurrencyCrypto = currencies.find(
                    (currency: Currency) => currency?.code === value
                  );
                  if (isCurrencyCrypto?.type === "crypto") {
                    setCurrencyCrypto(true);
                    setCountry(undefined);
                    form.setFieldsValue({ bankCountry: undefined });
                  } else setCurrencyCrypto(false);
                }}
                optionFilterProp="children"
                optionlist={currenciesAsOptions}
                placeholder={"Select Currency"}
                disabled={!!beneCurrency}
              />
            </Form.Item>

            {!isCurrencyCrypto && currency && (
              <Form.Item
                name="bankCountry"
                initialValue={beneCountry}
                rules={[{ required: true }]}
              >
                <Select
                  label="Bank Country"
                  onChange={(value) => {
                    setCountry(value);
                    form.setFieldsValue({ bankCountry: value });
                  }}
                  optionFilterProp="children"
                  optionlist={countriesAsOptions}
                  placeholder={"Select Country"}
                  disabled={!!beneCountry}
                />
              </Form.Item>
            )}
            <Spin loading={isBeneValidationFieldsFetching}>
              {DynamicFormItem}
            </Spin>
          </Form>
        </>
      }
      modalView={showModal}
      onClickCancel={() => modalResetOnClose()}
      buttonOkDisabled={submitButtonDisabled}
      btnLoading={isBeneficiaryCreationLoading}
      modalWidth={600}
      title="New Beneficiary"
      subTitle="Enter all details required to add a new beneficiary."
      onCancelText="Cancel"
      onOkText="Add Beneficiary"
    />
  );
};

export { NewBeneficiaryModal };
