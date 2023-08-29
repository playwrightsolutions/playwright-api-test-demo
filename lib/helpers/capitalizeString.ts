// capitalizes the first letter in a string

import { fail } from "assert";

export function capitalizeString(stringToCapitalize: string) {
  if (stringToCapitalize === "") fail("The string you passed is empty");

  return stringToCapitalize[0].toUpperCase() + stringToCapitalize.slice(1);
}
