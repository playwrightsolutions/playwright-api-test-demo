import { expect as expectNew } from "@playwright/test";

export { test } from "@playwright/test";

export const expect = expectNew.extend({
  toBeValidDate(received: string) {
    const pass = Date.parse(received) && typeof received === "string" ? true : false;
    if (pass) {
      return {
        message: () => "passed",
        pass: true,
      };
    } else {
      return {
        message: () => `toBeValidDate() assertion failed.\nYou expected '${received}' to be a valid date.\n`,
        pass: false,
      };
    }
  },
});
