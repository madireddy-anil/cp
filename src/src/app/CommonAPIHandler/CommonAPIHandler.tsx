import React, { useContext, useEffect } from "react";
import { useGetCountriesQuery } from "../../services/countriesService";
import { useGetCurrenciesQuery } from "../../services/currencies";
import { getApprovalQueue } from "../../services/approvalService/actions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/store";
import { selectOrgId } from "../../config/auth/authSlice";
import { AuthContext } from "@payconstruct/orbital-auth-provider";
import { UserRoles } from "@payconstruct/fe-utils/dist/Enum/userManagementEnums";
import { Hooks } from "@payconstruct/fe-utils";

const { useCheckPermissions } = Hooks;

const CommonAPIHandler: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const { token } = useContext(AuthContext);
  const orgId = useAppSelector(selectOrgId);

  const { userRole } = useCheckPermissions();

  //call general APIs
  useGetCountriesQuery({}, { skip: !token });
  useGetCurrenciesQuery({}, { skip: !token });
  // useGetListOfPeopleQuery({}, { skip: !token });

  useEffect(() => {
    if (orgId && token && UserRoles.ECommerceViewer !== userRole) {
      dispatch(getApprovalQueue({ token }));
    }
  }, [userRole, orgId, token, dispatch]);

  return <>{children}</>;
};

export { CommonAPIHandler as default };
