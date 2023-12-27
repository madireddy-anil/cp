import React, { lazy } from "react";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks/store";
import { updateSelectedCompanyStep } from "../../../config/company/companySlice";
import { Steps } from "../../../components/Steps/Steps";

const CompanyDetails: React.FC = () => {
  const dispatch = useAppDispatch();

  const step = useAppSelector((state) => state.company.step);
  const isCompanyInformationDone = useAppSelector(
    (state) => state.company.progressLogs.isCompanyInformationDone
  );
  const isCompanyRequirementsDone = useAppSelector(
    (state) => state.company.progressLogs.isCompanyRequirementsDone
  );
  const isOperationInformationDone = useAppSelector(
    (state) => state.company.progressLogs.isOperationInformationDone
  );
  const isRegulatoryInformationDone = useAppSelector(
    (state) => state.company.progressLogs.isRegulatoryInformationDone
  );

  // This function will be enabled only once user complete all the company modules
  const handleComponentsShow = (selectedStep: number) => {
    dispatch(updateSelectedCompanyStep(selectedStep));
  };

  const CompanyInformation = lazy(
    () => import("../CompanyInformation/CompanyInformation")
  );
  const CompanyRequirements = lazy(
    () => import("../CompanyRequirements/CompanyRequirements")
  );
  const RegulatoryInformation = lazy(
    () => import("../RegulatoryInformation/RegulatoryInformation")
  );
  const OperationalInformation = lazy(
    () => import("../OperationalInfo/OperationalInfo")
  );

  const steps = [
    {
      key: 0,
      title: "Company Information",
      content: <CompanyInformation />
    },
    {
      key: 1,
      title: "Company requirements",
      content: <CompanyRequirements />
    },
    {
      key: 2,
      title: "Operational Information",
      content: <OperationalInformation />
    },
    {
      key: 3,
      title: "Regulatory Information",
      content: <RegulatoryInformation />
    }
  ];

  const overAllCompanyStatus: any =
    isCompanyInformationDone &&
    isCompanyRequirementsDone &&
    isOperationInformationDone &&
    isRegulatoryInformationDone;
  return (
    <main>
      <div style={{ padding: "40px" }}>
        <Steps
          steps={steps}
          currentStep={step}
          onChange={overAllCompanyStatus && handleComponentsShow}
        />
      </div>
    </main>
  );
};

// Export need to be default for code Splitting
// https://reactjs.org/docs/code-splitting.html#route-based-code-splitting
export default CompanyDetails;
