import React, { useEffect, useState } from "react";
import {
  Cards,
  Header,
  Form,
  Select,
  Spin,
  Notification,
  Button,
  Row,
  Col,
  Checkbox,
  Text,
  Icon
} from "@payconstruct/design-system";
import { Spacer } from "../../../../components/Spacer/Spacer";

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/store";

import {
  useGetListOfPeopleQuery,
  useRemovePeopleMutation,
  useUpdatePeopleDetailsMutation
} from "../../../../services/peopleService";
import { previousStepAction } from "../../../../config/document/documentSlice";

import { useInvitePeopleMutation } from "../../../../services/gppService";
import { useUpdateClientInfoMutation } from "../../../../services/companyService";

import {
  disableStepOnLoading,
  updateTempDeletionId
} from "../../../../config/people/peopleSlice";
import {
  getBtnLabel,
  getCountOnDirectors,
  calculateRiskOnSharePercentage,
  calculationOnIdvInvitorsandPercent
} from "../PeopleLogicFun";
import {
  totalSharePercentOfPeople
  // generateRandomName
} from "../../../../config/transformer";

import Style from "../People.module.css";
import { selectEntityId } from "../../../../config/auth/authSlice";

const VerificationStatus: React.FC = () => {
  const dispatch = useAppDispatch();

  /* State */
  const entityId = useAppSelector(selectEntityId);
  const { listOfPeoples } = useAppSelector((state) => state.people);
  const isPeopleFetching = useAppSelector(
    (state) => state.people.isPeopleFetching
  );
  const { countries } = useAppSelector((state) => state.countries);
  const { overAllRiskCategory, industries, progressLogs } = useAppSelector(
    (state) => state.company
  );

  const [unUsed] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<any>({});
  // const [randomName] = useState(generateRandomName);
  const [director] = useState("director");
  //const [percentage] = useState("percentage");

  const [toggleFields, updateFields] = useState<boolean | undefined>(undefined);

  /* Query */
  // const {
  //   // refetch: getAllPeople,
  //   isSuccess: isGetAllPeopleSuccess,
  //   isLoading: isAllPeopleFetching
  // } = useGetListOfPeopleQuery("getPeople");

  useGetListOfPeopleQuery("People");

  /* Mutations */
  const [
    removePeople,
    { isSuccess: isDeleteSuccess, isLoading: isRecordDeleted }
  ] = useRemovePeopleMutation();
  const [
    updatePeopleDetails,
    { isSuccess: isPeopleUpdatedSuccess, isLoading: createLoader }
  ] = useUpdatePeopleDetailsMutation();
  const [invitePeople, { isSuccess: isInviteLinkSentSuccess }] =
    useInvitePeopleMutation();

  const [updateCustomerInfo, { isLoading }] = useUpdateClientInfoMutation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    dispatch(disableStepOnLoading(isLoading));
  }, [dispatch, isLoading]);

  useEffect(() => {
    if (isDeleteSuccess || isPeopleUpdatedSuccess) {
      // getAllPeople();
    }
    if (isPeopleUpdatedSuccess) {
      setEditMode(false);
    }
    if (listOfPeoples) {
      const isDirectorExist: any = getCountOnDirectors(listOfPeoples);
      !isDirectorExist?.includes("Director") &&
        progressLogs?.isAllDirectorsAdded &&
        updateIsAllDirectorsDone(false);
      updateProgressLogUponPeople();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteSuccess, isPeopleUpdatedSuccess, listOfPeoples]);

  useEffect(() => {
    if (isInviteLinkSentSuccess) {
      Notification({
        type: "success",
        message: "Email sent success!"
      });
    }
  }, [isInviteLinkSentSuccess]);

  const updateProgressLogUponPeople = () => {
    const isDirectorExist = getDirectors();
    const idvScreeningRequiredPeoples = listOfPeoples?.filter(
      (people: any) => people?.isIdvScreeningRequired === true
    );
    const isAllCompletedScreening = idvScreeningRequiredPeoples.length
      ? idvScreeningRequiredPeoples.every(
          (people: any) => people?.isIdvScreeningDone === true
        )
      : false;
    if (
      totalSharePercentOfPeople(listOfPeoples) === 100 &&
      isDirectorExist?.includes("Director") &&
      isAllCompletedScreening
    ) {
      const status = {
        ...progressLogs,
        isCompanyStakeholdersAddedDone: true
      };
      const data = {
        clientId: entityId,
        data: { progressLogs: status }
      };
      updateCustomerInfo(data).unwrap();
    } else {
      const status = {
        ...progressLogs,
        isCompanyStakeholdersAddedDone: false
      };
      const data = {
        clientId: entityId,
        data: { progressLogs: status }
      };
      updateCustomerInfo(data).unwrap();
    }
  };

  const getDirectors = () => {
    const returnResp: any[] = [];
    listOfPeoples?.length &&
      listOfPeoples?.map((people: any) => {
        if (people?.role?.length && people?.role?.includes("Director")) {
          return returnResp.push("Director");
        }
        return returnResp;
      });
    return returnResp;
  };

  const phoneTypeOptions = countries.map((option: any) => {
    return {
      value: `+${option.telephonePrefix}`,
      label: `+${option.telephonePrefix}`
    };
  });

  const PhoneTypeSelect = (
    <Form.Item name={"phoneNumberCountryCode"} noStyle>
      <Select defaultValue={<span>+ 44</span>} options={phoneTypeOptions} />
    </Form.Item>
  );

  const initialFormFields = [
    {
      name: "role",
      type: "select",
      label: "Role",
      required: true,
      disabled: true,
      message: "Role is required!",
      mode: "multiple",
      options: [
        ["Shareholder", "Shareholder"],
        ["Director", "Director"]
      ]
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
      disabled: true,
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

  const onInviteBtnClick = (id: string) => {
    const record = listOfPeoples.find((item: any) => {
      return item.id === id;
    });
    invitePeople({
      body: {
        email: record.email,
        firstName: record.firstName,
        lastName: record.lastName
      }
    });
  };

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

  const onSave = (values: any, id: string) => {
    // add default country code
    values.phoneNumberCountryCode = values.phoneNumberCountryCode
      ? values.phoneNumberCountryCode
      : "+44";
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

    const getDirectorsValidationOnScreening = () => {
      let validationResponse = false;
      if (totalCountDirectorsToVerify === "All") {
        validationResponse = true;
      } else {
        if (parseInt(totalCountDirectorsToVerify) <= totalDirectors) {
          if (screeningCount > parseInt(totalCountDirectorsToVerify)) {
            validationResponse = false;
          } else if (screeningCount === parseInt(totalCountDirectorsToVerify)) {
            validationResponse = selectedPerson?.isIdvScreeningRequired;
          } else {
            validationResponse = true;
          }
        } else {
          validationResponse = true;
        }
      }
      return idvScreening && validationResponse;
    };
    values.isIdvScreeningRequired = values.role.includes("Director")
      ? getDirectorsValidationOnScreening()
      : idvScreening;

    const filterSkipCurrentPerson = listOfPeoples?.filter(
      (el: any) => el.id !== id
    );
    const filterCurrentPerson = listOfPeoples?.find((el: any) => el?.id === id);

    if (values.percentageOfShares) {
      const needMorePercent =
        100 - totalSharePercentOfPeople(filterSkipCurrentPerson);
      if (values.percentageOfShares > needMorePercent) {
        Notification({
          message:
            "The total share percentage entered is over 100, please review to check each share percentage is correct!",
          type: "warning"
        });
        return;
      }
    }

    let totalShare = 0;
    let isEmailUnique = true;
    unUsed && console.log(totalShare);
    for (let i = 0; i < listOfPeoples.length; i++) {
      if (listOfPeoples[i]["id"] !== id) {
        totalShare += listOfPeoples[i].percentageOfShares
          ? parseInt(listOfPeoples[i].percentageOfShares)
          : 0;
      }
      if (
        listOfPeoples[i]["email"] === values["email"] &&
        listOfPeoples[i]["id"] !== id
      ) {
        isEmailUnique = false;
      }
    }

    if (isEmailUnique) {
      if (
        filterCurrentPerson?.isAuthorisedToAcceptTerms &&
        !values.role.includes("Director")
      ) {
        // person who has accepted the terms of service, can't remove the director role
        Notification({
          message: "",
          description:
            "This person has accepted the terms of services, Please make sure Director is selected",
          type: "warning"
        });
      } else updatePeopleDetails({ id, body: values });
    }

    if (!isEmailUnique) {
      Notification({
        message: "Email id already exists!",
        type: "error"
      });
    }
  };

  const onDelete = (id: string, item: any) => {
    dispatch(updateTempDeletionId(id));
    removePeople({ id }).then(() => {
      /* 
        If user deletes a authorised person ( Director ) who assigned to accept terms in that case, we re-map to another director in our existing list.
       */

      /* Checking if another director already assigned to accept terms and condition */
      // eslint-disable-next-line array-callback-return
      const doesAnotherDirectorPresent = listOfPeoples.find((item: any) => {
        if (item.isAuthorisedToAcceptTerms && item.id !== id) {
          return item;
        }
      });

      /* Reassigning to another director and another director should done IDV Screening */
      if (item.isAuthorisedToAcceptTerms && !doesAnotherDirectorPresent) {
        // eslint-disable-next-line array-callback-return
        const anotherDirectorProfile = listOfPeoples.find((item: any) => {
          if (item.role.includes("Director") && id !== item.id) {
            return item;
          }
        });

        /* Did any director matched all scenario */
        if (anotherDirectorProfile) {
          updatePeopleDetails({
            id: anotherDirectorProfile.id,
            body: { ...anotherDirectorProfile, isAuthorisedToAcceptTerms: true }
          });
        }
      }
    });
  };

  const updateIsAllDirectorsDone = (directorsStatus: boolean) => {
    const status = {
      ...progressLogs,
      isAllDirectorsAdded: directorsStatus
    };
    const data = {
      clientId: entityId,
      data: { progressLogs: status }
    };
    updateCustomerInfo(data).unwrap();
  };

  const handleIsAllDirectorsAdded = (checkedValue: any) => {
    const isAllDirectorsAdded = checkedValue.target.checked;
    updateIsAllDirectorsDone(isAllDirectorsAdded);
  };

  /* returns list of fields  */
  const getFields = (item: any): any[] => {
    /* if on edit mode check in the role field, whether shareholder is selected, on select based on the condition we're return the fields  */
    if (editMode && toggleFields !== undefined) {
      return toggleFields
        ? initialFormFields
        : initialFormFields.slice(0, initialFormFields.length - 1);
    }

    /* based on role selection, returning the fields  */
    return (item.role?.includes("shareholder") ||
      item.role?.includes("Shareholder")) &&
      item.percentageOfShares
      ? initialFormFields
      : initialFormFields.slice(0, initialFormFields.length - 1);
  };

  const handleAddPeople = () => {
    dispatch(previousStepAction());
  };

  const allRoles: any[] = getCountOnDirectors(listOfPeoples);
  return (
    <div className={Style["verificationStatus__wrapper"]}>
      <div>
        <Header
          header={"Verification Status"}
          subHeader={
            "Track the individuals who are yet to verify themselves on this screen. When they have verified themselves the indicator will turn green."
          }
        />
        <Spacer size={10} />
        <Text
          color="#8a929d"
          label="Important note: That states the verification requirements for the entity which is currently just shown on the people page."
        />
        <Spacer size={20} />
        {allRoles.includes("Director") && (
          <Checkbox
            value="isAllDirectorsAdded"
            label="There are no further directors of this entity"
            checked={progressLogs?.isAllDirectorsAdded}
            onChange={handleIsAllDirectorsAdded}
          />
        )}
        <Spacer size={23} />
        <Button
          type="primary"
          icon={{ name: "add" }}
          label="Add people"
          onClick={handleAddPeople}
        />
        <Spin
          label="loading..."
          loading={isPeopleFetching || isRecordDeleted || isLoading}
        >
          <Row
            gutter={[16, 16]}
            className={Style["verficationStatus__cardWrapper"]}
          >
            {listOfPeoples?.map((item: any, index: any) => {
              return (
                <Col
                  key={index}
                  lg={{ span: 12 }}
                  md={{ span: 24 }}
                  sm={{ span: 24 }}
                >
                  <Cards.EditableCard
                    isFullWidth
                    formData={getFields(item)}
                    initialValues={item}
                    status={item.isIdvScreeningDone ? "approved" : "pending"}
                    tooltipText={
                      item.isIdvScreeningDone
                        ? "Verification complete"
                        : "Awaiting verification"
                    }
                    // @ts-ignore
                    isStatusShow={item.isIdvScreeningRequired}
                    // @ts-ignore
                    onEditCardFieldChange={(field) => {
                      /* On Role Field Change, checking whether shareholder field is selected. on selecting the shareholder field we're toggling the share percentage field */
                      if (field[0]?.name[0] === "role") {
                        updateFields(
                          field[0]?.value.find(
                            (val: string) => val === "Shareholder"
                          ) === "Shareholder"
                        );
                      }
                    }}
                    titleTags={item["role"]}
                    btnLabel={getBtnLabel(
                      item?.isIdvScreeningRequired,
                      item?.isInvitedForIdvScreening
                    )}
                    inputAsTitleTag="role"
                    hideInputAsTag
                    deleteTooltipLabel={
                      item?.isAuthorisedToAcceptTerms
                        ? "Please make sure before you delete this record, One person has accepted terms of service"
                        : ""
                    }
                    onSave={(values) => onSave(values, item.id)}
                    onClick={() => onInviteBtnClick(item.id)}
                    onRemove={() => onDelete(item.id, item)}
                    onEdit={() => {
                      setSelectedPerson(item);
                      setEditMode(true);
                      /* reset the state to current edit card state */
                      updateFields(
                        (item.role?.includes("shareholder") ||
                          item.role?.includes("Shareholder")) &&
                          item.percentageOfShares
                      );
                    }}
                    onCancel={() => {
                      setEditMode(false);
                    }}
                    editMode={selectedPerson?.id === item.id && editMode}
                    btnLoading={createLoader}
                    customData={
                      item.isAuthorisedToAcceptTerms && (
                        <div
                          style={{
                            marginBottom: "10px",
                            marginTop: "-19px",
                            display: "flex"
                          }}
                        >
                          <Text
                            color="#595c97"
                            size="xxsmall"
                            weight="bold"
                            label="Authorised to accept terms of service"
                          />
                          <span style={{ marginTop: "-3px" }}>
                            <Icon name="checkCircle" size="extraSmall" />
                          </span>
                        </div>
                      )
                    }
                  />
                </Col>
              );
            })}
          </Row>
        </Spin>
      </div>
    </div>
  );
};

export { VerificationStatus as default };
