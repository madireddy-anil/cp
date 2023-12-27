import { Text, Colors } from "@payconstruct/design-system";
import { EFXOrder } from "@payconstruct/pp-types";
import { useGetAccountQuery } from "../../../../services/accountService";
import { useGetBeneficiaryIdQuery } from "../../../../services/beneficiaryService";

interface BeneficiaryDetailsProps {
  trade: EFXOrder;
}
const BeneficiaryDetails: React.FC<BeneficiaryDetailsProps> = ({ trade }) => {
  const { beneficiaryData } = useGetBeneficiaryIdQuery(
    { id: trade?.beneficiaryId ?? "" },
    {
      skip: trade.settlementType === "internal",
      refetchOnMountOrArgChange: true,
      selectFromResult: ({ data, isLoading }) => ({
        beneficiaryData: data?.beneficiary,
        isLoading
      })
    }
  );

  const { data: internalAccountData } = useGetAccountQuery(
    {
      accountId: trade.sellAccountId ?? ""
    },
    {
      refetchOnMountOrArgChange: true,
      skip: trade.sellAccountId ? false : true
    }
  );

  // Get IssuerEntity
  // const companies: any = useAppSelector(selectCompanies);
  // const getIssuer = companies?.find(
  //   (record: any) => record?.id === internalAccountData?.data?.issuerEntityId
  // );
  // const companyName = getIssuer?.genericInformation?.registeredCompanyName;

  //TODO: Refactor this.
  const accountNumber = beneficiaryData
    ? beneficiaryData?.accountDetails?.accountNumber
    : internalAccountData?.data.accountIdentification?.accountNumber;

  const accountName = beneficiaryData
    ? beneficiaryData?.accountDetails?.nameOnAccount
    : internalAccountData?.data?.accountName;

  const accountDetail = `${accountNumber && accountName ? accountNumber : ""}`;

  // const name = beneficiaryData
  //   ? beneficiaryData?.entityName
  //   : internalAccountData?.data?.accountName;

  // const bankName = beneficiaryData
  //   ? beneficiaryData?.accountDetails?.bankName
  //   : companyName;

  // const bankAddress = beneficiaryData
  //   ? beneficiaryData?.beneficiaryDetails?.address
  //   : undefined;

  // const beneficiary = data?.beneficiary?.Item;
  // const bankAddress = beneficiary?.beneficiaryDetails.address;

  return (
    <div>
      <p>
        <Text color={Colors.grey.neutral500}>Beneficiary Details</Text>
      </p>
      <div>
        <Text color={Colors.grey.neutral900} style={{ marginRight: 8 }}>
          {accountName}
        </Text>
        <Text color={Colors.grey.neutral500}>
          {accountDetail.length > 1 ? accountDetail : "N/A"}
        </Text>
      </div>
      {/* <ul className={styles["trade-offer-card__list"]}>
        {bankName && (
          <li className={styles["trade-offer-card__list-item"]}>
            <p className={styles["trade-offer-card__list-item-title"]}>
              Account Provider
            </p>
            <p className={styles["trade-offer-card__list-item-description"]}>
              {bankName}
            </p>
          </li>
        )}

        {beneficiaryData && bankAddress && (
          <li className={styles["trade-offer-card__list-item"]}>
            <p className={styles["trade-offer-card__list-item-title"]}>
              Address
            </p>
            <p className={styles["trade-offer-card__list-item-description"]}>
              {bankAddress?.buildingNumber} {bankAddress?.street}{" "}
              {bankAddress?.stateOrProvince} {bankAddress?.zipOrPostalCode}{" "}
              {bankAddress?.country}
            </p>
          </li>
        )}
      </ul> */}
    </div>
  );
};

export { BeneficiaryDetails };
