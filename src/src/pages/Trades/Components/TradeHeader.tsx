import { Header, HeaderContent } from "../../../components/PageHeader/Header";
import { Button } from "@payconstruct/design-system";
import { Permissions } from "@payconstruct/fe-utils/dist/Enum/userManagementEnums";
import { useCheckPermissions } from "../../../customHooks/useCheckPermissions";

interface TradeHeaderProps {
  newTrade: () => void;
  downloadXLS: () => void;
}

export const TradeHeader: React.FC<TradeHeaderProps> = ({ newTrade }) => {
  const { hasPermission } = useCheckPermissions();

  return (
    <Header>
      <HeaderContent.LeftSide>
        <HeaderContent.Title>Exotic FX</HeaderContent.Title>
        {hasPermission(Permissions.efxWrite) && (
          <Button
            label="EFX Order"
            onClick={() => {
              newTrade();
            }}
            size="medium"
            type="primary"
            style={{
              marginLeft: "8px"
            }}
          />
        )}
      </HeaderContent.LeftSide>
    </Header>
  );
};
