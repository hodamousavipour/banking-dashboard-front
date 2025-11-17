/**
 * Date formatting utilities using Intl.DateTimeFormat.
 * Keeps UI consistent and locale-aware.
 */

export type DateStyle = "full" | "long" | "medium" | "short";

export function formatDate(
  date: string | number | Date,
  {
    locale = navigator.language,
    dateStyle = "medium",
  }: { locale?: string; dateStyle?: DateStyle } = {}
): string {
  try {
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, { dateStyle }).format(d);
  } catch {
    // Fallback
    return new Date(date).toLocaleDateString();
  }
}

/**
 * ISO-safe parser that accepts Date | string | number.
 * Useful when normalizing server values before storing in form state.
 */
export function toISODateString(date: string | number | Date): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  // YYYY-MM-DD for <input type="date" />
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Compare two dates ignoring time (for validation, e.g., <= today).
 */
export function isOnOrBeforeToday(date: string | number | Date): boolean {
  const d = new Date(toISODateString(date));
  const today = new Date(toISODateString(new Date()));
  return d.getTime() <= today.getTime();
}