import {
  getTime,
  format,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  isAfter,
  startOfMonth,
  startOfDay,
  endOfMonth,
  formatDistanceStrict,
} from 'date-fns';

/**
 * Formats a timestamp into a string with year and month, e.g. "2017-2".
 */
export function toUtcYearMonth(timestamp) {
  const date = new Date(timestamp * 1000);
  const monthStr = `0${date.getUTCMonth() + 1}`.slice(-2);
  return `${date.getUTCFullYear()}-${monthStr}`;
}

/**
 * Formats a timestamp into specified string representing UTC time.
 */
export function utcFormat(timestamp, formatString) {
  const localDate = new Date(utcToLocalDate(timestamp));
  return format(localDate, formatString);
}

/**
 * Formats a timestamp into a string with year, month, day, and time to seconds, e.g. "2017-05-22T19:17:19".
 */
export function toDateString(timestamp) {
  // NOTE(daniel): we're cutting off the tail which is milliseconds
  const date = new Date(timestamp * 1000);
  return date.toISOString().substring(0, 19);
}

/**
 * Formats a timestamp into a string with US date, e.g. "5/22/2017".
 */
export function toDateStringNoTime(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString('en-US');
}

/**
 * Returns the number of days remaining until specified end date.
 */
export function toDaysRemaining(endDate) {
  return Math.round((endDate - Date.now() / 1000) / (24 * 60 * 60));
}

export function toDateStringMonthName(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function toRelativeDateString(date, nowDate) {
  const startOfNowDate = startOfDay(nowDate);
  if (isAfter(date, startOfNowDate)) {
    return 'Today';
  }
  if (isAfter(date, addDays(startOfNowDate, -1))) {
    return 'Yesterday';
  }
  if (isAfter(date, addDays(startOfNowDate, -7))) {
    return format(date, 'dddd');
  }
  return format(date, 'MMMM D, YYYY');
}

/**
 * Returns string describing past date relative to now, e.g. '12 minutes'.
 */
export function formatSince(timeInSeconds) {
  return formatDistanceStrict(new Date(timeInSeconds * 1000), new Date());
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
function utcToLocalDate(utcSeconds) {
  const date = new Date(utcSeconds * 1000);
  const timeZoneOffset = date.getTimezoneOffset() * 60000;
  return date.getTime() + timeZoneOffset;
}

/**
 * Finds timestamp of local date as though it were UTC time.
 *
 * E.g. with an input of 2017-01-01 00:00 PST, return 1483228800, which represents 2017-01-01 00:00 UTC.
 */
function localDateToUtc(localDate) {
  const timeZoneOffset = localDate.getTimezoneOffset() * 60000;
  return (localDate.getTime() - timeZoneOffset) / 1000;
}

/**
 * Converts timestamp to UTC equivalent before modifying a date with specified function (and then converts back to UTC).
 *
 * This is to ensure that date modifications that would typically operate on local time instead operate on UTC.
 */
function utcModify(timeInSeconds, modifyFunc) {
  const localDate = utcToLocalDate(timeInSeconds);
  return localDateToUtc(modifyFunc(localDate));
}

/**
 * Treats timestamp as UTC while adding days.
 */
export function utcAddDays(timeInSeconds, daysToAdd) {
  return utcModify(timeInSeconds, date => addDays(date, daysToAdd));
}

/**
 * Treats timestamp as UTC while adding weeks.
 */
export function utcAddWeeks(timeInSeconds, weeksToAdd) {
  return utcModify(timeInSeconds, date => addWeeks(date, weeksToAdd));
}

/**
 * Treats timestamp as UTC while adding months.
 */
export function utcAddMonths(timeInSeconds, monthsToAdd) {
  return utcModify(timeInSeconds, date => addMonths(date, monthsToAdd));
}

/**
 * Treats timestamp as UTC while adding years.
 */
export function utcAddYears(timeInSeconds, yearsToAdd) {
  return utcModify(timeInSeconds, date => addYears(date, yearsToAdd));
}

/**
 * Returns the end of the month as a UTC date.
 */
export function utcEndOfMonth(currentTimeInSeconds = new Date().getTime() / 1000) {
  return utcModify(currentTimeInSeconds, date => endOfMonth(date));
}

/**
 * Returns the timestamp of the start of the month as a UTC date.
 */
export function utcStartOfMonth(timeInSeconds = new Date().getTime() / 1000) {
  return utcModify(timeInSeconds, localDate => startOfMonth(localDate));
}

/**
 * Returns the timestamp of the start of the day as a UTC date.
 */
export function utcStartOfDay(timeInSeconds = new Date().getTime() / 1000) {
  return utcModify(timeInSeconds, localDate => startOfDay(localDate));
}

export function objectIdToTimestamp(oid) {
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
  utcAddDays,
  utcAddWeeks,
  utcAddMonths,
  utcAddYears,
  utcEndOfMonth,
  utcStartOfMonth,
  utcStartOfDay,
  objectIdToTimestamp,
  formatSince,
};
