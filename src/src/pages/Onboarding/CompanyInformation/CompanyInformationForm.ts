import { companyTypeOptions } from "./CompanyTypeOptions";
import { store } from "../../../redux/store";

const state = store.getState();
const { countries } = state.countries;
const { initialCompanyInfoFormData } = state.companyInformation;

export const formatCountriesListForOptionSet = (countries: any) => {
  return (countries || []).map((item: any) => {
    return [item.name, item.name];
  });
};

export const addressFields = [
  "buildingName",
  "buildingNumber",
  "city",
  "country",
  "floor",
  "postCode",
  "room",
  "street"
];

export const otherFields = [
  "companyNumber",
  "companyType",
  "registeredCompanyName",
  "tradingName",
  "websiteAddress"
];

export const formData = [
  {
    index: "ddd",
    type: "text",
    name: "registeredCompanyName",
    label: "Registered Company Name",
    required: true,
    message: "Registered Company Name is required!",
    tooltip:
      "Ensure this is information about the entity you are planning to contract with us"
  },
  {
    index: "ddd",
    type: "select",
    name: "companyType",
    label: "Company Type",
    required: true,
    message: "Company Type is required",
    options: companyTypeOptions,
    optionFilterProp: "children"
  },
  {
    type: "input",
    name: "tradingName",
    label: "Trading Name",
    required: true,
    message: "Trading Name is required!"
  },
  {
    type: "input",
    name: "companyNumber",
    label: "Company Number",
    required: true,
    message: "Company Number is required!",
    tooltip: "You’ll find this on your certificate of incorporation"
  },
  // {
  //   type: "formlist",
  //   name: "websiteAddress",
  //   label: "Website Address",
  //   required: true,
  //   message: "Website Address is required!",
  //   btnLabel: "Add website address"
  // },
  {
    type: "headerText",
    label: "Registered company address",
    style: { marginBottom: "37px", fontSize: "14px", fontWeight: 600 }
  },
  {
    type: "select",
    name: "country",
    label: "Country",
    required: true,
    message: "Country is required!",
    options: formatCountriesListForOptionSet(countries)
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
      },
      {
        type: "text",
        name: "buildingName",
        label: "Building Name",
        required: false,
        message: "Building Name is required!"
      },
      {
        type: "input",
        name: "buildingNumber",
        label: "Building Number",
        required: false,
        message: "Building Number is required!"
      }
    ]
  },
  {
    type: "text",
    name: "street",
    label: "Street",
    required: true,
    message: "Street is required!"
  },
  {
    name: "form-vertical-b",
    type: "formVertical",
    formData: [
      {
        type: "input",
        name: "city",
        label: "City",
        required: true,
        message: "City is required!"
      },
      {
        type: "text",
        name: "postCode",
        label: "ZIP Code",
        required: true,
        message: "ZIP Code is required!"
      }
    ]
  },
  {
    type: "checkbox",
    name: "principalAddress",
    label: "Principal place of business is the same as the company address",
    checked: true,
    style: { marginBottom: "-5px" }
  },
  {
    type: "checkbox",
    name: "postalAddress",
    label: "Postage address is the same as the company address",
    checked: true
  }
];

export const forexIndustries = [
  ["broker", "Broker"],
  ["platform service/provider", "Platform- or Service provider"]
];
export const gamingIndustries = [
  ["operator", "Operator"],
  ["platform service/provider", "Platform- or Service provider"]
];

export const industries = [
  {
    type: "headerText",
    label: "Other information",
    style: { marginBottom: "20px", fontSize: "14px", fontWeight: 600 }
  },
  {
    name: "industry",
    type: "groupInput",
    required: true,
    verticalView: true,
    subText: "Tick all that apply",
    message: "",
    optionsSetOne: [
      ["forex", "I’m in the Forex- or CFD industry"],
      ["gambling", "I’m in the Gaming or Gambling industry"],
      ["other", "My industry is not listed"]
    ],
    optionsSetTwo:
      initialCompanyInfoFormData?.industry === "gambling"
        ? gamingIndustries
        : forexIndustries,
    subInputField: {
      name: "otherComment",
      type: "otherInput",
      label: "Other",
      required: true,
      style: { width: "300px" }
    }
  }
];
