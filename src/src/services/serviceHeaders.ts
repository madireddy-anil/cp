import { BaseQueryApi } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { MaybePromise } from "@reduxjs/toolkit/dist/query/tsHelpers";
import { RootState } from "../redux/store";

export interface prepareHeadersProps {
  prepareHeaders?:
    | ((
        headers: Headers,
        api: Pick<
          BaseQueryApi,
          "getState" | "extra" | "endpoint" | "type" | "forced"
        >
      ) => MaybePromise<Headers>)
    | undefined;
}

/**
 * Global Headers for API's, if you need to add more headers, you can override this function
 * @param headers
 * @param BaseQueryApi - object with the following props:
 *  - "getState" | "extra" | "endpoint" | "type" | "forced"
 * @returns
 */
export const prepareHeaders: prepareHeadersProps["prepareHeaders"] = async (
  headers,
  { getState }
) => {
  // By default, if we have a token in the store, let's use that for authenticated requests
  const token = (getState() as RootState).auth.token;
  headers.set("authorization", `Bearer ${token}`);
  return headers;
};
