import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "@payconstruct/orbital-auth-provider";
import { approvalUrl } from "../config/variables";
import { Config } from "../pages/Approvals/Approval.Interface";
import axios from "axios";

type Response = {
  data: Config;
};

const useApprovals = () => {
  const { token, userId } = useContext(AuthContext);
  const [approvals, setApprovals] = useState<Config>();
  const [loading, setLoading] = useState(false);
  const [isUserApprover, setUserApprover] = useState<boolean | undefined>();
  const [error, setError] = useState();

  const [URL] = useState(`${approvalUrl}/config`);

  const getApprovals = useCallback(async () => {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`
      }
    };
    return axios.get<any, Response>(URL, config).then((response) => {
      return response;
    });
  }, [URL, token]);

  useEffect(() => {
    if (token && userId) {
      setLoading(true);
      getApprovals()
        .then((response) => {
          const { data } = response;
          const isApprover = data.TransactionApprovalRule.approvers
            .map((approver) => approver.id)
            .includes(userId);

          setUserApprover(isApprover);
          setApprovals(data);
        })
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [token, userId, getApprovals]);

  return { approvals, loading, error, isUserApprover };
};

export { useApprovals };
