import { DateTime } from 'luxon';

export function businessTz() {
  return process.env.BUSINESS_TZ || 'Europe/Brussels';
}

export function parseIsoDateInTz(dateISO: string, tz: string) {
  // dateISO: YYYY-MM-DD
  const dt = DateTime.fromISO(dateISO, { zone: tz });
  if (!dt.isValid) throw new Error('Invalid date');
  return dt.startOf('day');
}
