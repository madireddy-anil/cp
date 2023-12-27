import { useAuth0 } from "@auth0/auth0-react";
import {
  Modal as DSModal,
  CheckSvg,
  Text,
  Button,
  Notification
} from "@payconstruct/design-system";
import { Spacer } from "../../../components/Spacer/Spacer";
import { userLogoutAction } from "../../../config/general/actions";
import { logoutUrl } from "../../../config/variables";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/store";
import { useRevokeTokenMutation } from "../../../services/tokenService";

interface ApplicationApprovedProps {
  show: boolean;
  toggleShow: (value: boolean) => void;
}
export const ApplicationApproved: React.FC<ApplicationApprovedProps> = ({
  show,
  toggleShow
}) => {
  const dispatch = useAppDispatch();
  const showNewTermsOfService = useAppSelector(
    (state) => state.termsOfServiceDocument.showNewTermsOfService
  );
  const [revokeToken] = useRevokeTokenMutation();
  const { logout } = useAuth0();

  const logoutHandler = async () => {
    try {
      await revokeToken()
        .unwrap()
        .then()
        .finally(() => {
          dispatch({ type: userLogoutAction });
          logout({ returnTo: logoutUrl });
          Notification({
            type: "warning",
            message: "Your session has expired!"
          });
        });
    } catch (e) {
      console.log("# Revoke Failed!", e);
    }
  };

  return (
    <>
      <DSModal
        modalView={show}
        modalWidth={620}
        description={
          <>
            {!showNewTermsOfService ? (
              <div style={{ textAlign: "center" }}>
                <CheckSvg status="approved" />
                <Spacer size={15} />
                <Spacer size={15} />
                <Text
                  color="#595c97"
                  size="small"
                  weight="bold"
                  label="Your application has been approved!!"
                />
                <br />
                <Spacer size={15} />
                <Text
                  size="small"
                  weight="bold"
                  label="Last step is accepting the terms of service."
                />
                <br />
                <Spacer size={15} />
                <Text
                  size="small"
                  weight="bold"
                  label="All authorised persons have been presented the terms of service to accept."
                />
                <br />
                <Spacer size={15} />
                <Text
                  size="small"
                  weight="bold"
                  label="Once accepted you will be notified on the platform and via email."
                />
                <div style={{ marginBottom: "-25px", marginTop: "19px" }}>
                  <Button type="link" label="Cancel" onClick={logoutHandler} />
                </div>
              </div>
            ) : (
              <>
                <Text size="large" weight="bold" label="Terms of service" />
                <br />
                <Spacer size={15} />
                <Text
                  size="small"
                  weight="regular"
                  label="We’ve updated our terms of service. All people authorised to accept our terms of service have been notified. Once accepted this pop-up will disappear."
                />
              </>
            )}
          </>
        }
      />
    </>
  );
};
