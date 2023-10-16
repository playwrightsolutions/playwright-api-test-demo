import { expect as baseExpect } from "@playwright/test";

export { test } from "@playwright/test";

export const expect = baseExpect.extend({
  toBeValidDate(received: any) {
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
