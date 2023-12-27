import React, { useEffect } from "react";
import { Header, Tab } from "@payconstruct/design-system";
import PageWrapper from "../../components/Wrapper/PageWrapper";
import { Spacer } from "../../components/Spacer/Spacer";
import ForeignExchange from "./component/ForeignExchange";
import { TableWrapper } from "../../components/Wrapper/TableWrapper";
import "./component/Pricing.css";
import Payments from "./component/Payments";
import StaticFees from "./component/StaticFees";
import { updateMenuShow } from "../../config/general/generalSlice";
import { useDispatch } from "react-redux";

const Pricing: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateMenuShow(true));
  }, [dispatch]);

  const tabs: any[] = [
    {
      key: "1",
      title: "Foreign Exchange",
      content: <ForeignExchange />
    },
    {
      key: "2",
      title: "Payments",
      content: <Payments />
    },
    {
      key: "3",
      title: "Fees",
      content: <StaticFees />
    }
  ];

  return (
    <PageWrapper>
      <Header header="Pricing" subHeader="" />
      <Spacer size={40} />
      <TableWrapper>
        <Tab
          initialpanes={tabs}
          onChange={function noRefCheck() {}}
          size="medium"
          tabposition="top"
          type="line"
        />
      </TableWrapper>
    </PageWrapper>
  );
};

// Export need to be default for code Splitting
// https://reactjs.org/docs/code-splitting.html#route-based-code-splitting
export { Pricing as default };
