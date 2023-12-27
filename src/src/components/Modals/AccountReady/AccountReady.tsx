import { useIntl } from "react-intl";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/store";
import {
  Modal as DSModal,
  CheckSvg,
  Text,
  Button
} from "@payconstruct/design-system";
import { Spacer } from "../../../components/Spacer/Spacer";
// import { useUpdateTermsOfServiceMutation } from "../../../services/authService";
import { BookMeeting } from "../../../config/plugins/BookMeeting";
import { updateShowAccountReadyModal } from "../../../config/auth/termsOfServiceDocumentSlice";

interface AccountReadyProps {
  show: boolean;
  toggleShow?: (value: boolean) => void;
}
export const AccountReady: React.FC<AccountReadyProps> = ({
  show,
  toggleShow
}) => {
  // const dispatch = useAppDispatch();
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const kycStatus = useAppSelector((state) => state.company.kycStatus);

  const [isBookMeetingEnabled, setBookMeetingEnabled] = useState(false);
  // const email = useAppSelector((state) => state.auth.email);
  // const listOfPeoples = useAppSelector((state) => state.people.listOfPeoples);
  // const [
  //   UpdateTermsOfService,
  //   {
  //     isSuccess: isTermsAccepted,
  //     isLoading: isTermsAcceptedLoader,
  //     isError: updateTermsAcceptanceFail
  //   }
  // ] = useUpdateTermsOfServiceMutation();
  // const [, setAuthorizedPersonId] = useState({
  //   authorizedPersonId: ""
  // });
  const bookAMeeting = () => {
    setBookMeetingEnabled(!isBookMeetingEnabled);
  };

  const updateTermsAuthorizedPersonId = () => {
    dispatch(updateShowAccountReadyModal(false));
    kycStatus === "pass" ? navigate("/accounts") : navigate("/account-setup");
  };

  // const updateTermsAuthorizedPersonId = () => {
  //   const person = listOfPeoples?.find(
  //     (el: any) => el.isAuthorisedToAcceptTerms === true
  //   );
  //   setAuthorizedPersonId(person?.id);
  //   UpdateTermsOfService({ authorizedPersonId: person?.id })
  //     .unwrap()
  //     .then(() => {
  //       toggleShow(false);
  //       //resetToInitialState();
  //     });
  // };
  // useEffect(() => {
  //   if (isTermsAccepted) {
  //     toggleShow(false);
  //   }
  //   if (updateTermsAcceptanceFail) {
  //     toggleShow(true);
  //   }
  // }, [isTermsAccepted, updateTermsAcceptanceFail, toggleShow]);

  return (
    <>
      <DSModal
        title={
          isBookMeetingEnabled ? intl.formatMessage({ id: "bookMeeting" }) : ""
        }
        onCancelText={
          isBookMeetingEnabled ? intl.formatMessage({ id: "back" }) : ""
        }
        onClickCancel={bookAMeeting}
        modalView={show}
        modalWidth={750}
        description={
          <>
            {!isBookMeetingEnabled ? (
              <div>
                <div style={{ textAlign: "center" }}>
                  <CheckSvg status="approved" />
                  <Spacer size={30} />
                </div>

                <div>
                  <Text
                    size="small"
                    weight="bold"
                    label="Your account is now active!"
                  />
                  <Spacer size={10} />
                  <Text
                    size="xsmall"
                    label="As the terms of service have been accepted your account has been activated."
                  />
                  <Spacer size={10} />
                  <Text
                    size="xsmall"
                    label="This means you can actually use the live platform!"
                  />
                  <Spacer size={10} />
                  <Text
                    size="xsmall"
                    label="We want to make sure that you don't miss a feature, so we'd love to give you a quick demo."
                  />
                  <Spacer size={10} />
                  <Text
                    size="xsmall"
                    label="To book your demo just click 'Book a platform demo' below."
                  />
                  <Spacer size={15} />
                </div>

                <div
                  style={{
                    marginBottom: "-25px",
                    marginTop: "19px",
                    textAlign: "center"
                  }}
                >
                  <Button
                    type="secondary"
                    label="I'll look around myself"
                    onClick={updateTermsAuthorizedPersonId}
                    style={{ marginRight: "14px" }}
                    // loading={isTermsAcceptedLoader}
                  />
                  <Button
                    type="primary"
                    label="Book a platform demo"
                    onClick={bookAMeeting}
                  />
                </div>
              </div>
            ) : (
              <BookMeeting loadBookMeeting />
            )}
          </>
        }
      />
    </>
  );
};
