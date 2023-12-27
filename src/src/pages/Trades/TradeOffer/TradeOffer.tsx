import React from "react";
import { Row } from "@payconstruct/design-system";
import { NotAcceptedOffer } from "./NotAcceptedOffer/NotAcceptedOffer";
import { AcceptedOffer } from "./AcceptedOffer/AcceptedOffer";
import { useParams } from "react-router-dom";
import { Account, useGetAccountsQuery } from "../../../services/accountService";
import { useGetTradeByIDQuery } from "../../../services/tradesService";
import { Spinner } from "../../../components/Spinner/Spinner";

const TradeOffer: React.FC = () => {
  let { id = "" } = useParams<{ id: string }>();

  const { selectedTrade, isLoadingTrade } = useGetTradeByIDQuery(
    { id },
    {
      refetchOnMountOrArgChange: true,
      selectFromResult: ({ data, isLoading, isFetching }) => {
        return {
          selectedTrade: data?.order,
          isLoadingTrade: isLoading,
          isFetchingTrade: isFetching
        };
      }
    }
  );

  const { accountsData = [] } = useGetAccountsQuery("Accounts", {
    refetchOnMountOrArgChange: 10,
    selectFromResult: ({ data, isLoading, isFetching, isError, isSuccess }) => {
      return {
        accountsData: data?.data?.accounts as Account[],
        isLoading,
        isFetching,
        isError,
        isSuccess
      };
    }
  });

  const selectedAccount = accountsData?.find(
    (account) => account.id === selectedTrade?.buyAccountId
  );

  if (isLoadingTrade) return <Spinner />;

  //* deposit_accepted_by_client is not mapped in the PPTypes for Day0
  return (
    <Row gutter={0}>
      {selectedTrade?.status === "accepted_by_client" ||
      selectedTrade?.status === "deposit_accepted_by_client" ||
      //@ts-ignore
      selectedTrade?.status === "await_final_settlement" ? (
        <AcceptedOffer
          trade={selectedTrade}
          account={selectedAccount}
          style={{ marginLeft: "0px" }}
        />
      ) : (
        <NotAcceptedOffer
          trade={selectedTrade}
          account={selectedAccount}
          style={{ marginLeft: "0px" }}
        />
      )}
    </Row>
  );
};

export { TradeOffer as default };
