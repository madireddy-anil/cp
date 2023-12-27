import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import {
  Modal as DSModal,
  Form as DSForm,
  Text,
  Input,
  Notification
} from "@payconstruct/design-system";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks/store";
import {
  useAddNewOnboardClientMutation,
  useGetGroupsByIdQuery
} from "../../../services/onBoardClientService";
import {
  useRefreshTokenMutation,
  useGetUserByIdQuery
} from "../../../services/authService";
import {
  selectCurrentUserId,
  setEntityId
} from "../../../config/auth/authSlice";
import { updateShowOnboardModal } from "../../../config/onBoarding/onBoardingSlice";
import { Spacer } from "../../../components/Spacer/Spacer";
import { getClient } from "../../../services/termsOfService/actions";
import { updateSelectedCompanyStep } from "../../../config/company/companySlice";
import { updateSelectedStep } from "../../../config/document/documentSlice";

interface OnboardNewEntityProps {
  show: boolean;
}
export const OnboardNewEntity: React.FC<OnboardNewEntityProps> = ({ show }) => {
  const [form] = DSForm.useForm();
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [newEntityGroup, setNewEntityGroup] = useState<boolean>(false);
  const userId = useAppSelector(selectCurrentUserId);
  const groupId = useAppSelector(
    (state) => state.auth.profile?.entity?.genericInformation?.groupId
  );
  const token = useAppSelector((state) => state.auth.token);
  const refreshToken = useAppSelector((state) => state.auth.refresh_token);

  /*
        Adding Onboard New Entity Details
    */
  const [addNewOnboardClient, { data: newEntity, isLoading }] =
    useAddNewOnboardClientMutation();

  // const { refetch: getGroupById } = useGetGroupsByIdQuery(groupId);

  const { refetch: getGroupById, groupName } = useGetGroupsByIdQuery(groupId, {
    selectFromResult: ({ data }) => ({
      groupName: data?.data?.groupName
    }),
    refetchOnMountOrArgChange: true
  });

  const [
    getRefreshAccessToken,
    { isSuccess: isRefreshTokenSuccess, isLoading: isRefreshTokenLoading }
  ] = useRefreshTokenMutation();

  /*
        Get Profile Data By Api Query
    */
  // const { isSuccess: isProfileSuccess } = useGetProfileQuery("getProfile", {
  //   skip: !isSuccess
  // });

  const { refetch: getUserByID } = useGetUserByIdQuery(userId);

  useEffect(() => {
    if (isRefreshTokenSuccess) {
      const createdEntityId = newEntity?.data?.id;
      dispatch(setEntityId(createdEntityId));
      const data = {
        clientId: createdEntityId,
        token: token,
        selectedEntityId: createdEntityId
      };
      getUserByID();
      dispatch(getClient(data));
      dispatch(updateShowOnboardModal(false));

      // reset all steps
      dispatch(updateSelectedCompanyStep(0));
      dispatch(updateSelectedStep(0));
      navigate("/account-setup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefreshTokenSuccess]);

  useEffect(() => {
    if (groupName) {
      form.setFieldsValue({ groupName: groupName });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupName]);

  const submitForm = async (formData: any) => {
    const { registeredCompanyName, groupName } = formData;
    try {
      await addNewOnboardClient({
        userId,
        registeredCompanyName,
        groupName
      }).unwrap();
      form.resetFields();
      getRefreshAccessToken({
        refresh_token: refreshToken,
        isAccessTokenRequired: true
      });
    } catch (err: any) {
      Notification({
        type: "error",
        message: intl.formatMessage({ id: "onboardNewClientErrMsg" })
      });
    }
  };

  const proceedWithAddNewEntity = () => {
    getGroupById();
    setNewEntityGroup(true);
  };

  return (
    <>
      <DSModal
        modalView={show}
        modalWidth={500}
        btnLoading={isLoading || isRefreshTokenLoading}
        description={
          !newEntityGroup ? (
            <>
              <div className="onboardNewEntity" style={{ textAlign: "center" }}>
                <Text size="large" weight="bold" label="Are you sure?" />
                <br />
                <Spacer size={15} />
                <Text
                  size="small"
                  weight="regular"
                  label="You are about to begin onboarding a new entity for your group."
                />
              </div>
            </>
          ) : (
            <>
              <Text size="large" weight="bold" label="Onboard New Entity" />
              <Spacer size={30} />
              <div style={{ height: "140px" }}>
                <DSForm
                  form={form}
                  initialValues={{
                    groupName: groupName
                  }}
                  onFinish={submitForm}
                >
                  <DSForm.Item name={"registeredCompanyName"}>
                    <Input
                      type={"text"}
                      size={"medium"}
                      name={"registeredCompanyName"}
                      label={"New entities registered company name"}
                      required={true}
                      message={"Group field cannot be empty!"}
                    />
                    <DSForm.Item name={"groupName"}>
                      <Input
                        type={"text"}
                        size="medium"
                        name={"groupName"}
                        label={"Associated group name"}
                        required={true}
                        message={"Associated field cannot be empty!"}
                      />
                    </DSForm.Item>
                  </DSForm.Item>
                </DSForm>
              </div>
            </>
          )
        }
        onCancelText={"Cancel"}
        onOkText={newEntityGroup ? "Onboard new entity" : "Proceed"}
        onClickCancel={() => {
          dispatch(updateShowOnboardModal(false));
        }}
        onClickOk={
          !newEntityGroup
            ? () => proceedWithAddNewEntity()
            : () => !isLoading && form.submit()
        }
      />
    </>
  );
};
