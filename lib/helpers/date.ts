/**
 * Function takes a Date and a number of days to add/subtract from today's date
 * if you need to subtract days pass a negative number
 * example: -1 wil return yesterday's date while passing 1 will return tomorrow
 *
 * @example
 * import { stringDateByDays } from "../helpers/date";
 *
 * let checkOutString = stringDateByDays(today, 5);
 * console.log(checkOutString) // 2023-03-24
 *
 * let checkOutString = stringDateByDays();
 * console.log(checkOutString) // 2023-03-19
 */
export function stringDateByDays(date?: Date, days = 0) {
  const today = date || new Date();
  if (days === 0) {
    return today.toISOString().split("T")[0];
  } else {
    const newDate = new Date(today.setDate(today.getDate() + days));
    return newDate.toISOString().split("T")[0];
  }
}

/**
 * Function takes a date as a string and validates that it can be parsed by Date.parse()
 * It returns a true or false, great for asserting of the data is properly formatted.
 */
export function isValidDate(date: string) {
  if (Date.parse(date)) {
    return true;
  } else {
    return false;
  }
}

// converts date to epoch number so it's easier to compare them
export function convertToEpoch(date: string): number | bigint {
  if (isValidDate(date)) {
    return Date.parse(date);
  }
}

/*
  it's hard to predict what date some parameters are and if they are even a date
  instead we get them in an array and iterate to check 
  if they are either a string or null
*/
export function checkObjectDateValues(object) {
  const dates = Object.keys(object).filter((key) => key.includes("_at"));
  dates.forEach((date) => {
    object[date] ? expect(isValidDate(object[date])).toBe(true) : expect(object[date]).toBe(null);
  });
}

export function todayDayAsNumberUTC() {
  return new Date().getDate();
}

export function todayDayAsNumberTimezone(timezone = "America/Chicago") {
  const date = new Date();

  return Number(date.toLocaleString("en-US", { timeZone: timezone }).split("/")[1]);
}

export function todayMonthAsNumber() {
  return new Date().getMonth();
}

export function todayYearAsNumber() {
  return new Date().getFullYear();
}
