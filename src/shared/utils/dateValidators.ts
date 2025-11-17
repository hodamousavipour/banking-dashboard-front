export const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export function isValidCalendarDate(value: string): boolean {
  if (!dateRegex.test(value)) return false;

  const [yearStr, monthStr, dayStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function isPastOrToday(value: string): boolean {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return d <= today;
}
export function isYearInRange(value: string, minYear: number, maxYear: number): boolean {
  const year = Number(value.slice(0, 4));
  if (Number.isNaN(year)) return false;
  return year >= minYear && year <= maxYear;
}