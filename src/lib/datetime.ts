import {
  getTime,
  format,
  addDays,
  isAfter,
  startOfDay,
} from 'date-fns';

/**
 * Formats a timestamp into a string with year and month, e.g. "2017-2".
 */
export function toUtcYearMonth(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const monthStr = `0${date.getUTCMonth() + 1}`.slice(-2);
  return `${date.getUTCFullYear()}-${monthStr}`;
}

/**
 * Formats a timestamp into specified string representing UTC time.
 */
export function utcFormat(timestamp: number, formatString: string) {
  const localDate = new Date(utcToLocalDate(timestamp));
  return format(localDate, formatString);
}

/**
 * Formats a timestamp into a string with year, month, day, and time to seconds, e.g. "2017-05-22T19:17:19".
 */
export function toDateString(timestamp: number) {
  // NOTE(daniel): we're cutting off the tail which is milliseconds
  const date = new Date(timestamp * 1000);
  return date.toISOString().substring(0, 19);
}

/**
 * Formats a timestamp into a string with US date, e.g. "5/22/2017".
 */
export function toDateStringNoTime(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString('en-US');
}

/**
 * Returns the number of days remaining until specified end date.
 */
export function toDaysRemaining(endDate: number) {
  return Math.round((endDate - Date.now() / 1000) / (24 * 60 * 60));
}

export function toDateStringMonthName(timestamp: number) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function toRelativeDateString(date: Date) {
  const nowDate = new Date();
  const startOfNowDate = startOfDay(nowDate);
  if (isAfter(date, startOfNowDate)) {
    return 'Today';
  }
  if (isAfter(date, addDays(startOfNowDate, -1))) {
    return 'Yesterday';
  }
  if (isAfter(date, addDays(startOfNowDate, -7))) {
    return format(date, 'EEEE');
  }
  return format(date, 'MMMM d, yyyy');
}

/**
 * Returns current time as whole seconds.
 */
export function nowAsSeconds() {
  return Math.round(getTime(new Date()) / 1000);
}

/**
 * Finds date of a timestamp in UTC and returns the same date/time in current time zone.
 *
 * E.g. 1483228800 is 2017-01-01 00:00 UTC, and this function adds a time zone offset to return 2017-01-01 00:00 PST.
 */
function utcToLocalDate(utcSeconds: number) {
  const date = new Date(utcSeconds * 1000);
  const timeZoneOffset = date.getTimezoneOffset() * 60000;
  return date.getTime() + timeZoneOffset;
}

/**
 * Finds timestamp of local date as though it were UTC time.
 *
 * E.g. with an input of 2017-01-01 00:00 PST, return 1483228800, which represents 2017-01-01 00:00 UTC.
 */
function localDateToUtc(localDate: Date) {
  const timeZoneOffset = localDate.getTimezoneOffset() * 60000;
  return (localDate.getTime() - timeZoneOffset) / 1000;
}


export function objectIdToTimestamp(oid: string) {
  return parseInt(oid.substring(0,8), 16);
}

export default {
  toDaysRemaining,
  toUtcYearMonth,
  utcFormat,
  toDateStringNoTime,
  toDateString,
  toDateStringMonthName,
  toRelativeDateString,
  nowAsSeconds,
  objectIdToTimestamp,
  localDateToUtc,
};
