import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/store";
import PageWrapper from "../../components/Wrapper/PageWrapper";
import { Header, HeaderContent } from "../../components/PageHeader/Header";

const TermAndServices: React.FC = () => {
  let navigate = useNavigate();

  const showNewTermsOfService = useAppSelector(
    (state) => state.termsOfServiceDocument.showNewTermsOfService
  );
  !showNewTermsOfService && navigate(-1);

  return (
    <PageWrapper>
      <Header>
        <HeaderContent.LeftSide>
          <HeaderContent.Title subtitle="We've updated our terms of service. All people authorised to accept our terms of service have been notified. Once accepted you will be able to access our features.">
            New Terms of Service
          </HeaderContent.Title>
        </HeaderContent.LeftSide>
        <HeaderContent.RightSide></HeaderContent.RightSide>
      </Header>
    </PageWrapper>
  );
};

export { TermAndServices as default };
