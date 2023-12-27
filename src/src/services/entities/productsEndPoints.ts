import { ProductCode } from "../../enums/products/Products";
import { api as apiUrl } from "../authService";

export interface Product {
  id: string;
  product: string;
  productCode: ProductCode;
  label: string;
}
interface Products {
  data: { products: Product[] };
}

export const productsApi = apiUrl.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<Products, any>({
      query: () => "products?limit=0"
    })
  })
});

export const { useGetAllProductsQuery } = productsApi;
