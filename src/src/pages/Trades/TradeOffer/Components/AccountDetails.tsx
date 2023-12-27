import { CurrencyTag, Text, Colors } from "@payconstruct/design-system";
import { EFXOrder } from "@payconstruct/pp-types";
import { Account } from "../../../../services/accountService";
import { isCurrencyPresent } from "../../../Components/Helpers/currencyTag";

interface AccountDetailsProps {
  trade: EFXOrder;
  account?: Account;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ trade, account }) => {
  return (
    <div>
      <p>
        <Text color={Colors.grey.neutral500}>Deposit Currency</Text>
      </p>
      <CurrencyTag
        currency={trade.buyCurrency}
        prefix={isCurrencyPresent(trade.buyCurrency)}
      />
    </div>
  );
};

export { AccountDetails };
