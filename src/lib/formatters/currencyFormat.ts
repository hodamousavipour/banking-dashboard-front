/**
 * currencyFormat
 * Consistent currency formatting with sensible defaults.
 * - Default currency: EUR (assessment requirement)
 * - Default locale: uses browser locale; can be overridden
 *
 * Example:
 *   currencyFormat(1234.5)                    → "€1,234.50"
 *   currencyFormat(-20, { currency: "USD" })  → "-$20.00"
 */
type CurrencyFormatOptions = {
  currency?: string;   // e.g., "EUR", "USD"
  locale?: string;     // e.g., "en-US", "de-DE"
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};
export function currencyEUR(amount: number, opts?: CurrencyFormatOptions) {
  return currencyFormat(amount, { currency: "EUR", ...opts });
}
export function currencyFormat(
  amount: number,
  {
    currency = "EUR",
    locale = navigator.language,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  }: CurrencyFormatOptions = {}
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount);
  } catch {
    // Fallback if Intl fails (rare)
    const sign = amount < 0 ? "-" : "";
    const abs = Math.abs(amount).toFixed(2);
    return `${sign}${currency} ${abs}`;
  }
}

