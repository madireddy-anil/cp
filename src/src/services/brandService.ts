import { api as apiUrl } from "./authService";

interface Brand {
  _id: string;
  products: Product[];
  clientBrands: {
    _id: string;
    id: string;
    type: string;
    brand: string;
    brandCode: string;
    isActive: true;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  id: string;
  type: string;
  brand: string;
  brandCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface Product {
  _id: string;
  id: string;
  product: string;
  productCode: string;
  label: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
interface BrandResponse {
  data: Brand;
}

interface BrandsResponse {
  data: {
    brands: Brand[];
  };
}

export const brandsApi = apiUrl.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<BrandsResponse, any>({
      query: () => {
        return {
          url: `brands`,
          method: "GET"
        };
      }
    }),
    getBrand: builder.query<BrandResponse, { id: string }>({
      query: ({ id }) => {
        return {
          url: `brands/${id}`,
          method: "GET"
        };
      }
    })
  })
});

export const { useGetBrandsQuery, useGetBrandQuery } = brandsApi;
