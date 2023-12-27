import { Badge, Button } from "@payconstruct/design-system";
import { showFilterAction } from "../../../config/trades/tradeSlice";
import { useAppDispatch } from "../../../redux/hooks/store";

interface TradeFilterProps {
  dot?: boolean;
}

const TradeFilter: React.FC<TradeFilterProps> = ({ dot }) => {
  const dispatch = useAppDispatch();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end"
      }}
    >
      <Badge dot={dot}>
        <Button
          label="Filters"
          onClick={() => {
            dispatch(showFilterAction(true));
          }}
          size="medium"
          type="tertiary"
          icon={{
            name: "filter",
            position: "left"
          }}
        />
      </Badge>
    </div>
  );
};

export { TradeFilter as default };
