export function resolveTimezoneOffset(timezone: string, date = new Date()): number {
  const utc = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const localized = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  return localized.getTime() - utc.getTime();
}

export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

export function formatInTimezone(
  date: Date,
  timezone: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(undefined, { ...options, timeZone: timezone }).format(date);
}
