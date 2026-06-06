import { useTypedSelector } from "@/app/hook";
import { useGetSupportedCurrenciesQuery } from "@/features/currency/currencyAPI";
import { formatCurrency } from "@/lib/format-currency";

export function useFormatCurrency() {
  const { user } = useTypedSelector((state) => state.auth);
  const baseCurrency = user?.baseCurrency || "USD";
  const { data: currencyData } = useGetSupportedCurrenciesQuery();

  const currencySymbol = currencyData?.currencies?.find(
    (c) => c.code === baseCurrency
  )?.symbol ?? "$";

  return (amount: number, options = {}) =>
    formatCurrency(amount, {
      ...options,
      currency: baseCurrency,
      currencySymbol,
    });
}
