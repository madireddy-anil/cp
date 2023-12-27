export const formatCountryDocuments = (filterCountryDocument: any) => {
  return (filterCountryDocument || []).map((item: any) => {
    return [item.code, item.type];
  });
};

export const formatCountryStates = (filterCountryStates: any) => {
  return (filterCountryStates || []).map((item: any) => {
    return [item.state, item.state];
  });
};

export const getRoles = (role: any[]) => {
  return (role || [])
    .map((memberRole) => {
      const returnResp = memberRole;
      return returnResp;
    })
    .join(",");
};

export const getFormattedDocType = (type: any) => {
  let returnResp;
  switch (type) {
    case "ID Card":
      returnResp = "id";
      break;
    case "Driving License":
      returnResp = "drivingLicense";
      break;
    case "Passport":
      returnResp = "passport";
      break;
    default:
      break;
  }
  return returnResp;
};
