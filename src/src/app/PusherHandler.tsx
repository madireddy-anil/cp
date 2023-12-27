import Pusher from "pusher-js";
import { useContext, useEffect, useMemo } from "react";
import { useAppDispatch } from "../redux/hooks/store";
import { AuthContext } from "@payconstruct/orbital-auth-provider";
import { logoutUrl, pusherAppId, pusherCluster } from "../config/variables";
import { PusherEvents } from "@payconstruct/fe-utils/dist/Enum/userManagementEnums";
import { getApprovalQueue } from "../services/approvalService/actions";
import { ApprovalsContext } from "../pages/Approvals/ApprovalsContext/ApprovalsProvider";

const PusherHandler: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const { userId, logout, token } = useContext(AuthContext);
  const { refetchApprovalConfig } = useContext(ApprovalsContext);

  const PUSHER = useMemo(() => {
    return new Pusher(pusherAppId, {
      cluster: pusherCluster
    });
  }, []);

  /* Listen the Pusher notification whenever the change 
  happens on ResetMFA, UserRemoved and RefreshPaymentQueue */
  useEffect(() => {
    if (userId) {
      const PusherChannel = PUSHER.subscribe(userId);
      console.log(
        "%c # SUBSCRIBE to EVENT_PUSHER",
        "background: #222; color: #bada55"
      );
      PusherChannel.bind(userId, (data: { code: string; action: string }) => {
        const { code } = data;
        console.log("PUSHER_NOTIFICATION:", code);
        if (
          code === PusherEvents.ResetMFA ||
          code === PusherEvents.UserRemoved
        ) {
          logout({ returnTo: logoutUrl });
        }
        if (code === PusherEvents.RefreshPaymentQueue) {
          refetchApprovalConfig();
          console.log("PUSHER_NOTIFICATION RefreshPaymentQueue:", code);
          if (token) dispatch(getApprovalQueue({ token }));
        }
      });
    }
    return () => {
      console.log(
        "%c # UNSUBSCRIBE to EVENT_PUSHER",
        "background: #222; color: #bada55"
      );
      PUSHER.unsubscribe(userId ?? "");
    };
  }, [userId, PUSHER, dispatch]);

  return <>{children}</>;
};

export { PusherHandler };
