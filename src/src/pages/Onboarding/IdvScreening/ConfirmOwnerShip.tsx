import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { store } from "../../../redux/store";

import {
  Form,
  ConfirmOwnerShip,
  Alert,
  DynamicForm
} from "@payconstruct/design-system";

import { useAppDispatch } from "../../../redux/hooks/store";
import { useGetClientInformationIdvQuery } from "../../../services/gppService";
import { useGetCountriesQuery } from "../../../services/countriesService";

import {
  updateUserId,
  updateOnSubmitOwnerShipValues
} from "../../../config/idvScreening/idvScreeningSlice";

import {
  formatCountryDocuments,
  formatCountryStates,
  getRoles
} from "./Transformer";

import { countryDocuments, defaultCountryDocs } from "./ConfirmOwnerShipForm";

const ConfirmOwnerShipIdentity: React.FC = () => {
  const [form] = Form.useForm();
  const state = store.getState();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const query = new URLSearchParams(location.search);
  const userId = query.get("invite_token");

  const { countries } = state.countries;
  const { clientName, invitor, companyName, role } = state.idvScreening;

  const [docLists, setDocList] = useState([]);
  const [states, setStates] = useState([]);
  const [initialState, setInitialState] = useState("");
  const [isStateFieldEnabled, setIsStateFieldEnabled] = useState(false);
  const [isTruNSupportCountry, setIsTruNSupportCountry] =
    useState<boolean>(false);

  dispatch(updateUserId(userId));

  const { refetch: getAllCountries } = useGetCountriesQuery("Countries");
  const {
    refetch: getUserInformation,
    isSuccess,
    error
  } = useGetClientInformationIdvQuery(userId);

  useEffect(() => {
    getUserInformation();
    getAllCountries();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFieldsChange = (data: any, values: any) => {
    const selectedCountry = data !== undefined && data[0]?.value;
    if (data !== undefined && data[0]?.name[0] === "documentIssuerCountry") {
      if (
        selectedCountry === "Canada" ||
        selectedCountry === "United States of America" ||
        selectedCountry === "Australia"
      ) {
        setInitialState("");
        setIsStateFieldEnabled(true);
        form.setFieldsValue({ documentType: "", documentIssuerState: "" });
        const filterCountryStates = countryDocuments.filter(
          (el) => el.country === selectedCountry
        );
        if (
          filterCountryStates !== undefined &&
          filterCountryStates.length > 0
        ) {
          const countryStates = formatCountryStates(filterCountryStates);
          setStates(countryStates);
        }
      } else {
        setIsStateFieldEnabled(false);
        form.setFieldsValue({ documentType: "" });
        const filterCountryDocument = countryDocuments.filter(
          (el) => el.country === selectedCountry
        );
        if (
          filterCountryDocument !== undefined &&
          filterCountryDocument.length > 0
        ) {
          const countryDocs = formatCountryDocuments(
            filterCountryDocument[0]?.documents
          );
          setIsTruNSupportCountry(true);
          setDocList(countryDocs);
        } else {
          setIsTruNSupportCountry(false);
          // const defaultList: any = [];
          // incase if need to enable default list uncomment below code
          const defaultList: any = defaultCountryDocs;
          setDocList(defaultList);
        }
      }
    }
    if (data !== undefined && data[0]?.name[0] === "documentIssuerState") {
      form.setFieldsValue({ documentType: "" });
      setIsTruNSupportCountry(true);
      const filterCountryDocument = countryDocuments.filter(
        (el) => el.state === selectedCountry
      );
      if (
        filterCountryDocument !== undefined &&
        filterCountryDocument.length > 0
      ) {
        const countryDocs = formatCountryDocuments(
          filterCountryDocument[0]?.documents
        );
        setDocList(countryDocs);
      }
    }
  };

  const formatCountriesListForOptionSet = (countries: any) => {
    return (countries || []).map((item: any) => {
      return [item.name, item.name];
    });
  };

  const formData = [
    {
      type: "headerText",
      label:
        "If you are not a director or shareholder for the specified entity above, please close this window.",
      style: {
        marginBottom: "40px",
        marginTop: "-11px",
        fontSize: "13px",
        opacity: "0.6"
      }
    },
    {
      name: "dateofBirth",
      type: "datePicker",
      label: "Date",
      placeholder: "Date Of Birth",
      picker: "date",
      required: true,
      message: "Date of Birth is required!",
      style: { width: "100%" },
      format: "YYYY/MM/DD",
      disabledDate: true
    },
    {
      type: "headerText",
      label: "Your Registered Address",
      style: {
        marginBottom: "20px",
        fontSize: "14px",
        fontWeight: 600
      }
    },
    {
      type: "select",
      name: "country",
      label: "Country",
      required: true,
      message: "Country is required!",
      options: formatCountriesListForOptionSet(countries),
      style: { marginBottom: "40px" }
    },
    {
      name: "form-vertical-a",
      type: "formVertical",
      formData: [
        {
          type: "text",
          name: "room",
          label: "Apartment",
          required: false,
          message: "Apartment is required!"
        },
        {
          type: "text",
          name: "floor",
          label: "Floor",
          required: false,
          message: "Floor is required!"
        }
      ]
    },
    {
      name: "form-vertical-b",
      type: "formVertical",
      formData: [
        {
          type: "input",
          name: "buildingNumber",
          label: "Building Number",
          required: false,
          message: "Building Number is required!"
        },
        {
          type: "input",
          name: "buildingName",
          label: "Building Name",
          required: false,
          message: "Building Name is required!"
        }
      ]
    },
    {
      name: "form-vertical-c",
      type: "formVertical",
      formData: [
        {
          type: "input",
          name: "city",
          label: "Town or City",
          required: true,
          message: "Town or City is required!"
        },
        {
          type: "text",
          name: "street",
          label: "Street",
          required: true,
          message: "Street is required!"
        }
      ]
    },
    {
      name: "form-vertical-d",
      type: "formVertical",
      formData: [
        {
          type: "input",
          name: "postBox",
          label: "Post Box",
          required: true,
          message: "Post Box is required!"
        },
        {
          type: "text",
          name: "postCode",
          label: "Postal Code / Zip Code",
          required: true,
          message: "Postal Code / Zip Code is required!"
        }
      ]
    },
    {
      type: "headerText",
      label: "Select the document you’d like to verify",
      style: {
        marginBottom: "20px",
        fontSize: "14px",
        fontWeight: 600
      }
    },
    {
      type: "select",
      name: "documentIssuerCountry",
      label: "Document Country of Issue",
      required: true,
      message: "Document Country of Issue is required!",
      options: formatCountriesListForOptionSet(countries),
      optionFilterProp: "children",
      style: { marginBottom: "40px" }
    },
    isStateFieldEnabled && {
      type: "select",
      name: "documentIssuerState",
      label: "Document Country of State",
      required: true,
      message: "Document Country of State is required!",
      options: states,
      optionFilterProp: "children",
      style: { marginBottom: "40px" }
    },
    {
      type: "select",
      name: "documentType",
      label: "Selected Document",
      required: true,
      message: "Selected Document is required!",
      options: docLists,
      style: { marginBottom: "40px" }
    }
  ];

  const onFinish = (values: any) => {
    const dob = values["dateofBirth"].format("YYYY-MM-DD");
    values.dateOfBirth = dob;
    delete values["dateofBirth"];
    let returnResp: any;
    countryDocuments.map((item: any) => {
      if (values?.documentIssuerState) {
        if (item.state === values?.documentIssuerState) {
          returnResp = item.documents.filter(
            (countryCode: any) => countryCode.code === values.documentType
          );
        }
      } else {
        if (item.country === values?.documentIssuerCountry) {
          returnResp = item.documents.filter(
            (countryCode: any) => countryCode.code === values.documentType
          );
        }
      }
      return returnResp;
    });
    if (isTruNSupportCountry) {
      values.selectedDoc = returnResp[0];
    }
    dispatch(updateOnSubmitOwnerShipValues(values));
    isTruNSupportCountry
      ? navigate("/screening-scan-documents")
      : navigate("/screening-upload-documents");
  };

  const loader = () => {
    const errorRes: any = error;
    const apiResp = errorRes !== undefined && errorRes.data;
    return (
      <Alert
        type={!isSuccess ? "error" : "info"}
        message={
          !isSuccess
            ? `Loading to ${apiResp?.status ? apiResp.status : "page..."}...`
            : "Loading wait..."
        }
        description={!isSuccess && apiResp.message}
      />
    );
  };

  return (
    <main style={{ height: "180vh" }}>
      {isSuccess ? (
        <ConfirmOwnerShip
          // logo="Orbital"
          title="Confirm Ownership"
          subTitle={`Hi ${clientName}, ${invitor} told us that you are a ${getRoles(
            role
          )} of`}
          companyName={companyName}
          content={
            <DynamicForm
              form={form}
              initialValues={{ documentIssuerState: initialState }}
              formData={formData}
              onSubmitLabel="Verify your identity"
              okBtnWidth="full"
              btnAlign="center"
              onFieldsChange={onFieldsChange}
              onFinish={onFinish}
            />
          }
        />
      ) : (
        <div style={{ padding: "85px" }}>{loader()}</div>
      )}
    </main>
  );
};

export default ConfirmOwnerShipIdentity;
