import React, { useMemo } from "react";
import { Col, Icon, Spin, Table, Text } from "@payconstruct/design-system";
import { useAppDispatch, useAppSelector } from "../.././redux/hooks/store";
import { selectTimezone } from "../.././config/general/generalSlice";
import style from "./Trades.module.css";
import { useGetTradesQuery } from "../../services/tradesService";
import { TableWrapper } from "../../components/Wrapper/TableWrapper";
import PageWrapper from "../../components/Wrapper/PageWrapper";
import { TradeHeader } from "./Components/TradeHeader";
import { Pagination } from "../../components/Pagination/Pagination";
import { Spacer } from "../../components/Spacer/Spacer";
import { useNavigate } from "react-router-dom";
import {
  changePageAction,
  EFXOrder,
  selectTrades,
  selectIsFiltersApplied
} from "../../config/trades/tradeSlice";
import { selectTradingName } from "../../config/auth/authSlice";
import { resetAction } from "./Deposit/DepositActions";
import {
  camelize,
  formatDate,
  getOrderStatusWithCamelCase,
  getStatusIcons
} from "../../config/transformer";
import { FilterDrawerDom } from "./Components/TradeDrawer/TradesDrawer";
import { Spinner } from "../../components/Spinner/Spinner";
import { useGetIndicativeRateQuery } from "../../services/routesService";
import TradeFilter from "./Components/TradeFilter";
import IndicativeRateComponent from "./Components/IndicativeRate/IndicativeRate";

import { Helpers } from "@payconstruct/fe-utils";
const { formatCurrency } = Helpers;

const Trades: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    tradesHistory: { currentPageList, filteredList, pageNumber }
  } = useAppSelector(selectTrades);

  const companyName = useAppSelector(selectTradingName);
  const timezone = useAppSelector(selectTimezone);
  const isFiltersApplied = useAppSelector(selectIsFiltersApplied);
  const [counter, setCounter]: any = React.useState(0);
  const pageSize = pageNumber ? pageNumber : 25;

  const { indicativeRateList, isLoading: isLoadingIndicativeRate } =
    useGetIndicativeRateQuery(
      {},
      {
        selectFromResult: ({ data, isLoading, isFetching }) => ({
          indicativeRateList: data?.indicativeRate,
          isLoading,
          isFetching
        }),
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true
      }
    );

  //! Fetch from API
  const {
    tradeList = [],
    isLoading: isTradesLoading,
    isFetching
  } = useGetTradesQuery(
    {},
    {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        tradeList: data?.orders,
        isLoading,
        isFetching
      }),
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true
    }
  );

  const sortedTrade = useMemo(() => {
    return filteredList
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(b.executionDate).valueOf() -
          new Date(a.executionDate).valueOf()
      );
  }, [filteredList]);

  const columns = [
    {
      key: "date",
      title: "Execution Date",
      dataIndex: "executionDate",
      defaultSortOrder: "descend",
      sortDirections: ["ascend", "descend"],
      render: (text: string) => {
        return <span key={text}>{formatDate(text, timezone)}</span>;
      },
      sorter: (a: EFXOrder, b: EFXOrder) =>
        new Date(a.executionDate).valueOf() -
        new Date(b.executionDate).valueOf()
    },
    {
      key: "orderReference",
      title: "Trade Reference",
      dataIndex: "orderReference",
      sortDirections: ["ascend", "descend"],
      sorter: (a: EFXOrder, b: EFXOrder) =>
        a.orderReference.length - b.orderReference.length
    },
    {
      key: "settlementType",
      title: "Beneficiary Name",
      dataIndex: "settlementType",
      render: (settlement: "external" | "internal", record: EFXOrder) => {
        if (settlement === "internal") return companyName;
        return record.beneficiaryName;
      }
    },
    {
      key: "depositType",
      title: "Deposit Type",
      dataIndex: "depositType",
      render: (text: string) => {
        return <>{camelize(text)}</>;
      }
    },
    {
      key: "deposit_amount",
      title: "Deposit Amount",
      dataIndex: "buyAmount",
      render: (value: number, record: EFXOrder) => {
        return (
          <span>
            {record.buyCurrency} {formatCurrency(value)}
          </span>
        );
      },
      sortDirections: ["ascend", "descend"],
      sorter: (a: EFXOrder, b: EFXOrder) => a.buyAmount - b.buyAmount
    },
    {
      key: "sellCurrency",
      title: "Settlement Currency",
      dataIndex: "sellCurrency",
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: any) => {
        return (
          <>{`${text} (${
            record.mainSellCurrency ? record.mainSellCurrency : "ETH"
          })`}</>
        );
      },
      sorter: (a: EFXOrder, b: EFXOrder) =>
        a.sellCurrency.length - b.sellCurrency.length
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      render: (text: string) => {
        return (
          <span key={text} style={{ display: "flex", alignItems: "center" }}>
            <Icon
              name={getStatusIcons(text)}
              customStyle={{ marginRight: "0.5rem" }}
            />
            <span>{getOrderStatusWithCamelCase(text)}</span>
          </span>
        );
      }
    }
  ];

  return (
    <PageWrapper>
      <FilterDrawerDom
        tradeList={tradeList}
        setCounter={setCounter}
        key={`drawer_${counter}`}
      />
      <TradeHeader
        newTrade={() => {
          dispatch(resetAction());
          navigate("/order/deposit");
        }}
        downloadXLS={() => {}}
      ></TradeHeader>
      <Col className={style["indicative-rate"]} span={24}>
        {isLoadingIndicativeRate ? (
          <Spinner />
        ) : (
          <>
            <div className={style["indicative-rate-text"]}>
              Indicative rates
            </div>
            <IndicativeRateComponent
              indicativeRates={indicativeRateList || []}
            />
          </>
        )}
      </Col>
      <Spacer size={15} />
      <div className={style["order-history__header"]}>
        <div className={style["order-history__title"]}>Order history</div>
        <Text className={style["text-noue"]}>
          View your EFX order history and the status of your orders below.
        </Text>
      </div>
      <TradeFilter dot={isFiltersApplied} />
      <Spacer size={10} />
      <TableWrapper>
        {(isTradesLoading || isFetching) && !currentPageList ? (
          <p>Loading Please wait...</p>
        ) : (
          <Spin loading={isTradesLoading}>
            <Table
              key={`table_${counter}`}
              rowKey={(record) => record.key}
              scroll={{ x: true }}
              dataSource={currentPageList}
              tableColumns={columns}
              tableSize="medium"
              pagination={false}
              rowClassName={style["trade-row--clickable"]}
              onRow={({ id }) => {
                return {
                  onClick: () => {
                    navigate(`/order/${id}`);
                  }
                };
              }}
            />
          </Spin>
        )}
      </TableWrapper>
      <Spacer size={40} />
      <Pagination
        list={sortedTrade}
        onChange={(list) => {
          dispatch(changePageAction(list));
        }}
        pageSize={pageSize}
        pageOption={["5", "25", "50", "100"]}
      />
    </PageWrapper>
  );
};

export { Trades as default };
