interface FormatCurrencyOptions {
  compact?: boolean;
  showSign?: boolean;
  isExpense?: boolean;
  currency?: string;
  locale?: string;
  currencySymbol?: string;
}

export function formatCurrency(
  amount: number,
  options: FormatCurrencyOptions = {}
): string {
  const {
    compact = false,
    showSign = false,
    isExpense = false,
    currency = "USD",
    locale = "en-US",
    currencySymbol,
  } = options;

  const resolveSymbol = () =>
    currencySymbol ??
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    })
      .formatToParts(0)
      .find((p) => p.type === "currency")?.value ??
    "$";

  const symbol = resolveSymbol();

  if (!amount || isNaN(amount)) {
    return `${symbol}${new Intl.NumberFormat(locale, {
      minimumFractionDigits: compact ? 0 : 2,
      maximumFractionDigits: compact ? 0 : 2,
    }).format(0)}`;
  }

  const absAmount = Math.abs(amount);
  let formattedAmount: string;

  if (compact) {
    if (absAmount >= 1_000_000_000) {
      formattedAmount = `${(absAmount / 1_000_000_000).toFixed(1)}B`;
    } else if (absAmount >= 1_000_000) {
      formattedAmount = `${(absAmount / 1_000_000).toFixed(1)}M`;
    } else if (absAmount >= 1_000) {
      formattedAmount = `${(absAmount / 1_000).toFixed(1)}K`;
    } else {
      formattedAmount = absAmount.toFixed(absAmount % 1 === 0 ? 0 : 2);
    }

    const currencyValue = `${symbol}${formattedAmount}`;
    if (showSign) {
      return isExpense ? `-${currencyValue}` : `+${currencyValue}`;
    }
    return amount < 0 ? `-${currencyValue}` : currencyValue;
  }

  formattedAmount = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absAmount);

  const currencyValue = `${symbol}${formattedAmount}`;
  if (showSign) {
    return isExpense ? `-${currencyValue}` : `+${currencyValue}`;
  }
  return amount < 0 ? `-${currencyValue}` : currencyValue;
}
