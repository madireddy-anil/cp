const actions = {
  GET_CURRENCIES: "GET_CURRENCIES",
  GET_CURRENCIES_SUCCESS: "GET_CURRENCIES_SUCCESS",
  GET_CURRENCIES_FAILURE: "GET_CURRENCIES_FAILURE",

  GET_COUNTRIES: "GET_COUNTRIES",
  GET_COUNTRIES_SUCCESS: "GET_COUNTRIES_SUCCESS",
  GET_COUNTRIES_FAILURE: "GET_COUNTRIES_FAILURE"
};

export default actions;

export const getAllCurrencies = (token: string) => {
  return {
    type: actions.GET_CURRENCIES,
    token
  };
};

export const getAllCountries = (token: string) => {
  return {
    type: actions.GET_COUNTRIES,
    token
  };
};
