export interface SupportedCurrency {
  code: string;
  name: string;
  symbol: string;
}

export interface GetSupportedCurrenciesResponse {
  message: string;
  currencies: SupportedCurrency[];
}

export interface ExchangeRateData {
  from: string;
  to: string;
  rate: number;
  source: "live" | "cached";
  rateDate?: string;
}

export interface GetExchangeRateResponse {
  message: string;
  data: ExchangeRateData;
}

export interface GetExchangeRateParams {
  from: string;
  to: string;
}
