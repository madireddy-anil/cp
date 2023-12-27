export const getBtnLabel = (isRequired: boolean, isInvited: boolean) => {
  let returnResp;
  if (isRequired) {
    returnResp = isInvited
      ? "Re-send identity verification invite"
      : "Invite to verify identity";
  } else returnResp = "";
  return returnResp;
};

export const calculationOnIdvInvitorsandPercent = (params: any) => {
  const {
    overAllRiskCategory: riskCategory,
    director,
    percentage,
    industries
  } = params;
  const type = director || percentage;

  let returnResp = {
    percentage: "",
    directors: ""
  };
  if (riskCategory === "low" || riskCategory === "high_risk_one") {
    returnResp = {
      percentage: "None",
      directors: "2"
    };
  }
  if (riskCategory === "medium" || riskCategory === "high_risk_two") {
    returnResp = {
      percentage: "25",
      directors: "3"
    };
  }
  if (riskCategory === "high_risk_three") {
    returnResp = {
      percentage: "10",
      directors: "All"
    };
  }
  if (
    riskCategory === "high_risk_one" &&
    industries?.length &&
    industries[0]?.industryType === "other"
  ) {
    returnResp = {
      percentage: "10",
      directors: "All"
    };
  }
  const response =
    type === "percentage" ? returnResp.percentage : returnResp.directors;
  return response;
};

export const calculateRiskOnSharePercentage = (params: any) => {
  const {
    sharePercentage,
    role,
    overAllRiskCategory: riskCategory,
    industries
  } = params;

  let returnResp;
  if (
    (riskCategory === "low" && role?.includes("Director")) ||
    (riskCategory === "medium" && role?.includes("Director")) ||
    (riskCategory === "high_risk_one" && role?.includes("Director")) ||
    (riskCategory === "high_risk_two" && role?.includes("Director")) ||
    (riskCategory === "high_risk_three" && role?.includes("Director"))
  ) {
    returnResp = true;
  }
  if (
    (riskCategory === "medium" || riskCategory === "high_risk_two") &&
    role?.includes("Shareholder") &&
    parseInt(sharePercentage) >= 25
  ) {
    returnResp = true;
  }
  if (
    riskCategory === "high_risk_three" &&
    role?.includes("Shareholder") &&
    parseInt(sharePercentage) >= 10
  ) {
    returnResp = true;
  }
  if (
    riskCategory === "high_risk_one" &&
    role?.includes("Shareholder") &&
    industries?.length &&
    industries[0]?.industryType === "other" &&
    parseInt(sharePercentage) >= 10
  ) {
    returnResp = true;
  }
  const response = typeof returnResp !== "undefined" ? returnResp : false;
  return response;
};

export const getCountOnDirectors = (listOfPeoples: any) => {
  let returnResp;
  const filterDirectors = (listOfPeoples || [])
    .filter((role: any) => role.email && role.email)
    .map((memberRole: any) => {
      return memberRole?.role;
    });
  returnResp = [].concat.apply([], filterDirectors);
  return returnResp;
};
