import React from "react";
import { Table } from "@payconstruct/design-system";
import StatusIcon from "./StatusIcon";
import { useGetPricingStaticFeesQuery } from "../../../services/pricingService";
import StaticFeesItem from "../types/staticFees";
import { Spinner } from "../../../components/Spinner/Spinner";
import { fractionFormat } from "../../../utilities/transformers";

const StaticFees: React.FC = () => {
  const staticFeesDataRemap = (pricingStaticFees: any) => {
    const staticFeesData = pricingStaticFees?.map(
      (item: StaticFeesItem, idx: number) => {
        const {
          staticFeesActive,
          description,
          feeFrequency,
          amount,
          currency
        } = item.staticFees;

        const rows = {
          key: `staticFees_${idx}`,
          amount,
          currency,
          description,
          feeFrequency,
          status: staticFeesActive ? "active" : "inactive"
        };
        return rows;
      }
    );
    return staticFeesData;
  };

  const { staticFees, isLoading } = useGetPricingStaticFeesQuery("StaticFees", {
    refetchOnMountOrArgChange: 10,
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      staticFees: staticFeesDataRemap(data?.data),
      isLoading,
      isFetching
    })
  });

  const columns = [
    { title: "Currency", dataIndex: "currency" },
    { title: "Description", dataIndex: "description" },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (data: number | string) => fractionFormat(data)
    },
    { title: "Fee Frequency", dataIndex: "feeFrequency" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => <StatusIcon level={status} />
    }
  ];

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Table
            dataSource={staticFees}
            tableColumns={columns}
            tableSize="small"
            pagination={false}
          />
        </>
      )}
    </div>
  );
};

export { StaticFees as default };
