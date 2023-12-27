import {
  Col,
  Colors,
  Row,
  Accordions,
  Table,
  Status,
  Button,
  Modal,
  Spin,
  Icon,
  Text
} from "@payconstruct/design-system";
import { CSSProperties, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { Spacer } from "../../../../components/Spacer/Spacer";
import { AccountDetails } from "../Components/AccountDetails";
import { BeneficiaryDetails } from "../Components/BeneficiaryDetails";
import { PaymentDetails } from "../Components/PaymentDetails";
import { ClientDetails } from "../Components/ClientDetails";
import { EFXOrder } from "@payconstruct/pp-types";
import useElementSize from "../../../../customHooks/useElementSize";
import { Empty, PageHeader } from "antd";
import { useParams } from "react-router";
import {
  OrderDepositDetails,
  useConfirmDepositMutation,
  useGetDepositsQuery
} from "../../../../services/depositService";
import { useGetBeneficiaryIdQuery } from "../../../../services/beneficiaryService";
import { Account } from "../../../../services/accountService";
import { useAppSelector } from "../../../../redux/hooks/store";
import moment from "moment-timezone";
import { selectTimezone } from "../../../../config/general/generalSlice";
import {
  DepositDetailsForm,
  NewVendorAccount
} from "../../Components/Modal/NewVendorAccount/NewVendorAccount";

import { Spinner } from "../../../../components/Spinner/Spinner";
import { ReceiptModal } from "../../Components/Modal/Receipt/ReceiptModal";
import { generatePresignedDownload } from "../../Helpers/imageUploader";
import { useAuth } from "../../../../redux/hooks/useAuth";
import { setNotification } from "../../Helpers/currencyTag";
import {
  formatDate,
  getOrderStatusWithCamelCase
} from "../../../../config/transformer";
import Wrapper from "../../Components/Wrapper";
import { Card } from "../../Components/Card/Card";
import css from "../tradeOffer.module.css";

interface AcceptOfferProps {
  trade: EFXOrder;
  account?: Account;
  style?: CSSProperties;
}
const AcceptedOffer: React.FC<AcceptOfferProps> = ({
  trade,
  account,
  style
}) => {
  let { id } = useParams<{ id: string }>();

  const { data: depositList, isLoading: isLoadingDeposits } =
    useGetDepositsQuery({ id }, { refetchOnMountOrArgChange: 10 });

  const timezone = useAppSelector(selectTimezone);

  const { auth } = useAuth();
  const intl = useIntl();

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<OrderDepositDetails>();
  const [imageModal, setImageModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [image, setImage] = useState("");
  const [imageParams, setImageParams] = useState({
    orderId: "",
    vendorId: "",
    accountId: "",
    fileName: "",
    type: ""
  });

  const [confirmDeposit] = useConfirmDepositMutation();

  const queueRef = useRef(null);
  const { width } = useElementSize(queueRef);

  let { data: beneficiaryData } = useGetBeneficiaryIdQuery(
    {
      id: trade.beneficiaryId ?? ""
    },
    {
      skip: trade.settlementType === "internal"
    }
  );

  if (Array.isArray(beneficiaryData)) {
    beneficiaryData = undefined;
  }

  const handleImagePreview = async (
    record: any,
    text: string,
    type: string
  ) => {
    setImageModal(true);
    setLoading(true);
    const res = await generatePresignedDownload(
      `orderId=${record.orderId}&vendorId=${record.vendorId}&accountId=${record.accountId}&fileName=${text}&type=${type}`,
      auth.token
    );
    console.log("Text res:", res);
    setImageParams({
      orderId: record.orderId,
      vendorId: record.vendorId,
      accountId: record.accountId,
      fileName: text,
      type
    });

    setImage(res);
    setLoading(false);
  };

  const handleClickConfirmReceipt = async (data: any) => {
    setLoading(true);
    const currentImageList = selectedDeposit?.depositDocument ?? [];

    try {
      await confirmDeposit({
        orderId: trade?.id,
        key: selectedDeposit?.SK,
        document: [...documents, ...currentImageList]
      }).unwrap();

      setNotification(
        intl.formatMessage({ id: "Receipt Confirmed" }),
        intl.formatMessage({ id: "Receipt confirmed successfully" }),
        "success"
      );

      setIsReceiptModalOpen(false);
    } catch (err: any) {
      console.log(err);
      setNotification(
        intl.formatMessage({ id: "Confirm Receipt Failed" }),
        "",
        "error"
      );
    }
    setDocuments([]);
    setLoading(false);
  };

  const handleCancelModal = () => {
    setIsReceiptModalOpen(false);
    setDocuments([]);
  };

  const download = async () => {
    var element = document.createElement("a");
    const res = await generatePresignedDownload(
      `orderId=${imageParams.orderId}&vendorId=${imageParams.vendorId}&accountId=${imageParams.accountId}&fileName=${imageParams.fileName}&type=${imageParams.type}`,
      auth.token
    );
    element.href = res;
    element.download = imageParams.fileName;
    element.click();
  };

  const columns = [
    { key: "currency", title: "Currency", dataIndex: "currency" },
    { key: "expected", title: "Amount", dataIndex: "expected" },
    { key: "minAmount", title: "Min Transaction Size", dataIndex: "minAmount" },
    { key: "maxAmount", title: "Max Transaction Size", dataIndex: "maxAmount" },
    {
      key: "accountNumber",
      title: "Account  Number",
      dataIndex: "accountNumber"
    },
    {
      key: "country",
      title: "Bank Country",
      dataIndex: "country",
      render: (text: string) => {
        if (!text) return "N/A";
        return text;
      }
    },
    {
      key: "depositDocument",
      title: "Receipt",
      width: 170,
      textWrap: "word-break",
      ellipsis: true,
      dataIndex: "depositDocument",
      render: (listOfImages: string[], record: OrderDepositDetails) => {
        if (typeof listOfImages === "string") listOfImages = [listOfImages];
        const list = listOfImages?.map((img) => {
          return (
            <div
              style={{
                display: "flex",
                color: Colors.blue.blue900,
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              <Icon name="eyeOpened" color={Colors.blue.blue900} />
              <p onClick={() => handleImagePreview(record, img, "deposit")}>
                {img}
              </p>
            </div>
          );
        });

        return (
          <>
            {record.status === "pending_deposit" &&
              listOfImages?.length < 10 && (
                <Button
                  label="Upload Receipts"
                  onClick={() => {
                    setIsReceiptModalOpen(true);
                    setSelectedDeposit(record);
                  }}
                  size="small"
                  type="primary"
                  style={{ marginBottom: "10px" }}
                />
              )}
            {list}
          </>
        );
      }
    },
    {
      key: "notes",
      title: "Deposit Information",
      textWrap: "word-break",
      width: 170,
      dataIndex: "notes",
      render: (text: string, record: OrderDepositDetails) => {
        const vendorName =
          depositList?.deposits.filter(
            (vendor) => vendor.vendorId === record.vendorId
          )[0].name || "";

        return (
          <Button
            type="link"
            label={"See more"}
            onClick={() => {
              setShowDepositModal(true);
              setDepositDetail({
                accountNumber: record.accountNumber,
                instructions: record.instructions,
                notes: record.notes,
                remitted: record.remitted,
                expected: record.expected,
                deposited: record.deposited,
                maxAmount: record.maxAmount,
                minAmount: record.minAmount,
                leg: "exchange",
                vendorName,
                vendorId: record.vendorId,
                currency: record.currency,
                orderId: record.orderId
              });
            }}
          />
        );
      }
    },
    {
      key: "transferDeadline",
      title: "Transfer Deadline",
      dataIndex: "transferDeadline",
      textWrap: "word-break",
      width: 170,
      render: (text: string, record: OrderDepositDetails) => {
        if (!record?.timeZone?.abbrev) return "N/A";

        const orderTime = moment.tz(
          `${record.valueDate} ${record.time}`,
          record.timeZone.abbrev
        );
        const local = orderTime.clone().tz(timezone);

        return local.format("DD-MM-YYYY HH:MM");
      }
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      fixed: "right",
      render: (text: string) => {
        if (text === "complete")
          return <Status type="approved" tooltipText={text} />;
        return <Status type="pending" tooltipText={text} />;
      }
    }
  ];

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositDetail, setDepositDetail] = useState<DepositDetailsForm>();

  const isLegStatusComplete = useMemo(() => {
    if (depositList?.deposits.length === 0) {
      return false;
    }

    return (
      depositList?.deposits
        .filter((deposit) => {
          //@ts-ignore
          return deposit?.status !== "complete";
        })
        .flat().length === 0
    );
  }, [depositList]);

  const customStyles = {
    padding: `20px 40px 30px ${width + 40}px`,
    background: Colors.grey.neutral50
  };
  // const pageHeaderDesign = {
  //   topPadding: { paddingTop: `20px` },
  //   title: { paddingBottom: `12px` },
  //   titleLast: { paddingBottom: `25px` }
  // };

  const company =
    trade.createdBy.portal === "bms" ? "Orbital" : `${trade.clientName}`;

  const createdBy = `${trade.createdBy.firstName} - ${company}`;

  return (
    <Col xs={24} sm={24} md={24} lg={24} xl={24} style={style}>
      {/* <TradeQueue style={{ position: "fixed" }} ref={queueRef} /> */}
      {!trade && (
        <main style={customStyles}>
          <Empty
            description={
              <span>
                Trade Reference was not found: <b>{id}</b>
              </span>
            }
          />
        </main>
      )}
      {trade && (
        <main style={customStyles}>
          {/* <Header>
            <LeftSide>
              <Title subtitle={`Execution Date - ${day} ${month}, ${year}`}>
                Order Id - {trade?.orderReference}
              </Title>
            </LeftSide>
          </Header> */}
          <PageHeader
            title={`Order Id - ${trade?.orderReference}`}
            className="site-page-header"
            style={{ padding: "0px 0px 0px 0px" }}
          />
          <Spacer size={15} />
          <Wrapper>
            <div className={css["summary-content"]}>
              <div className={css["summary-element"]}>
                <p>
                  <Text
                    label="Execution Date"
                    size="small"
                    color={Colors.grey.neutral500}
                  />
                </p>
                <Text
                  label={formatDate(trade?.executionDate, timezone)}
                  color={Colors.grey.neutral700}
                  weight="bold"
                />
              </div>
              <div className={css["summary-element"]}>
                <p>
                  <Text
                    label="Status"
                    size="small"
                    color={Colors.grey.neutral500}
                  />
                </p>
                <Text
                  label={getOrderStatusWithCamelCase(trade?.status)}
                  color={Colors.grey.neutral700}
                  weight="bold"
                />
              </div>
              <div className={css["summary-element"]}>
                <p>
                  <Text
                    label="Currency Pair"
                    size="small"
                    color={Colors.grey.neutral500}
                  />
                </p>
                <Text
                  label={`${trade.buyCurrency}.${trade.sellCurrency} (${
                    trade.mainSellCurrency ? trade.mainSellCurrency : "ETH"
                  })`}
                  color={Colors.grey.neutral700}
                  weight="bold"
                />
              </div>
            </div>
          </Wrapper>
          <Spacer size={15} />
          <Accordions
            accordionType="simple"
            header="Order Information"
            headerRight={<Status type="approved" />}
            text={
              <>
                {isLoadingDeposits ? (
                  <Spinner />
                ) : (
                  <div>
                    {/* <OrderInformation trade={trade} /> */}
                    <Row
                      gutter={[15, 15]}
                      style={{
                        marginBottom: 15,
                        marginLeft: 50,
                        marginTop: -30
                      }}
                    >
                      <Col span={24}>
                        <Text
                          label={`Created by: ${createdBy}`}
                          color={Colors.grey.neutral500}
                        />
                      </Col>
                    </Row>
                    <Row gutter={[15, 15]} style={{ marginBottom: "15px" }}>
                      <Col span={24}>
                        <Card>
                          <div className={css["order-wrapper"]}>
                            <AccountDetails trade={trade} account={account} />
                            <ClientDetails trade={trade} />
                            <BeneficiaryDetails trade={trade} />
                          </div>
                        </Card>
                      </Col>
                    </Row>
                    <Row gutter={[15, 15]}>
                      <Col span={24}>
                        <PaymentDetails trade={trade} />
                      </Col>
                    </Row>
                  </div>
                )}
              </>
            }
          />
          <Spacer size={15} />
          <Row gutter={15}>
            <Col span={24}>
              <Accordions
                accordionType="simple"
                header="Deposit Information"
                headerRight={
                  isLegStatusComplete ? (
                    <Status type="approved" tooltipText="Approved" />
                  ) : (
                    <Status type="pending" tooltipText="Pending" />
                  )
                }
                text={
                  <Table
                    rowKey={(record) => record.uuid}
                    dataSource={depositList?.deposits ?? []}
                    tableColumns={columns}
                    tableSize="medium"
                    pagination={false}
                    scroll={{ x: true }}
                  />
                }
              />
            </Col>
          </Row>
          {depositDetail && (
            <NewVendorAccount
              viewOnly={true}
              vendor={depositDetail}
              show={showDepositModal}
              onClickOk={() => {
                setShowDepositModal(false);
              }}
              onClickCancel={() => {
                setShowDepositModal(false);
              }}
            />
          )}
          {isReceiptModalOpen && (
            <ReceiptModal
              documents={documents}
              loading={loading}
              setLoading={setLoading}
              onClickOk={handleClickConfirmReceipt}
              onClickCancel={handleCancelModal}
              setDocuments={setDocuments}
              deposit={selectedDeposit}
            />
          )}
          <Modal
            modalView={imageModal}
            title={"Image Preview"}
            onCancelText={"Cancel"}
            onOkText={"Download"}
            buttonOkDisabled={loading}
            onClickCancel={() => {
              setImageModal(false);
              setImage("");
              setImageParams({
                orderId: "",
                vendorId: "",
                accountId: "",
                fileName: "",
                type: ""
              });
            }}
            onClickOk={download}
            description={
              <div
                style={{
                  textAlign: "center"
                }}
              >
                {loading ? (
                  <Spin />
                ) : (
                  <img
                    alt="preview"
                    src={image}
                    style={{
                      maxWidth: "90%",
                      maxHeight: "300px"
                    }}
                  />
                )}
              </div>
            }
          />
        </main>
      )}
    </Col>
  );
};

export { AcceptedOffer };
