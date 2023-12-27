import React, { useState } from "react";
import { Checkbox } from "antd";
import {
  Text,
  Form,
  DynamicForm,
  Icon,
  Row,
  Col,
  Button,
  Select,
  Tooltip,
  Notification
} from "@payconstruct/design-system";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks/store";

import {
  useGetListOfPeopleQuery,
  useAddNewPeopleMutation
} from "../../../services/peopleService";
// import { useUpdateClientInfoMutation } from "../../../services/companyService";

import {
  resetFormToInitial,
  updateLatestCreatedRecord
} from "../../../config/people/peopleSlice";
import { updateSelectedStep } from "../../../config/document/documentSlice";
import {
  totalSharePercentOfPeople
  // generateRandomName
} from "../../../config/transformer";
import {
  calculationOnIdvInvitorsandPercent,
  calculateRiskOnSharePercentage
} from "./PeopleLogicFun";

import Style from "./People.module.css";
import { HeaderRow } from "../Components/Header";

const Definition = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  /* state */
  const {
    listOfPeoples,
    onPersonAddedSuccessfully,
    btnLoading,
    latestCreatedRecord,
    totalPeopleSharePercent,
    isAuthorisedToAcceptTerms
  } = useAppSelector((state) => state.people);
  // const entityId = useAppSelector(selectEntityId);

  const { progressLogs, overAllRiskCategory } = useAppSelector(
    (state) => state.company
  );
  const { industries } = useAppSelector((state) => state.companyInformation);
  const isCompanyStakeholdersAddedDone = useAppSelector(
    (state) => state.company.progressLogs.isCompanyStakeholdersAddedDone
  );

  const { countries } = useAppSelector((state) => state.countries);
  const [btnDisabled, setBtnDisabled] = React.useState(false);
  const [role, setRole] = useState<any>([]);
  const [director] = useState("director");
  const [percentage] = useState("percentage");
  // const [randomName] = useState(generateRandomName);

  /* query */
  // const {
  //   // refetch,
  //   isSuccess: isAllPeopleFetched,
  //   data: allPeople
  // } = useGetListOfPeopleQuery("getPeople");

  useGetListOfPeopleQuery("People");

  /* mutation */
  const [addNewPeople] = useAddNewPeopleMutation();
  // const [updateCustomerInfo] = useUpdateClientInfoMutation();

  // useEffect(() => {
  //   if (listOfPeoples) {
  //     // const addedPeople = listOfPeoples ? listOfPeoples : [];
  //     const status = {
  //       ...progressLogs
  //       // isCompanyStakeholdersAddedDone:
  //       //   totalSharePercentOfPeople(addedPeople) === 100
  //     };
  //     const data = {
  //       clientId: entityId,
  //       data: { progressLogs: status }
  //     };
  //     updateCustomerInfo(data).unwrap();
  //   }
  //   // refetch();
  //   // eslint-disable-next-line
  // }, [listOfPeoples]);

  const phoneTypeOptions = countries.map((option: any) => {
    return {
      value: option.name,
      label: `+${option.telephonePrefix} ${option.alpha2Code}`
    };
  });

  const PhoneTypeSelect = (
    <Form.Item name={"phoneNumberCountryCode"} noStyle>
      <Select
        defaultValue={<span>+ 44</span>}
        options={phoneTypeOptions}
        optionFilterProp="children"
        filterOption={(input: any, option: any | undefined) =>
          option?.value?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0 ||
          option?.label?.indexOf(input) >= 0
        }
        dropdownStyle={{ minWidth: "10%" }}
      />
    </Form.Item>
  );

  const initialFormFields = [
    {
      name: "role",
      type: "select",
      label: "Role",
      required: true,
      message: "Role is required!",
      mode: "multiple",
      options: !progressLogs?.isAllDirectorsAdded
        ? [
            ["Shareholder", "Shareholder"],
            ["Director", "Director"]
          ]
        : [["Shareholder", "Shareholder"]]
    },
    {
      type: "text",
      name: "firstName",
      label: "First Name",
      required: true,
      message: "First Name is required!"
    },
    {
      type: "text",
      name: "lastName",
      label: "Last Name",
      required: true,
      message: "Last Name is required!"
    },
    {
      type: "email",
      name: "email",
      label: "Email Address",
      required: true,
      message: "Email Address is required!"
    },
    {
      type: "text",
      name: "phoneNumber",
      label: "Phone Number",
      required: true,
      message: "Phone Number is required!",
      className: "phonenumber",
      pattern: /^[0-9\b]+$/,
      addonBefore: PhoneTypeSelect
    },
    {
      type: "number",
      sizeType: "large",
      min: "0",
      max: "100",
      name: "percentageOfShares",
      label: "Share Percentage",
      required: true,
      message: "Share Percentage is required!",
      style: { width: "100%", padding: "6px 0px" }
    }
  ];

  const [formFields, updateFormFields] = useState([initialFormFields[0]]);

  const getCountToVerifyDirectors = (allpeople: any) => {
    let countOfDirector = 0;
    allpeople.forEach((countNo: any) => {
      const { role } = countNo;
      if (role.includes("Director")) countOfDirector += 1;
    });
    return countOfDirector;
  };

  const totalCountOfAllDirectorsIdvScreenRequired = (allpeople: any) => {
    let screeningCounts = 0;
    allpeople.forEach((countNo: any) => {
      if (
        countNo?.isIdvScreeningRequired &&
        countNo?.role?.includes("Director")
      )
        screeningCounts += 1;
    });
    return screeningCounts;
  };

  const handleOnFinish = (values: any) => {
    // add default country code
    const selectedCountry = countries?.find(
      (country: any) => country?.name === values?.phoneNumberCountryCode
    );
    values.phoneNumberCountryCode = selectedCountry?.telephonePrefix
      ? selectedCountry?.telephonePrefix
      : "44";

    // TODO: not used anywhere here, commented for now
    // const sharePercent = values?.percentageOfShares;
    const sharePercentage = values.percentageOfShares;
    const role = values.role;
    const totalCountDirectorsToVerify = calculationOnIdvInvitorsandPercent({
      overAllRiskCategory,
      director,
      industries
    });
    const totalDirectors = getCountToVerifyDirectors(listOfPeoples);

    const screeningCount =
      totalCountOfAllDirectorsIdvScreenRequired(listOfPeoples);

    const idvScreening = calculateRiskOnSharePercentage({
      sharePercentage,
      role,
      overAllRiskCategory,
      industries
    });

    //To Be Deleted once people edit Idv btn Issue Tested with new logic
    // const validationOnScreening =
    //   (idvScreening && totalCountDirectorsToVerify === "All") ||
    //   (parseInt(totalCountDirectorsToVerify) > totalDirectors &&
    //     (totalCountDirectorsToVerify === "All" ||
    //       parseInt(totalCountDirectorsToVerify) > screeningCount));

    const getDirectorsValidationOnScreening = () => {
      let validationResponse = false;
      if (totalCountDirectorsToVerify === "All") {
        validationResponse = true;
      } else {
        if (parseInt(totalCountDirectorsToVerify) <= totalDirectors) {
          if (screeningCount >= parseInt(totalCountDirectorsToVerify)) {
            validationResponse = false;
          } else {
            validationResponse = true;
          }
        } else {
          validationResponse = true;
        }
      }
      return idvScreening && validationResponse;
    };

    if (totalSharePercentOfPeople(listOfPeoples) <= 100) {
      values.isIdvScreeningRequired = values.role.includes("Director")
        ? getDirectorsValidationOnScreening()
        : idvScreening;
    } else {
      values.isIdvScreeningRequired = false;
    }

    let num;
    if (values.percentageOfShares) {
      const needMorePercent = 100 - totalSharePercentOfPeople(listOfPeoples);
      const sharePercent =
        values.percentageOfShares > needMorePercent
          ? needMorePercent
          : values?.percentageOfShares;
      num = sharePercent.toString();
      values.percentageOfShares = num;
    }

    let totalShare = 0;
    let isEmailUnique = true;
    for (let i = 0; i < listOfPeoples.length; i++) {
      totalShare += listOfPeoples[i].percentageOfShares
        ? parseInt(listOfPeoples[i].percentageOfShares)
        : 0;
      if (listOfPeoples[i]["email"] === values["email"]) {
        isEmailUnique = false;
      }
    }

    // if (
    //   (totalShare + parseInt(values.percentageOfShares) <= 100 ||
    //     values.percentageOfShares === undefined) &&
    //   isEmailUnique
    // ) {
    //   addNewPeople(values);
    // }

    const isPersonAuthorisedTermsService =
      isAuthorisedToAcceptTerms?.includes(true) ||
      values.isAuthorisedToAcceptTerms;

    // terms service validation check
    if (values?.role.includes("Director")) {
      !isPersonAuthorisedTermsService &&
        Notification({
          type: "warning",
          message:
            "At least one director must be authorised to accept the terms of service!"
        });
    }

    // submit the form
    // TODO: not used anywhere here, commented for now
    // const enteredSharePercent: any = values?.percentageOfShares
    //   ? sharePercent
    //   : "0";

    if (totalShare >= 100 && values?.role.includes("Shareholder")) {
      Notification({
        type: "warning",
        message:
          "The total share percentage entered is over 100, Can't add anymore shareholder!"
      });
    } else {
      if (isEmailUnique) {
        if (values?.role.includes("Director")) {
          isPersonAuthorisedTermsService && addNewPeople(values);
        } else addNewPeople(values);
      } else {
        Notification({
          type: "error",
          message: "The entered email id already exists, try different one."
        });
      }
    }

    dispatch(updateLatestCreatedRecord(values));
  };

  const onClickSeeVerification = () => {
    dispatch(updateSelectedStep(2));
    resetToInitial();
  };

  const resetToInitial = () => {
    form.resetFields();
    dispatch(resetFormToInitial());
  };

  const handleOnRoleSelected = (e: any, value: any) => {
    if (value?.role?.length > 0) {
      setRole(value?.role);
      const formFields = initialFormFields.filter((el: any) =>
        !value.role.includes("Shareholder") || totalPeopleSharePercent >= 100
          ? el.name !== "percentageOfShares"
          : el.name
      );
      updateFormFields(formFields);
    }
    const remainingPercent = 100 - totalPeopleSharePercent;
    if (value.percentageOfShares > remainingPercent) {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
    if (value?.role?.length === 0) {
      setRole(value?.role);
      const formFields = initialFormFields.filter(
        (el: any) => el.name === "role"
      );
      updateFormFields(formFields);
    }
  };

  const getEmailAddress = () => {
    if (listOfPeoples.length > 0) {
      return listOfPeoples[0]["email"];
    }
    return "";
  };

  const getCustomButtons = () => {
    const remainingPercent = 100 - totalPeopleSharePercent;
    return (
      <>
        {role?.includes("Shareholder") && remainingPercent !== 0 && (
          <div style={{ marginTop: "-20px", marginBottom: "20px" }}>
            Remaining percentage left <b>{100 - totalPeopleSharePercent}</b>
            {" %"}
          </div>
        )}
        {role?.includes("Director") && (
          <Tooltip text="At least one director must be authorised to accept the terms of service.">
            <Form.Item
              valuePropName="checked"
              name={"isAuthorisedToAcceptTerms"}
            >
              <Checkbox>
                This person is authorised to accept the terms of service
              </Checkbox>
            </Form.Item>
          </Tooltip>
        )}
      </>
    );
  };

  return (
    <div className={Style["verficationStatus__wrapper"]}>
      {/* <Header
        header="Please define all Shareholders / Directors  for the
          contracting entity below"
        subHeader=""
      /> */}
      <HeaderRow
        headerText="Please define all Shareholders / Directors  for the
         contracting entity below"
        subHeaderText=""
        status={isCompanyStakeholdersAddedDone}
      />
      <div className={Style["definition__imptNote--header"]}>
        <Text label={"Important Note:"} weight={"bold"} />
      </div>
      <div>
        <div style={{ marginTop: "8px" }}>
          1. Please add all shareholders, we will need to verify any shareholder
          holding a percentage of shares equal to or over{" "}
          <b>
            {calculationOnIdvInvitorsandPercent({
              overAllRiskCategory,
              percentage,
              industries
            })}
          </b>{" "}
          %.
        </div>
        <div style={{ marginTop: "8px" }}>
          2. Please add{" "}
          <b>
            {calculationOnIdvInvitorsandPercent({
              overAllRiskCategory,
              director,
              industries
            })}
          </b>
          &nbsp;directors of the contracting company, we will need to verify
          them.
        </div>
      </div>
      {!onPersonAddedSuccessfully ? (
        <div className={Style["definition__form"]}>
          <Row>
            <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }}>
              <DynamicForm
                form={form}
                isCancelBtnEnabled={false}
                formData={formFields}
                onValuesChange={handleOnRoleSelected}
                onFinish={handleOnFinish}
                btnLoading={btnLoading}
                onSubmitLabel="Save Details"
                customButtons={getCustomButtons()}
                isBtnDisable={btnDisabled}
              />
            </Col>
          </Row>
        </div>
      ) : (
        <div>
          {latestCreatedRecord?.email && (
            <div className={Style["definition__success--wrapper"]}>
              <div className={Style["definition__success--icon"]}>
                <Icon name={"checkCircle"} size={"medium"} />
              </div>
              {latestCreatedRecord?.isIdvScreeningRequired ? (
                <p className={Style["definition__success--text"]}>
                  {getEmailAddress()}
                </p>
              ) : (
                <Text weight="bold" label="Updated successfully!" />
              )}
            </div>
          )}
          <div className={Style["definition__bottom"]}>
            <div className={Style["definition__verificationStatus"]}>
              <Button
                type="secondary"
                size="large"
                label="See Verification Status"
                onClick={onClickSeeVerification}
              />
            </div>
            <div>
              <Button
                type="primary"
                label="Add a person"
                icon={{
                  name: "add",
                  position: "left"
                }}
                onClick={resetToInitial}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Definition as default };
