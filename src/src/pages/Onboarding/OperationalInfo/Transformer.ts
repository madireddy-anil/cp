export const getCurrencyName = (code: string) => {
  let returnResp;
  switch (code) {
    case "BTC":
      returnResp = "Bitcoin";
      break;
    case "ETB":
      returnResp = "Ethiopia";
      break;
    case "ETH":
      returnResp = "Ethereum";
      break;
    case "BCH":
      returnResp = "Bitcoin Cash";
      break;
    case "USDT":
      returnResp = "Tether";
      break;
    case "LTC":
      returnResp = "Litecoin";
      break;
    case "GBP":
      returnResp = "United Kingdom";
      break;
    case "USD":
      returnResp = "United States Dollar";
      break;
    case "EUR":
      returnResp = "Europe";
      break;
    case "CNY":
      returnResp = "China";
      break;
    case "MYR":
      returnResp = "Malaysia";
      break;
    case "THB":
      returnResp = "Thailand";
      break;
    case "VND":
      returnResp = "Vietnam";
      break;
    case "INR":
      returnResp = "India";
      break;
    case "JPY":
      returnResp = "Japan";
      break;
    case "PHP":
      returnResp = "Philippines";
      break;
    case "TWD":
      returnResp = "Taiwan";
      break;
    case "SGD":
      returnResp = "Singapore";
      break;
    case "AOA":
      returnResp = "Angola";
      break;
    case "SEK":
      returnResp = "Sweden";
      break;
    case "ZAR":
      returnResp = "South Africa";
      break;
    default:
      break;
  }
  return returnResp;
};

export const getSplitCurrencies = (currencies: any) => {
  const splitCurrencies = currencies ? currencies?.split("/") : [];
  return [splitCurrencies[0], splitCurrencies[1]];
};

export const capitalizeString = (string: string) => {
  const sentence = typeof string === "string" ? string : "";
  const words = sentence.split(" ");
  return words
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
};

export const getCountriesList = (currencies: any) => {
  const textEmpty = "";
  return currencies
    .map((country: string) => {
      const returnResp = !country ? textEmpty : country;
      return capitalizeString(returnResp);
    })
    .join("/");
};
