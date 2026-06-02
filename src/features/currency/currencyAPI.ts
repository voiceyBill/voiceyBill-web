import { apiClient } from "@/app/api-client";
import {
  GetExchangeRateParams,
  GetExchangeRateResponse,
  GetSupportedCurrenciesResponse,
} from "./currencyType";

export const currencyApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getSupportedCurrencies: builder.query<
      GetSupportedCurrenciesResponse,
      void
    >({
      query: () => ({
        url: "/currency/supported",
        method: "GET",
      }),
    }),

    getExchangeRate: builder.query<
      GetExchangeRateResponse,
      GetExchangeRateParams
    >({
      query: ({ from, to }) => ({
        url: "/currency/rate",
        method: "GET",
        params: { from, to },
      }),
    }),
  }),
});

export const {
  useGetSupportedCurrenciesQuery,
  useGetExchangeRateQuery,
} = currencyApi;
