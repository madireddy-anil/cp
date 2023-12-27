import { useContext, useEffect } from "react";
import { updateToken, updateUserId } from "../config/auth/authSlice";
import { useAppDispatch } from "../redux/hooks/store";
import { AuthContext } from "@payconstruct/orbital-auth-provider";
import { KYCHandler } from "./KycHandler";
import { PusherHandler } from "./PusherHandler";

//! TEMPORARY SOLUTION TO USE REDUX TOKEN AND AUTH0
//! BEFORE USING THE NEW MFE SYSTEM
//! WE WILL REMOVE THIS LATER AFTER ALL CHANGES ARE WORKING

const TokenHandler: React.FC = ({ children }) => {
  const { token, userId } = useContext(AuthContext);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateToken(token));
    dispatch(updateUserId(userId));
  }, [token, userId, dispatch]);

  if (!token) return <div>Loading...</div>;

  return (
    <KYCHandler>
      <PusherHandler>{children}</PusherHandler>
    </KYCHandler>
  );
};

export { TokenHandler };
