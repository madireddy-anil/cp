//* All Products that we are using
export enum ProductCode {
  CorporateAccount = "corporate",
  DigitalAssetVault = "da_vault",
  CryptoCommerce = "crypto_commerce",
  ExoticReceivables = "efx"
}

//* Current groups of products
export enum ProductGroup {
  GlobalPayments = "GlobalPayments",
  EFX = "ExoticReceivables"
}

//* Mapping the product code to the product group
export const ProductGroupMap = {
  [ProductGroup.GlobalPayments]: [
    ProductCode.CorporateAccount,
    ProductCode.DigitalAssetVault,
    ProductCode.CryptoCommerce
  ],
  [ProductGroup.EFX]: [ProductCode.ExoticReceivables]
};

//* Verify if the product code belongs to Global Payments
export const isGlobalPayments = (productCode: ProductCode) => {
  if (ProductGroupMap[ProductGroup.GlobalPayments].includes(productCode))
    return true;
  return false;
};

//* Verify if the product code belongs to EFX
export const isEFX = (productCode: ProductCode) => {
  if (ProductGroupMap[ProductGroup.EFX].includes(productCode)) return true;
  return false;
};

//* Get the product group from the product code
export const getProductGroup = (productCode: ProductCode) => {
  if (isGlobalPayments(productCode)) return ProductGroup.GlobalPayments;
  if (isEFX(productCode)) return ProductGroup.EFX;
  return null;
};

//* ProductIDs of our Products
export enum ProductId {
  CorporateAccount = "fee1b2fb-4f1d-46e2-9ca3-7ec67f4727c9",
  DigitalAssetTrading = "682903be-cee9-4794-b28a-f8b8f154cb55",
  PooledAccount = "29c0e2fc-e7dc-4c13-bae2-3ca9809e1cf0",
  CryptoCommerce = "704fb8be-dcef-4c14-b715-e2df6e8b49e2",
  GlobalPayments = "8b9cc5f6-ac88-4876-a258-460c0892ccec",
  ExoticReceivables = "4a6933e6-ee05-4a37-9bb5-776f72d681e8",
  DigitalAssetVault = "767627f3-b72f-4e6e-a28b-192c1d1014fa",
  Yield = "38390091-55c2-42c8-a5c6-8a9db066aab0"
}

//* Product IDs [Corporate Account, Digital Asset Vault, Digital Asset Trading, Crypto Commerce, Global Payments, Yield] as an Array
//* except [Pooled Account, Exotic Receivables]
export const productIds = [
  "fee1b2fb-4f1d-46e2-9ca3-7ec67f4727c9",
  "767627f3-b72f-4e6e-a28b-192c1d1014fa",
  "682903be-cee9-4794-b28a-f8b8f154cb55",
  "704fb8be-dcef-4c14-b715-e2df6e8b49e2",
  "8b9cc5f6-ac88-4876-a258-460c0892ccec",
  "38390091-55c2-42c8-a5c6-8a9db066aab0"
];
