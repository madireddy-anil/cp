import { Text, Colors } from "@payconstruct/design-system";
import { EFXOrder } from "@payconstruct/pp-types";
import { useAppSelector } from "../../../../redux/hooks/store";
import { selectCompanyName } from "../../../../config/auth/authSlice";

interface ClientDetailsProps {
  trade: EFXOrder;
}
const ClientDetails: React.FC<ClientDetailsProps> = ({ trade }) => {
  const companyName = useAppSelector(selectCompanyName);
  // const tradingName = useAppSelector(selectTradingName);

  return (
    <div>
      <p>
        <Text label="Client Details" color={Colors.grey.neutral500} />
      </p>
      <Text label={companyName} color={Colors.grey.neutral900} />
    </div>
  );
};

export { ClientDetails };
