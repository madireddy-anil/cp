import React from "react";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { AsyncIntlProvider } from "./IntlProvider";
import { toggleModalAction } from "../pages/Components/Beneficiary/BeneficiarySlice";
import { useAppDispatch } from "../redux/hooks/store";
import { updateMenuShow } from "../config/general/generalSlice";
import { updateSelectedAccount } from "../config/account/accountSlice";
import ApprovalProvider from "../pages/Approvals/ApprovalsContext/ApprovalsProvider";

let persistor = persistStore(store);

const useHostStore = () => {
  const beneStore = useSelector((state: RootState) => state.beneficiary);
  const selectedAccount = useSelector(
    (state: RootState) => state.account.selectedAccount
  );
  const dispatch = useAppDispatch();
  return {
    hasNewBeneCreated: beneStore.hasNewBeneCreated,
    selectedAccount: selectedAccount,
    showAddNewBeneModal: () => dispatch(toggleModalAction()),
    updateMenuShow: (v: boolean) => dispatch(updateMenuShow(v)),
    updateSelectedAccount: (account: any) => {
      return dispatch(updateSelectedAccount(account));
    }
  };
};

const ReduxProvider: React.FC = ({ children }) => {
  return (
    <Provider store={store}>
      <ApprovalProvider>
        <PersistGate loading={null} persistor={persistor}>
          <AsyncIntlProvider>{children}</AsyncIntlProvider>
        </PersistGate>
      </ApprovalProvider>
    </Provider>
  );
};

export { useHostStore, ReduxProvider };
export default ReduxProvider;
