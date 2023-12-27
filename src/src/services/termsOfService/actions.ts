const actions = {
  GET_CLIENT_BY_ID: "GET_CLIENT_BY_ID",
  GET_CLIENT_BY_ID_SUCCESS: "GET_CLIENT_BY_ID_SUCCESS",
  GET_CLIENT_BY_ID_FAILURE: "GET_CLIENT_BY_ID_FAILURE",

  GET_ALL_TERMS_OF_SERVICE: "GET_ALL_TERMS_OF_SERVICE",
  GET_ALL_TERMS_OF_SERVICE_SUCCESS: "GET_ALL_TERMS_OF_SERVICE_SUCCESS",
  GET_ALL_TERMS_OF_SERVICE_FAILURE: "GET_ALL_TERMS_OF_SERVICE_FAILURE",

  GET_PEOPLE: "GET_PEOPLE",
  GET_PEOPLE_SUCCESS: "GET_PEOPLE_SUCCESS",
  GET_PEOPLE_SUCCESS_FAILURE: "GET_PEOPLE_SUCCESS_FAILURE"
};

export default actions;

export const getClient = (values: any, location?: string) => {
  return {
    type: actions.GET_CLIENT_BY_ID,
    values,
    location
  };
};

export const getTermsOfService = (values: any) => {
  return {
    type: actions.GET_ALL_TERMS_OF_SERVICE,
    values
  };
};

export const getPeople = (values: any) => {
  return {
    type: actions.GET_PEOPLE,
    values
  };
};
