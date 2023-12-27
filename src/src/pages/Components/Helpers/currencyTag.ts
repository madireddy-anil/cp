export const isCurrencyPresent = (currency: string) => {
  const currencies = [
    "AOA",
    "BTC",
    "BCH",
    "BRL",
    "CNY",
    "EUR",
    "ETB",
    "ETH",
    "GBP",
    "IDR",
    "INR",
    "JPY",
    "LTC",
    "USD",
    "USDT",
    "USDC",
    "VND",
    "MYR",
    "PHP",
    "SGD",
    "THB",
    "TST",
    "ZAR",
    "NGN",
    "PLN",
    "NOK",
    "SEK",
    "DKK",
    "CHF",
    "CZK",
    "HUF",
    "RON",
    "CAD",
    "NGN"
  ];
  if (currencies.includes(currency)) {
    return currency as
      | "AOA"
      | "BTC"
      | "BCH"
      | "BRL"
      | "CNY"
      | "EUR"
      | "ETB"
      | "ETH"
      | "GBP"
      | "IDR"
      | "INR"
      | "JPY"
      | "LTC"
      | "USD"
      | "USDT"
      | "USDC"
      | "VND"
      | "MYR"
      | "PHP"
      | "SGD"
      | "THB"
      | "TST"
      | "ZAR"
      | "NGN"
      | "PLN"
      | "NOK"
      | "SEK"
      | "DKK"
      | "CHF"
      | "CZK"
      | "HUF"
      | "RON"
      | "CAD"
      | "NGN";
  }
  return undefined;
};
