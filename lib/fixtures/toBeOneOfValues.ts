import { expect as baseExpect } from "@playwright/test";

export { test } from "@playwright/test";

export const expect = baseExpect.extend({
  toBeOneOfValues(received: any, array: any[]) {
    const pass = array.includes(received);
    if (pass) {
      return {
        message: () => "passed",
        pass: true,
      };
    } else {
      return {
        message: () => `toBeOneOfValues() assertion failed.\nYou expected [${array}] to include '${received}'\n`,
        pass: false,
      };
    }
  },
});
